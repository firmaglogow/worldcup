(function renderMatchDetails() {
  const page = document.querySelector("[data-match-page]");
  const schedule = window.WC2026_MATCHES;
  if (!page || !schedule) return;

  const matchId = Number(new URLSearchParams(window.location.search).get("id"));
  const match = schedule.matches.find((item) => item.id === matchId);
  const fixture = (window.WC2026_MATCH_CENTER?.fixtures || []).find(
    (item) => item.appMatchId === matchId,
  );
  const finishedStatuses = new Set(["FT", "AET", "PEN"]);
  const liveStatuses = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE"]);

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function teamDetails(side) {
    const code = match?.[`${side}Code`];
    const scheduledTeam = code ? schedule.teams[code] : null;
    return {
      name:
        scheduledTeam?.name ||
        fixture?.teams?.[side]?.name ||
        match?.[`${side}Label`] ||
        "Do ustalenia",
      flag: scheduledTeam?.flag || "⚽",
    };
  }

  function formatDate(date, time) {
    if (!date) return "";
    const value = new Date(`${date}T${time || "12:00"}:00`);
    return new Intl.DateTimeFormat("pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(value);
  }

  function statusLabel() {
    const short = fixture?.status?.short;
    if (finishedStatuses.has(short)) {
      if (short === "PEN") return "Zakończony po rzutach karnych";
      if (short === "AET") return "Zakończony po dogrywce";
      return "Mecz zakończony";
    }
    if (short === "HT") return "PRZERWA";
    if (liveStatuses.has(short)) {
      return fixture.status.elapsed
        ? `NA ŻYWO · ${fixture.status.elapsed}'`
        : "NA ŻYWO";
    }
    if (short && !["NS", "TBD"].includes(short)) {
      return fixture.status.long || "Aktualizacja terminu";
    }
    return "Mecz zaplanowany";
  }

  function eventIcon(event) {
    if (event.type === "Goal") return "⚽";
    if (event.type === "subst") return "↔";
    if (event.detail?.includes("Yellow")) return "▰";
    if (event.detail?.includes("Red")) return "■";
    if (event.type === "Var") return "VAR";
    return "•";
  }

  function localizedTeamName(teamName, home, away) {
    if (teamName === fixture?.teams?.home?.name) return home.name;
    if (teamName === fixture?.teams?.away?.name) return away.name;
    return teamName;
  }

  function localizedEventDetail(detail) {
    const translations = {
      "Normal Goal": "Gol",
      "Penalty": "Gol z rzutu karnego",
      "Own Goal": "Gol samobójczy",
      "Missed Penalty": "Niewykorzystany rzut karny",
      "Yellow Card": "Żółta kartka",
      "Red Card": "Czerwona kartka",
      "Second Yellow card": "Druga żółta kartka",
      "Goal cancelled": "Gol anulowany",
    };
    return translations[detail] || detail;
  }

  function renderEvents(home, away) {
    const container = document.querySelector("[data-match-events]");
    const events = fixture?.events || [];
    if (!container || events.length === 0) return;

    container.className = "match-events";
    container.innerHTML = events
      .map((event) => {
        const minute = event.elapsed
          ? `${event.elapsed}${event.extra ? `+${event.extra}` : ""}'`
          : "";
        const assist = event.assist
          ? `<small>Asysta: ${escapeHtml(event.assist)}</small>`
          : "";
        return `
          <article class="match-event ${event.type === "Goal" ? "is-goal" : ""}">
            <time>${escapeHtml(minute)}</time>
            <span class="match-event-icon">${eventIcon(event)}</span>
            <div>
              <strong>${escapeHtml(event.player || event.detail)}</strong>
              <span>${escapeHtml(localizedTeamName(event.team, home, away))} · ${escapeHtml(localizedEventDetail(event.detail))}</span>
              ${assist}
            </div>
          </article>
        `;
      })
      .join("");
  }

  const statisticLabels = [
    ["Ball Possession", "Posiadanie piłki"],
    ["Total Shots", "Strzały"],
    ["Shots on Goal", "Strzały celne"],
    ["Corner Kicks", "Rzuty rożne"],
    ["Fouls", "Faule"],
    ["Offsides", "Spalone"],
    ["Yellow Cards", "Żółte kartki"],
    ["Red Cards", "Czerwone kartki"],
    ["Goalkeeper Saves", "Obrony bramkarzy"],
    ["Passes accurate", "Celne podania"],
  ];

  function renderStatistics(home, away) {
    const container = document.querySelector("[data-match-statistics]");
    const section = document.querySelector("[data-match-statistics-section]");
    const statistics = fixture?.statistics || [];
    if (!container || statistics.length === 0) return;

    const homeStats =
      statistics.find((item) => item.team === fixture.teams.home.name)?.values ||
      statistics[0]?.values ||
      {};
    const awayStats =
      statistics.find((item) => item.team === fixture.teams.away.name)?.values ||
      statistics[1]?.values ||
      {};
    const rows = statisticLabels.filter(
      ([key]) => homeStats[key] != null || awayStats[key] != null,
    );
    if (rows.length === 0) return;

    if (section) {
      section.hidden = false;
      section.parentElement?.classList.remove("is-single-panel");
    }
    container.className = "match-statistics";
    container.innerHTML = `
      <div class="match-statistics-head">
        <strong>${escapeHtml(home.name)}</strong>
        <strong>${escapeHtml(away.name)}</strong>
      </div>
      ${rows
        .map(
          ([key, label]) => `
            <div class="match-statistic-row">
              <strong>${escapeHtml(homeStats[key] ?? "–")}</strong>
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(awayStats[key] ?? "–")}</strong>
            </div>
          `,
        )
        .join("")}
    `;
  }

  function renderLineup(lineup, home, away) {
    const teamName = localizedTeamName(lineup.team, home, away);
    return `
      <article class="match-lineup">
        <div class="match-lineup-head">
          <div>
            <h3>${escapeHtml(teamName)}</h3>
            <p>Ustawienie: ${escapeHtml(lineup.formation || "brak danych")}</p>
          </div>
          <span>Trener: ${escapeHtml(lineup.coach || "brak danych")}</span>
        </div>
        <ol>
          ${(lineup.startXI || [])
            .map(
              (player) => `
                <li>
                  <span>${escapeHtml(player.number ?? "–")}</span>
                  <strong>${escapeHtml(player.name)}</strong>
                  <small>${escapeHtml(player.position || "")}</small>
                </li>
              `,
            )
            .join("")}
        </ol>
        ${
          lineup.substitutes?.length
            ? `
              <details>
                <summary>Rezerwowi (${lineup.substitutes.length})</summary>
                <p>${lineup.substitutes
                  .map(
                    (player) =>
                      `${escapeHtml(player.number ?? "–")}. ${escapeHtml(player.name)}`,
                  )
                  .join(" · ")}</p>
              </details>
            `
            : ""
        }
      </article>
    `;
  }

  function renderLineups(home, away) {
    const container = document.querySelector("[data-match-lineups]");
    const section = document.querySelector("[data-match-lineups-section]");
    const lineups = fixture?.lineups || [];
    if (!container || lineups.length === 0) return;

    if (section) section.hidden = false;
    container.className = "match-lineups";
    container.innerHTML = lineups
      .map((lineup) => renderLineup(lineup, home, away))
      .join("");
  }

  if (!Number.isInteger(matchId) || !match) {
    document.title = "Nie znaleziono meczu – Mistrzostwa Świata 2026";
    page.innerHTML = `
      <a class="match-page-back" href="index.html">← Wróć do terminarza</a>
      <section class="match-page-card match-not-found">
        <h1>Nie znaleziono tego meczu</h1>
        <p>Wybierz spotkanie bezpośrednio z terminarza.</p>
      </section>
    `;
    return;
  }

  const home = teamDetails("home");
  const away = teamDetails("away");
  const status = statusLabel();
  const hasScore =
    Number.isInteger(fixture?.goals?.home) &&
    Number.isInteger(fixture?.goals?.away);
  const halftime = fixture?.score?.halftime;

  document.title = `${home.name} – ${away.name} | MŚ 2026`;
  setText("[data-match-round]", `${match.round} · mecz #${match.id}`);
  setText(
    "[data-match-meta]",
    `${formatDate(match.date, match.time)} · ${match.stadium}, ${match.city}`,
  );
  setText("[data-home-name]", home.name);
  setText("[data-away-name]", away.name);
  setText("[data-home-flag]", home.flag);
  setText("[data-away-flag]", away.flag);
  setText("[data-match-status]", status);
  setText(
    "[data-match-score]",
    hasScore ? `${fixture.goals.home} : ${fixture.goals.away}` : "– : –",
  );
  setText(
    "[data-match-halftime]",
    Number.isInteger(halftime?.home) && Number.isInteger(halftime?.away)
      ? `Do przerwy: ${halftime.home}:${halftime.away}`
      : "",
  );
  setText(
    "[data-match-update]",
    window.WC2026_MATCH_CENTER?.updatedAt
      ? `Dane zaktualizowano: ${new Intl.DateTimeFormat("pl-PL", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(window.WC2026_MATCH_CENTER.updatedAt))}`
      : "Oczekiwanie na pierwszą aktualizację bezpłatnego źródła wyników.",
  );

  const statusElement = document.querySelector("[data-match-status]");
  if (statusElement) {
    statusElement.classList.toggle(
      "is-live",
      liveStatuses.has(fixture?.status?.short),
    );
    statusElement.classList.toggle(
      "is-finished",
      finishedStatuses.has(fixture?.status?.short),
    );
  }

  renderEvents(home, away);
  renderStatistics(home, away);
  renderLineups(home, away);

  const kickoff = new Date(
    `${match.date}T${match.time || "12:00"}:00+02:00`,
  ).getTime();
  const now = Date.now();
  const refreshWindow =
    !finishedStatuses.has(fixture?.status?.short) &&
    now >= kickoff - 10 * 60 * 1000 &&
    now <= kickoff + 4 * 60 * 60 * 1000;
  if (refreshWindow) {
    window.setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set("live", String(Math.floor(Date.now() / 300000)));
      window.location.replace(url);
    }, 5 * 60 * 1000);
  }
})();
