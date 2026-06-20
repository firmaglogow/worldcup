(() => {
  "use strict";

  const APP_STORAGE_KEY = "wc2026:v1";
  const SESSION_STORAGE_KEY = "wc2026:account-session";
  const MIGRATION_KEY_PREFIX = "wc2026:cloud-migrated:";
  const CONFIG = window.WC2026_SUPABASE || {};
  const SUPABASE_URL = String(CONFIG.url || "").replace(/\/+$/, "");
  const PUBLISHABLE_KEY = String(CONFIG.publishableKey || "");
  const CANONICAL_SITE_URL = (() => {
    const canonical =
      document.querySelector('link[rel="canonical"]')?.href ||
      "https://mistrzostwaswiata2026.pl/";
    try {
      return new URL(canonical).origin;
    } catch {
      return "https://mistrzostwaswiata2026.pl";
    }
  })();
  const AUTH_REDIRECT_URL = `${CANONICAL_SITE_URL}/?auth=confirm`;
  const IS_CONFIGURED =
    /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL) &&
    PUBLISHABLE_KEY.length > 20;
  const IS_PREVIEW =
    ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
    new URLSearchParams(window.location.search).get("account") === "preview";

  const state = {
    session: null,
    user: null,
    profile: null,
    authMode: "login",
    view: "account",
    message: "",
    messageType: "info",
    leaderboard: [],
    leaderboardLoading: false,
    modalOpen: false,
    ready: false,
    syncTimer: null,
    syncing: false,
    pendingSyncState: null,
  };

  const nativeStorage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {}
    },
    remove(key) {
      try {
        window.localStorage.removeItem(key);
      } catch {}
    },
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(nativeStorage.get(key) || "") || fallback;
    } catch {
      return fallback;
    }
  }

  function readAppState() {
    return readJson(APP_STORAGE_KEY, {});
  }

  function writeAppState(nextState) {
    nativeStorage.set(APP_STORAGE_KEY, JSON.stringify(nextState || {}));
  }

  function saveSession(session) {
    state.session = session;
    if (session) {
      nativeStorage.set(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      nativeStorage.remove(SESSION_STORAGE_KEY);
    }
  }

  function sessionExpiresSoon(session) {
    const expiresAt = Number(session?.expires_at || 0) * 1000;
    return !expiresAt || expiresAt - Date.now() < 60_000;
  }

  function authHeaders(accessToken) {
    return {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${accessToken || PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    };
  }

  async function request(path, options = {}) {
    const response = await fetch(`${SUPABASE_URL}${path}`, {
      ...options,
      headers: {
        ...authHeaders(options.accessToken),
        ...(options.headers || {}),
      },
    });
    const text = await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }
    if (!response.ok) {
      const message =
        payload?.msg ||
        payload?.message ||
        payload?.error_description ||
        payload?.error ||
        `Błąd połączenia (${response.status})`;
      throw new Error(message);
    }
    return payload;
  }

  function cleanAuthUrl() {
    const url = new URL(window.location.href);
    [
      "auth",
      "token_hash",
      "type",
      "code",
      "error",
      "error_code",
      "error_description",
      "access_token",
      "refresh_token",
      "expires_in",
      "expires_at",
      "token_type",
    ].forEach((key) => url.searchParams.delete(key));
    window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
  }

  function authParams() {
    return {
      search: new URLSearchParams(window.location.search),
      hash: new URLSearchParams(String(window.location.hash || "").replace(/^#/, "")),
    };
  }

  async function consumeSession(session, successMessage) {
    saveSession(session);
    state.user = await request("/auth/v1/user", {
      accessToken: session.access_token,
    });
    await hydrateFromCloud({ migrateLocal: true });
    state.message = successMessage;
      state.messageType = "success";
      state.modalOpen = true;
      state.view = "account";
      updateLauncher();
    renderModal();
    cleanAuthUrl();
  }

  function setAuthMode(mode) {
    state.authMode = mode;
    state.message = "";
    state.messageType = "info";
    renderModal();
  }

  async function handleAuthCallback() {
    const { search, hash } = authParams();
    const error = search.get("error") || hash.get("error");
    const errorCode = search.get("error_code") || hash.get("error_code");
    const errorDescription =
      search.get("error_description") || hash.get("error_description") || "";

    if (error || errorCode) {
      state.message = errorDescription
        ? `Nie udało się potwierdzić konta: ${errorDescription}`
        : "Nie udało się potwierdzić konta. Link mógł wygasnąć albo został już użyty.";
      state.messageType = "error";
      state.authMode = "login";
      state.modalOpen = true;
      state.view = "account";
      cleanAuthUrl();
      return;
    }

    const tokenHash = search.get("token_hash");
    const tokenType = search.get("type");
    if (tokenHash && tokenType === "email") {
      const session = await request("/auth/v1/verify", {
        method: "POST",
        body: JSON.stringify({
          token_hash: tokenHash,
          type: "email",
        }),
      });
      await consumeSession(
        session,
        "Konto zostało potwierdzone. Możesz już korzystać z typów.",
      );
      state.authMode = "login";
      return;
    }

    const accessToken = search.get("access_token") || hash.get("access_token");
    const refreshToken = search.get("refresh_token") || hash.get("refresh_token");
    if (accessToken && refreshToken) {
      const expiresIn = Number(
        search.get("expires_in") || hash.get("expires_in") || 3600,
      );
      const expiresAt =
        Number(search.get("expires_at") || hash.get("expires_at")) ||
        Math.floor(Date.now() / 1000) + expiresIn;
      await consumeSession(
        {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
          expires_at: expiresAt,
          token_type: search.get("token_type") || hash.get("token_type") || "bearer",
        },
        "Konto jest aktywne. Możesz już korzystać z typów.",
      );
      state.authMode = "login";
    }
  }

  async function refreshSession() {
    if (!state.session?.refresh_token) return null;
    const session = await request("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: state.session.refresh_token }),
    });
    saveSession(session);
    return session;
  }

  async function validAccessToken() {
    if (!state.session) return null;
    if (sessionExpiresSoon(state.session)) {
      await refreshSession();
    }
    return state.session?.access_token || null;
  }

  async function rest(path, options = {}) {
    const accessToken = await validAccessToken();
    if (!accessToken) throw new Error("Zaloguj się ponownie.");
    return request(`/rest/v1/${path}`, { ...options, accessToken });
  }

  function canonicalPrediction(outcome) {
    if (outcome === "1") return { hg: 1, ag: 0 };
    if (outcome === "2") return { hg: 0, ag: 1 };
    return { hg: 0, ag: 0 };
  }

  function predictionOutcome(prediction) {
    if (!prediction) return null;
    const difference = Number(prediction.hg) - Number(prediction.ag);
    if (difference > 0) return "1";
    if (difference < 0) return "2";
    return "X";
  }

  function upcomingMatchIds() {
    const fixtures = window.WC2026_MATCH_CENTER?.fixtures || [];
    const now = Date.now();
    return new Set(
      fixtures
        .filter((fixture) => {
          const kickoff = Date.parse(fixture.kickoff || "");
          return Number.isFinite(kickoff) && kickoff > now;
        })
        .map((fixture) => String(fixture.appMatchId)),
    );
  }

  function localPredictionRows(appState = readAppState()) {
    const upcoming = upcomingMatchIds();
    return Object.entries(appState.predictions || {})
      .filter(([matchId]) => upcoming.has(String(matchId)))
      .map(([matchId, prediction]) => ({
        match_id: Number(matchId),
        outcome: predictionOutcome(prediction),
      }))
      .filter(
        (prediction) =>
          Number.isInteger(prediction.match_id) &&
          ["1", "X", "2"].includes(prediction.outcome),
      );
  }

  async function fetchCloudData() {
    const [predictions, typingData, profiles] = await Promise.all([
      rest(
        `predictions?select=match_id,outcome&user_id=eq.${encodeURIComponent(
          state.user.id,
        )}`,
      ),
      rest(
        `user_typing_data?select=special_bets&user_id=eq.${encodeURIComponent(
          state.user.id,
        )}`,
      ),
      rest(
        `profiles?select=id,username&id=eq.${encodeURIComponent(state.user.id)}`,
      ),
    ]);
    state.profile = profiles?.[0] || null;
    return {
      predictions: predictions || [],
      specialBets: typingData?.[0]?.special_bets || {},
    };
  }

  async function pushAppState(appState = readAppState()) {
    if (!state.user) return;
    if (state.syncing) {
      state.pendingSyncState = appState;
      return;
    }
    if (IS_PREVIEW) {
      state.message = "Typy zostały zsynchronizowane w trybie podglądu.";
      state.messageType = "success";
      updateLauncher();
      renderModal();
      return;
    }
    state.syncing = true;
    updateLauncher();
    try {
      await rest("rpc/sync_my_predictions", {
        method: "POST",
        body: JSON.stringify({
          prediction_rows: localPredictionRows(appState),
          special_bets_payload: appState.specialBets || {},
        }),
      });
      state.message = "Typy zostały zsynchronizowane.";
      state.messageType = "success";
    } catch (error) {
      state.message = `Nie udało się zsynchronizować typów: ${error.message}`;
      state.messageType = "error";
    } finally {
      state.syncing = false;
      updateLauncher();
      renderModal();
      if (state.pendingSyncState) {
        const pendingState = state.pendingSyncState;
        state.pendingSyncState = null;
        pushAppState(pendingState);
      }
    }
  }

  function scheduleCloudSync(serializedState) {
    if (!state.user) return;
    window.clearTimeout(state.syncTimer);
    state.syncTimer = window.setTimeout(() => {
      let appState;
      try {
        appState = JSON.parse(serializedState);
      } catch {
        appState = readAppState();
      }
      pushAppState(appState);
    }, 250);
  }

  async function hydrateFromCloud({ migrateLocal = false } = {}) {
    const cloud = await fetchCloudData();
    const appState = readAppState();
    const cloudPredictions = Object.fromEntries(
      cloud.predictions.map((prediction) => [
        String(prediction.match_id),
        canonicalPrediction(prediction.outcome),
      ]),
    );
    const migrationKey = `${MIGRATION_KEY_PREFIX}${state.user.id}`;
    const shouldMigrate = migrateLocal && nativeStorage.get(migrationKey) !== "1";

    if (shouldMigrate) {
      appState.predictions = {
        ...cloudPredictions,
        ...(appState.predictions || {}),
      };
      appState.specialBets = {
        ...(cloud.specialBets || {}),
        ...(appState.specialBets || {}),
      };
      writeAppState(appState);
      await pushAppState(appState);
      nativeStorage.set(migrationKey, "1");
      const accepted = await fetchCloudData();
      appState.predictions = Object.fromEntries(
        accepted.predictions.map((prediction) => [
          String(prediction.match_id),
          canonicalPrediction(prediction.outcome),
        ]),
      );
      appState.specialBets = accepted.specialBets || {};
    } else {
      appState.predictions = cloudPredictions;
      appState.specialBets = cloud.specialBets || {};
    }
    writeAppState(appState);
  }

  async function restoreAccount() {
    if (IS_PREVIEW) {
      state.ready = true;
      return;
    }
    if (!IS_CONFIGURED) {
      state.ready = true;
      return;
    }
    const savedSession = readJson(SESSION_STORAGE_KEY, null);
    if (!savedSession) {
      state.ready = true;
      return;
    }
    saveSession(savedSession);
    try {
      const accessToken = await validAccessToken();
      state.user = await request("/auth/v1/user", { accessToken });
      await hydrateFromCloud();
    } catch {
      saveSession(null);
      state.user = null;
      state.profile = null;
    } finally {
      state.ready = true;
      updateLauncher();
    }
  }

  const bootPromise = (async () => {
    await handleAuthCallback();
    await restoreAccount();
  })();

  window.storage = {
    async get(key) {
      if (key === APP_STORAGE_KEY) await bootPromise;
      const value = nativeStorage.get(key);
      return value === null ? null : { value };
    },
    async set(key, value) {
      nativeStorage.set(key, value);
      if (key === APP_STORAGE_KEY) scheduleCloudSync(value);
    },
  };

  function setMessage(message, type = "info") {
    state.message = message;
    state.messageType = type;
    renderModal();
  }

  async function signInWithPassword(email, password) {
    if (IS_PREVIEW) {
      state.user = { id: "preview-user", email };
      state.profile = { id: "preview-user", username: "Kibic 2026" };
      setMessage("Zalogowano w trybie podglądu.", "success");
      updateLauncher();
      return;
    }
    const session = await request("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
    await consumeSession(
      session,
      "Zalogowano. Sesja została zapamiętana na tym urządzeniu.",
    );
  }

  async function signUpWithPassword(email, password) {
    if (IS_PREVIEW) {
      state.user = { id: "preview-user", email };
      state.profile = { id: "preview-user", username: "Kibic 2026" };
      setMessage("Konto utworzone w trybie podglądu.", "success");
      updateLauncher();
      return;
    }
    const result = await request("/auth/v1/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        options: {
          emailRedirectTo: AUTH_REDIRECT_URL,
        },
      }),
    });

    if (result?.session?.access_token) {
      await consumeSession(
        result.session,
        "Konto utworzone. Twoje typy są już połączone z kontem.",
      );
      return;
    }

    state.authMode = "login";
    setMessage(
      "Konto zostało utworzone. Sprawdź e-mail i potwierdź rejestrację, a potem zaloguj się hasłem.",
      "success",
    );
    updateLauncher();
  }

  async function updatePassword(password) {
    if (IS_PREVIEW) {
      setMessage("Hasło zapisane w trybie podglądu.", "success");
      return;
    }
    const accessToken = await validAccessToken();
    if (!accessToken) throw new Error("Najpierw zaloguj się do konta.");
    await request("/auth/v1/user", {
      method: "PUT",
      accessToken,
      body: JSON.stringify({
        password,
      }),
    });
    setMessage("Hasło zostało zapisane. Od teraz możesz logować się hasłem.", "success");
  }

  async function updateUsername(username) {
    if (IS_PREVIEW) {
      state.profile = { ...state.profile, username };
      setMessage("Pseudonim został zapisany w podglądzie.", "success");
      updateLauncher();
      return;
    }
    let profiles;
    try {
      profiles = await rest("profiles?on_conflict=id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify([{ id: state.user.id, username }]),
      });
    } catch (error) {
      if (/duplicate|unique|profiles_username/i.test(error.message)) {
        throw new Error("Ten pseudonim jest już zajęty. Wybierz inny.");
      }
      throw error;
    }
    state.profile = profiles?.[0] || { id: state.user.id, username };
    setMessage("Pseudonim został zapisany.", "success");
    updateLauncher();
  }

  async function signOut() {
    if (!IS_PREVIEW && state.session) {
      try {
        const accessToken = await validAccessToken();
        await request("/auth/v1/logout", {
          method: "POST",
          accessToken,
        });
      } catch {}
    }
    saveSession(null);
    state.user = null;
    state.profile = null;
    state.message = "Wylogowano.";
    state.messageType = "success";
    updateLauncher();
    renderModal();
  }

  async function deleteAccount() {
    if (
      !window.confirm(
        "Usunąć konto, pseudonim i wszystkie typy zapisane w chmurze? Tej operacji nie można cofnąć.",
      )
    ) {
      return;
    }
    if (!IS_PREVIEW) {
      await rest("rpc/delete_my_account", {
        method: "POST",
        body: "{}",
      });
    }
    saveSession(null);
    state.user = null;
    state.profile = null;
    state.modalOpen = false;
    updateLauncher();
    renderModal();
  }

  async function loadLeaderboard() {
    state.leaderboardLoading = true;
    renderModal();
    try {
      if (IS_PREVIEW) {
        state.leaderboard = [
          { rank: 1, username: "GolMaster", points: 7, hits: 7, typed: 8 },
          { rank: 2, username: "Kibic 2026", points: 6, hits: 6, typed: 8 },
          { rank: 3, username: "Biało-Czerwony", points: 5, hits: 5, typed: 7 },
        ];
      } else {
        state.leaderboard =
          (await request("/rest/v1/rpc/get_leaderboard", {
            method: "POST",
            body: JSON.stringify({ limit_count: 100 }),
          })) || [];
      }
    } catch (error) {
      state.message = `Nie udało się pobrać rankingu: ${error.message}`;
      state.messageType = "error";
    } finally {
      state.leaderboardLoading = false;
      renderModal();
    }
  }

  function accountContent() {
    if (state.user) {
      const username =
        state.profile?.username ||
        `Kibic-${String(state.user.id || "").replace(/-/g, "").slice(0, 6)}`;
      return `
        <section class="wc-account-profile">
          <div class="wc-account-avatar">${escapeHtml(username.slice(0, 1).toUpperCase())}</div>
          <div>
            <strong>${escapeHtml(username)}</strong>
            <span>${escapeHtml(state.user.email || "")}</span>
          </div>
        </section>
        <form class="wc-account-form" data-account-form="username">
          <label for="wc-account-username">Pseudonim widoczny w rankingu</label>
          <input id="wc-account-username" name="username" maxlength="24"
            minlength="3" pattern="[A-Za-zÀ-ž0-9 _.-]{3,24}"
            value="${escapeHtml(username)}" required>
          <button type="submit">Zapisz pseudonim</button>
        </form>
        <div class="wc-account-sync-status">
          <span class="wc-account-status-dot"></span>
          ${state.syncing ? "Synchronizowanie typów…" : "Typy są zapisane na koncie"}
        </div>
        <form class="wc-account-form" data-account-form="password">
          <label for="wc-account-password-new">Ustaw hasło do logowania</label>
          <input id="wc-account-password-new" name="password" type="password"
            autocomplete="new-password" minlength="8" placeholder="min. 8 znaków" required>
          <button type="submit">Zapisz hasło</button>
        </form>
        <div class="wc-account-actions">
          <button type="button" data-account-action="sync">Synchronizuj teraz</button>
          <button type="button" data-account-action="logout">Wyloguj</button>
          <button type="button" class="is-danger" data-account-action="delete">
            Usuń konto
          </button>
        </div>
      `;
    }

    const isLogin = state.authMode === "login";

    return `
      <div class="wc-account-intro">
        <strong>${isLogin ? "Zaloguj się do konta" : "Załóż konto typera"}</strong>
        <p>${isLogin ? "Logujesz się zwykłym hasłem. Sesja zostanie zapamiętana w tej przeglądarce, więc nie będziesz musiał robić tego od nowa." : "Zakładasz konto raz. Potem zawsze możesz wejść tym samym e-mailem i hasłem."}</p>
      </div>
      <nav class="wc-account-tabs wc-account-auth-tabs" aria-label="Logowanie i rejestracja">
        <button type="button" data-auth-mode="login" class="${
          isLogin ? "is-active" : ""
        }">Zaloguj się</button>
        <button type="button" data-auth-mode="register" class="${
          isLogin ? "" : "is-active"
        }">Załóż konto</button>
      </nav>
      <form class="wc-account-form" data-account-form="${isLogin ? "login" : "register"}">
        <label for="wc-account-email">Adres e-mail</label>
        <input id="wc-account-email" name="email" type="email"
          autocomplete="email" placeholder="twoj@email.pl" required>
        <label for="wc-account-password">Hasło</label>
        <input id="wc-account-password" name="password" type="password"
          autocomplete="${isLogin ? "current-password" : "new-password"}"
          minlength="8" placeholder="min. 8 znaków" required>
        <button type="submit">${isLogin ? "Zaloguj się" : "Utwórz konto"}</button>
      </form>
      <p class="wc-account-privacy">
        Bez konta typy nadal zapisują się lokalnie w tej przeglądarce.
      </p>
    `;
  }

  function leaderboardContent() {
    if (state.leaderboardLoading) {
      return `<div class="wc-account-loading">Ładowanie rankingu…</div>`;
    }
    if (!state.leaderboard.length) {
      return `
        <div class="wc-account-empty">
          <strong>Ranking czeka na pierwszych typerów</strong>
          <p>Za każdy poprawnie wskazany wynik 1/X/2 przyznawany jest 1 punkt.</p>
        </div>
      `;
    }
    return `
      <div class="wc-leaderboard-head">
        <span>#</span><span>Typer</span><span>Punkty</span><span>Trafione</span>
      </div>
      <ol class="wc-leaderboard">
        ${state.leaderboard
          .map(
            (entry) => `
              <li class="${
                entry.username === state.profile?.username ? "is-current" : ""
              }">
                <span class="wc-leaderboard-rank">${escapeHtml(entry.rank)}</span>
                <strong>${escapeHtml(entry.username)}</strong>
                <b>${escapeHtml(entry.points)}</b>
                <span>${escapeHtml(entry.hits)} / ${escapeHtml(entry.typed)}</span>
              </li>
            `,
          )
          .join("")}
      </ol>
    `;
  }

  function renderModal() {
    const modal = document.querySelector("[data-account-modal]");
    if (!modal) return;
    modal.hidden = !state.modalOpen;
    if (!state.modalOpen) return;

    const body = modal.querySelector("[data-account-body]");
    const message = modal.querySelector("[data-account-message]");
    body.innerHTML =
      state.view === "ranking" ? leaderboardContent() : accountContent();
    message.hidden = !state.message;
    message.className = `wc-account-message is-${state.messageType}`;
    message.textContent = state.message;
    modal
      .querySelectorAll("[data-account-view]")
      .forEach((button) =>
        button.classList.toggle(
          "is-active",
          button.dataset.accountView === state.view,
        ),
      );
  }

  function launcherLabel() {
    if (state.syncing) return "Synchronizacja…";
    if (state.user) return state.profile?.username || "Moje konto";
    return "Zaloguj się";
  }

  function updateLauncher() {
    const launcher = document.querySelector("[data-account-launcher]");
    if (!launcher) return;
    launcher.innerHTML = `
      <span class="wc-account-launcher-icon" aria-hidden="true">${
        state.user ? "✓" : "♙"
      }</span>
      <span>${escapeHtml(launcherLabel())}</span>
    `;
    launcher.classList.toggle("is-signed-in", Boolean(state.user));
    launcher.classList.toggle("is-syncing", state.syncing);
  }

  function openModal(view = "account") {
    state.view = view;
    state.modalOpen = true;
    renderModal();
    if (view === "ranking" && !state.leaderboard.length) loadLeaderboard();
    window.setTimeout(() => {
      document
        .querySelector("[data-account-modal] input, [data-account-close]")
        ?.focus();
    }, 0);
  }

  function buildUi() {
    if ((!IS_CONFIGURED && !IS_PREVIEW) || document.querySelector("[data-account-modal]")) {
      return;
    }

    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "wc-account-launcher";
    launcher.dataset.accountLauncher = "";
    launcher.setAttribute("aria-haspopup", "dialog");
    launcher.addEventListener("click", () => openModal("account"));

    const modal = document.createElement("div");
    modal.className = "wc-account-modal";
    modal.dataset.accountModal = "";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="wc-account-backdrop" data-account-close></div>
      <section class="wc-account-dialog" role="dialog" aria-modal="true"
        aria-labelledby="wc-account-title">
        <header>
          <div>
            <span class="wc-account-kicker">MÓJ TYP</span>
            <h2 id="wc-account-title">Konto typera</h2>
          </div>
          <button type="button" class="wc-account-close" data-account-close
            aria-label="Zamknij">×</button>
        </header>
        <nav class="wc-account-tabs" aria-label="Konto i ranking">
          <button type="button" data-account-view="account">Konto</button>
          <button type="button" data-account-view="ranking">Ranking</button>
        </nav>
        <div data-account-message hidden></div>
        <div class="wc-account-body" data-account-body></div>
      </section>
    `;

    document.body.append(launcher, modal);
    updateLauncher();
    renderModal();

    modal.addEventListener("click", async (event) => {
      const close = event.target.closest("[data-account-close]");
      if (close) {
        state.modalOpen = false;
        renderModal();
        launcher.focus();
        return;
      }
      const viewButton = event.target.closest("[data-account-view]");
      if (viewButton) {
        state.view = viewButton.dataset.accountView;
        state.message = "";
        renderModal();
        if (state.view === "ranking") loadLeaderboard();
        return;
      }
      const action = event.target.closest("[data-account-action]")?.dataset
        .accountAction;
      if (!action) return;
      try {
        if (action === "back") {
          state.message = "";
          state.authMode = "login";
          renderModal();
        } else if (action === "sync") {
          await pushAppState();
        } else if (action === "logout") {
          await signOut();
        } else if (action === "delete") {
          await deleteAccount();
        }
      } catch (error) {
        setMessage(error.message, "error");
      }
    });

    modal.addEventListener("submit", async (event) => {
      const form = event.target.closest("[data-account-form]");
      if (!form) return;
      event.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      try {
        const data = new FormData(form);
        if (form.dataset.accountForm === "login") {
          await signInWithPassword(
            String(data.get("email") || "").trim().toLowerCase(),
            String(data.get("password") || ""),
          );
        } else if (form.dataset.accountForm === "register") {
          await signUpWithPassword(
            String(data.get("email") || "").trim().toLowerCase(),
            String(data.get("password") || ""),
          );
        } else if (form.dataset.accountForm === "password") {
          await updatePassword(String(data.get("password") || ""));
        } else if (form.dataset.accountForm === "username") {
          await updateUsername(String(data.get("username") || "").trim());
        }
      } catch (error) {
        setMessage(error.message, "error");
      } finally {
        submit.disabled = false;
      }
    });

    modal.addEventListener("click", (event) => {
      const authMode = event.target.closest("[data-auth-mode]")?.dataset.authMode;
      if (!authMode) return;
      setAuthMode(authMode);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.modalOpen) {
        state.modalOpen = false;
        renderModal();
        launcher.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUi, { once: true });
  } else {
    buildUi();
  }

  window.WC2026_ACCOUNT = {
    configured: IS_CONFIGURED,
    preview: IS_PREVIEW,
    open: openModal,
    sync: () => pushAppState(),
  };
})();
