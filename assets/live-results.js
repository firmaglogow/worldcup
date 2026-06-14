(function refreshLiveCommunityResults() {
  "use strict";

  const ENDPOINT = "https://worldcup26.ir/get/games";
  const CACHE_KEY = "wc2026:live-fixtures-v1";
  const APP_STORAGE_KEY = "wc2026:v1";
  const PENDING_RELOAD_KEY = "wc2026:live-results-pending";
  const FINISHED = new Set(["FT", "AET", "PEN"]);
  const STATUS_RANK = {
    NS: 0,
    PST: 0,
    CANC: 0,
    LIVE: 1,
    "1H": 1,
    HT: 2,
    "2H": 3,
    ET: 4,
    FT: 5,
    AET: 5,
    PEN: 5,
  };
  const SAFE_RELOAD_TABS = new Set([
    "Mecze",
    "Tabele grup",
    "Tabele",
    "Statystyki",
    "Staty",
    "Faza pucharowa",
    "Puchar",
  ]);

  const schedule = window.WC2026_MATCHES;
  const matchCenter = window.WC2026_MATCH_CENTER;
  if (!schedule?.matches?.length || !matchCenter?.fixtures?.length) return;

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const aliases = new Map([
    ["bosnia-and-herzegovina", "BIH"],
    ["bosnia-herzegovina", "BIH"],
    ["cape-verde", "CPV"],
    ["cote-divoire", "CIV"],
    ["curacao", "CUW"],
    ["czech-republic", "CZE"],
    ["czechia", "CZE"],
    ["democratic-republic-of-the-congo", "COD"],
    ["dr-congo", "COD"],
    ["congo-dr", "COD"],
    ["ivory-coast", "CIV"],
    ["korea-republic", "KOR"],
    ["saudi-arabia", "KSA"],
    ["south-africa", "RSA"],
    ["south-korea", "KOR"],
    ["turkey", "TUR"],
    ["turkiye", "TUR"],
    ["united-states", "USA"],
    ["usa", "USA"],
  ]);

  Object.values(schedule.teams || {}).forEach((team) => {
    aliases.set(normalize(team.name), team.code);
    aliases.set(normalize(team.providerName), team.code);
  });

  function teamCode(value) {
    return aliases.get(normalize(value)) || null;
  }

  const matchesByPair = new Map(
    schedule.matches
      .filter((match) => match.homeCode && match.awayCode)
      .map((match) => [`${match.homeCode}:${match.awayCode}`, match]),
  );
  const fixturesById = new Map(
    matchCenter.fixtures.map((fixture) => [Number(fixture.appMatchId), fixture]),
  );

  function integerOrNull(value) {
    if (value === null || value === undefined || value === "") return null;
    const result = Number(value);
    return Number.isInteger(result) ? result : null;
  }

  function statusFor(game) {
    const finished =
      game.finished === true ||
      String(game.finished || "").toLowerCase() === "true";
    if (finished) {
      return { short: "FT", long: "Mecz zakończony", elapsed: null };
    }

    const elapsedText = String(game.time_elapsed || "").toLowerCase();
    if (
      !elapsedText ||
      ["notstarted", "not-started", "scheduled"].includes(elapsedText)
    ) {
      return { short: "NS", long: "Mecz zaplanowany", elapsed: null };
    }
    if (elapsedText.includes("half")) {
      return { short: "HT", long: "Przerwa", elapsed: 45 };
    }
    if (elapsedText.includes("postpon")) {
      return { short: "PST", long: "Mecz przełożony", elapsed: null };
    }
    if (elapsedText.includes("cancel")) {
      return { short: "CANC", long: "Mecz odwołany", elapsed: null };
    }

    const elapsed = Number.parseInt(elapsedText, 10);
    return {
      short: "LIVE",
      long: "Mecz trwa",
      elapsed: Number.isInteger(elapsed) ? elapsed : null,
    };
  }

  function scorerItems(value) {
    const source = String(value || "").trim();
    if (!source || source.toLowerCase() === "null") return [];

    const scorers = [];
    const itemPattern = /"([^"]+)"|([^,{}]+)/g;
    for (const match of source.matchAll(itemPattern)) {
      const item = (match[1] || match[2] || "").trim();
      const scorer = item.match(/^(.+?)\s+(\d+)(?:\+(\d+))?'$/);
      if (!scorer) continue;
      scorers.push({
        player: scorer[1].trim(),
        elapsed: Number(scorer[2]),
        extra: scorer[3] ? Number(scorer[3]) : null,
      });
    }
    return scorers;
  }

  function eventsFor(game) {
    const createEvents = (value, team) =>
      scorerItems(value).map((scorer) => ({
        elapsed: scorer.elapsed,
        extra: scorer.extra,
        team,
        player: scorer.player,
        assist: "",
        type: "Goal",
        detail: "Normal Goal",
        comments: "",
      }));

    return [
      ...createEvents(game.home_scorers, game.home_team_name_en),
      ...createEvents(game.away_scorers, game.away_team_name_en),
    ].sort(
      (first, second) =>
        first.elapsed - second.elapsed ||
        (first.extra || 0) - (second.extra || 0),
    );
  }

  function fixtureFromGame(game) {
    const homeCode = teamCode(game.home_team_name_en);
    const awayCode = teamCode(game.away_team_name_en);
    const appMatch =
      homeCode && awayCode
        ? matchesByPair.get(`${homeCode}:${awayCode}`)
        : null;
    if (!appMatch) return null;

    const existing = fixturesById.get(Number(appMatch.id));
    if (!existing) return null;

    const status = statusFor(game);
    if (
      FINISHED.has(existing.status?.short) &&
      FINISHED.has(status.short)
    ) {
      return null;
    }

    const homeGoals = integerOrNull(game.home_score);
    const awayGoals = integerOrNull(game.away_score);
    const hasScore =
      status.short !== "NS" &&
      Number.isInteger(homeGoals) &&
      Number.isInteger(awayGoals);
    const events = eventsFor(game);
    const halftime =
      status.short === "HT" && hasScore
        ? { home: homeGoals, away: awayGoals }
        : existing.score?.halftime || { home: null, away: null };

    return {
      ...existing,
      status,
      teams: {
        home: {
          ...existing.teams.home,
          name: game.home_team_name_en || existing.teams.home.name,
          winner: hasScore ? homeGoals > awayGoals : null,
        },
        away: {
          ...existing.teams.away,
          name: game.away_team_name_en || existing.teams.away.name,
          winner: hasScore ? awayGoals > homeGoals : null,
        },
      },
      goals: {
        home: hasScore ? homeGoals : null,
        away: hasScore ? awayGoals : null,
      },
      score: {
        ...existing.score,
        halftime,
        fulltime:
          FINISHED.has(status.short) && hasScore
            ? { home: homeGoals, away: awayGoals }
            : existing.score?.fulltime || { home: null, away: null },
      },
      events: events.length ? events : existing.events || [],
      detailsFetchedAt: hasScore
        ? new Date().toISOString()
        : existing.detailsFetchedAt,
      dataSource: "WorldCup26",
    };
  }

  function fixtureSignature(fixture) {
    return JSON.stringify({
      status: fixture.status,
      goals: fixture.goals,
      halftime: fixture.score?.halftime,
      fulltime: fixture.score?.fulltime,
      events: fixture.events,
    });
  }

  function mergeFixture(incoming) {
    const existing = fixturesById.get(Number(incoming.appMatchId));
    if (!existing) return false;

    const existingRank = STATUS_RANK[existing.status?.short] ?? 0;
    const incomingRank = STATUS_RANK[incoming.status?.short] ?? 0;
    if (FINISHED.has(existing.status?.short) && !FINISHED.has(incoming.status?.short)) {
      return false;
    }
    if (incomingRank < existingRank) return false;
    if (fixtureSignature(existing) === fixtureSignature(incoming)) return false;

    Object.assign(existing, incoming);
    return true;
  }

  function loadCachedFixtures() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      (cached.fixtures || []).forEach(mergeFixture);
      if (cached.updatedAt) matchCenter.updatedAt = cached.updatedAt;
    } catch (error) {
      console.warn("Nie udało się odczytać podręcznych wyników.", error);
    }
  }

  function syncApplicationStorage() {
    const groupResults = {};
    const knockoutResults = {};

    matchCenter.fixtures.forEach((fixture) => {
      if (
        !FINISHED.has(fixture.status?.short) ||
        !Number.isInteger(fixture.goals?.home) ||
        !Number.isInteger(fixture.goals?.away)
      ) {
        return;
      }
      const result = { hg: fixture.goals.home, ag: fixture.goals.away };
      if (fixture.appMatchId <= 72) groupResults[fixture.appMatchId] = result;
      else knockoutResults[fixture.appMatchId] = result;
    });

    try {
      const current = JSON.parse(localStorage.getItem(APP_STORAGE_KEY) || "{}");
      current.results = groupResults;
      current.koResults = knockoutResults;
      current.lastSync = matchCenter.updatedAt;
      current.autoSync = true;
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(current));
    } catch (error) {
      console.warn("Nie udało się zapisać najnowszych wyników.", error);
    }
  }

  function saveLiveFixtures(fixtures) {
    const updatedAt = new Date().toISOString();
    matchCenter.updatedAt = updatedAt;
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ updatedAt, fixtures }),
    );
    syncApplicationStorage();
  }

  function activeTabName() {
    const active = [...document.querySelectorAll("button")].find((button) =>
      button.classList.contains("border-amber-400"),
    );
    return active?.textContent.trim() || "";
  }

  function reloadWhenSafe() {
    if (document.querySelector("[data-match-page]")) {
      window.location.reload();
      return;
    }
    if (SAFE_RELOAD_TABS.has(activeTabName())) {
      window.location.reload();
      return;
    }
    sessionStorage.setItem(PENDING_RELOAD_KEY, "true");
  }

  function shouldRefreshNow() {
    const now = Date.now();
    return schedule.matches.some((match) => {
      const kickoff = new Date(`${match.date}T${match.time}:00+02:00`).getTime();
      return now >= kickoff - 20 * 60 * 1000 && now <= kickoff + 8 * 60 * 60 * 1000;
    });
  }

  async function refresh() {
    try {
      const response = await fetch(ENDPOINT, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const liveFixtures = [];
      let changed = false;

      (payload.games || []).forEach((game) => {
        const fixture = fixtureFromGame(game);
        if (!fixture || fixture.status.short === "NS") return;
        liveFixtures.push(fixture);
        if (mergeFixture(fixture)) changed = true;
      });

      if (!changed) return;
      saveLiveFixtures(liveFixtures);
      window.dispatchEvent(new CustomEvent("wc2026:live-results-updated"));
      window.setTimeout(reloadWhenSafe, 150);
    } catch (error) {
      console.warn("Awaryjne pobieranie wyników nie powiodło się.", error);
    }
  }

  loadCachedFixtures();
  syncApplicationStorage();

  document.addEventListener("click", (event) => {
    if (sessionStorage.getItem(PENDING_RELOAD_KEY) !== "true") return;
    const button = event.target.closest("button");
    if (!button || !SAFE_RELOAD_TABS.has(button.textContent.trim())) return;
    sessionStorage.removeItem(PENDING_RELOAD_KEY);
    window.setTimeout(() => window.location.reload(), 50);
  });

  if (shouldRefreshNow()) {
    refresh();
    window.setInterval(() => {
      if (!document.hidden && shouldRefreshNow()) refresh();
    }, 60 * 1000);
  }
})();
