(function enhanceMatchCards() {
  const schedule = window.WC2026_MATCHES;
  if (!schedule?.matches?.length) return;

  const fixtureByMatchId = new Map(
    (window.WC2026_MATCH_CENTER?.fixtures || [])
      .filter((fixture) => fixture.appMatchId)
      .map((fixture) => [fixture.appMatchId, fixture]),
  );
  const groupMatches = schedule.matches.filter(
    (match) => match.phase === "group",
  );
  const teamNames = new Set(
    Object.values(schedule.teams).map((team) => team.name),
  );

  function statusDetails(fixture) {
    if (!fixture) {
      return { label: "Centrum meczu", className: "is-scheduled" };
    }

    const status = fixture.status?.short;
    if (["FT", "AET", "PEN"].includes(status)) {
      return { label: "Wynik oficjalny", className: "is-finished" };
    }
    if (["1H", "HT", "2H", "ET", "BT", "P", "LIVE"].includes(status)) {
      const score =
        Number.isInteger(fixture.goals?.home) &&
        Number.isInteger(fixture.goals?.away)
          ? ` ${fixture.goals.home}:${fixture.goals.away}`
          : "";
      const elapsed = fixture.status?.elapsed
        ? ` · ${fixture.status.elapsed}'`
        : "";
      return {
        label: `NA ŻYWO${score}${elapsed}`,
        className: "is-live",
      };
    }
    if (["PST", "CANC", "ABD", "SUSP", "INT"].includes(status)) {
      return { label: fixture.status.long || "Zmiana terminu", className: "is-alert" };
    }
    return { label: "Zapowiedź meczu", className: "is-scheduled" };
  }

  function appendMatchLink(card, matchId) {
    if (card.querySelector("[data-match-center-link]")) return;

    const fixture = fixtureByMatchId.get(matchId);
    const status = statusDetails(fixture);
    const footer = document.createElement("div");
    footer.className = "match-center-card-footer";
    footer.dataset.matchCenterLink = String(matchId);

    const badge = document.createElement("span");
    badge.className = `match-center-status ${status.className}`;
    badge.textContent = status.label;

    const link = document.createElement("a");
    link.className = "match-center-link";
    link.href = `match.html?id=${matchId}`;
    link.textContent = "Szczegóły meczu";
    link.setAttribute("aria-label", `Otwórz szczegóły meczu numer ${matchId}`);

    footer.append(badge, link);
    card.append(footer);
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
