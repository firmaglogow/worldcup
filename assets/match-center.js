(function enhanceMatchCards() {
  const schedule = window.WC2026_MATCHES;
  if (!schedule?.matches?.length) return;

  const fixtureByMatchId = new Map(
    (window.WC2026_MATCH_CENTER?.fixtures || [])
      .filter((fixture) => fixture.appMatchId)
      .map((fixture) => [fixture.appMatchId, fixture]),
  );
  const matchById = new Map(
    schedule.matches.map((match) => [Number(match.id), match]),
  );
  const groupMatches = schedule.matches.filter(
    (match) => match.phase === "group",
  );
  const teamNames = new Set(
    Object.values(schedule.teams).map((team) => team.name),
  );
  const stadiumCapacities = {
    "Estadio Azteca": "83 000",
    "Estadio Akron": "48 000",
    "Estadio BBVA": "53 500",
    "BMO Field": "45 000",
    "BC Place": "54 000",
    "MetLife Stadium": "82 500",
    "SoFi Stadium": "70 000",
    "Levi's Stadium": "71 000",
    "NRG Stadium": "72 000",
    "AT&T Stadium": "94 000",
    "Gillette Stadium": "65 000",
    "Lincoln Financial Field": "69 000",
    "Hard Rock Stadium": "65 000",
    "Mercedes-Benz Stadium": "75 000",
    "Arrowhead Stadium": "73 000",
    "Lumen Field": "69 000",
  };

  function kickoffForFixture(fixture) {
    const match = fixture?.appMatchId
      ? matchById.get(Number(fixture.appMatchId))
      : null;
    if (!match?.date || !match?.time) return null;
    return new Date(`${match.date}T${match.time}:00+02:00`);
  }

  function scoreFromEvents(fixture) {
    const totals = { home: 0, away: 0 };
    const homeName = fixture?.teams?.home?.name || "";
    const awayName = fixture?.teams?.away?.name || "";
    (fixture?.events || []).forEach((event) => {
      if (event.type !== "Goal") return;
      if (event.team === homeName) totals.home += 1;
      if (event.team === awayName) totals.away += 1;
    });
    return totals;
  }

  function statusDetails(fixture) {
    if (!fixture) {
      return { label: "Centrum meczu", className: "is-scheduled" };
    }

    const status = fixture.status?.short;
    const kickoff = kickoffForFixture(fixture);
    const now = Date.now();
    const kickoffWindow =
      kickoff &&
      now >= kickoff.getTime() &&
      now <= kickoff.getTime() + 180 * 60 * 1000;
    const elapsedFromKickoff = kickoffWindow
      ? Math.max(1, Math.floor((now - kickoff.getTime()) / 60000))
      : null;
    const derivedLive =
      !status || ["NS", "TBD"].includes(status) ? elapsedFromKickoff : null;
    if (["FT", "AET", "PEN"].includes(status)) {
      return { label: "", className: "is-finished" };
    }
    if (["1H", "HT", "2H", "ET", "BT", "P", "LIVE"].includes(status)) {
      const eventScore = scoreFromEvents(fixture);
      const score =
        Number.isInteger(fixture.goals?.home) &&
        Number.isInteger(fixture.goals?.away)
          ? ` ${fixture.goals.home}:${fixture.goals.away}`
          : Number.isInteger(eventScore.home) &&
              Number.isInteger(eventScore.away)
            ? ` ${eventScore.home}:${eventScore.away}`
            : "";
      const elapsed = fixture.status?.elapsed
        ? ` · ${fixture.status.elapsed}'`
        : elapsedFromKickoff
          ? ` · ${elapsedFromKickoff}'`
          : "";
      return {
        label: `NA ŻYWO${score}${elapsed}`,
        className: "is-live",
      };
    }
    if (derivedLive) {
      const score = scoreFromEvents(fixture);
      const labelScore =
        Number.isInteger(fixture.goals?.home) &&
        Number.isInteger(fixture.goals?.away)
          ? ` ${fixture.goals.home}:${fixture.goals.away}`
          : Number.isInteger(score.home) && Number.isInteger(score.away)
            ? ` ${score.home}:${score.away}`
            : "";
      return {
        label: `NA ŻYWO${labelScore} · ${elapsedFromKickoff}'`,
        className: "is-live",
      };
    }
    if (["PST", "CANC", "ABD", "SUSP", "INT"].includes(status)) {
      return { label: fixture.status.long || "Zmiana terminu", className: "is-alert" };
    }
    return { label: "Zapowiedź meczu", className: "is-scheduled" };
  }

  function enhanceVenue(card, match) {
    if (!match || card.querySelector("[data-match-venue]")) return;

    const location = [...card.querySelectorAll("span, div")].find((element) => {
      if (element.children.length) return false;
      const text = element.textContent.trim();
      return text === match.city || text === `📍 ${match.city}`;
    });
    if (!location) return;

    const capacity = stadiumCapacities[match.stadium];
    location.dataset.matchVenue = String(match.id);
    location.classList.add("match-card-venue");
    location.textContent = `📍 ${match.city} · ${match.stadium}${capacity ? ` · ${capacity} miejsc` : ""}`;
    location.title = capacity
      ? `${match.stadium}, pojemność ${capacity} miejsc`
      : match.stadium;
  }

  function appendMatchLink(card, matchId) {
    enhanceVenue(card, matchById.get(Number(matchId)));
    if (card.querySelector("[data-match-center-link]")) return;

    const fixture = fixtureByMatchId.get(matchId);
    const status = statusDetails(fixture);
    if (
      status.label &&
      ["is-live", "is-alert"].includes(status.className)
    ) {
      const footer = document.createElement("div");
      footer.className = "match-center-card-footer is-status-only";
      footer.dataset.matchCenterLink = String(matchId);

      const badge = document.createElement("span");
      badge.className = `match-center-status ${status.className}`;
      badge.textContent = status.label;
      footer.append(badge);
      card.append(footer);
    }

    card.dataset.matchId = String(matchId);
    if (status.className === "is-finished") {
      card.classList.add("match-card-official");
    }
  }

  function identifyGroupMatch(card) {
    const buttonNames = [...card.querySelectorAll("button")]
      .map((button) => button.textContent.trim())
      .filter((text) => teamNames.has(text));
    if (buttonNames.length < 2) return null;

    return groupMatches.find(
      (match) =>
        buttonNames.includes(match.homeName) &&
        buttonNames.includes(match.awayName),
    );
  }

  function identifyKnockoutMatch(card) {
    const header = [...card.querySelectorAll("span, div")].find((element) =>
      /^#(?:7[3-9]|[89]\d|10[0-4])\s*·/.test(element.textContent.trim()),
    );
    const match = header?.textContent.trim().match(/^#(\d+)\s*·/);
    return match ? Number(match[1]) : null;
  }

  function apply() {
    const cards = document.querySelectorAll(".rounded-2xl.p-3");
    for (const card of cards) {
      if (card.dataset.matchId) continue;

      const knockoutId = identifyKnockoutMatch(card);
      if (knockoutId) {
        appendMatchLink(card, knockoutId);
        continue;
      }

      const groupMatch = identifyGroupMatch(card);
      if (groupMatch) appendMatchLink(card, groupMatch.id);
    }
  }

  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
    });
  }

  document.addEventListener("DOMContentLoaded", scheduleApply);
  new MutationObserver(scheduleApply).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
