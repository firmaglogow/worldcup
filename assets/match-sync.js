(function syncOfficialMatchResults() {
  const matchCenter = window.WC2026_MATCH_CENTER;
  if (!matchCenter?.fixtures?.length) return;

  const finishedStatuses = new Set(["FT", "AET", "PEN"]);
  const groupResults = {};
  const knockoutResults = {};

  for (const fixture of matchCenter.fixtures) {
    if (
      !fixture.appMatchId ||
      !finishedStatuses.has(fixture.status?.short) ||
      !Number.isInteger(fixture.goals?.home) ||
      !Number.isInteger(fixture.goals?.away)
    ) {
      continue;
    }

    const result = {
      hg: fixture.goals.home,
      ag: fixture.goals.away,
    };

    if (fixture.appMatchId <= 72) {
      groupResults[fixture.appMatchId] = result;
      continue;
    }

    const homePenalties = fixture.score?.penalty?.home;
    const awayPenalties = fixture.score?.penalty?.away;
    if (
      Number.isInteger(homePenalties) &&
      Number.isInteger(awayPenalties) &&
      homePenalties !== awayPenalties
    ) {
      result.pen = homePenalties > awayPenalties ? "home" : "away";
    }
    knockoutResults[fixture.appMatchId] = result;
  }

  if (
    Object.keys(groupResults).length === 0 &&
    Object.keys(knockoutResults).length === 0
  ) {
    return;
  }

  try {
    const storageKey = "wc2026:v1";
    const current = JSON.parse(localStorage.getItem(storageKey) || "{}");
    current.results = { ...(current.results || {}), ...groupResults };
    current.koResults = { ...(current.koResults || {}), ...knockoutResults };
    current.lastSync = matchCenter.updatedAt;
    current.autoSync = true;
    localStorage.setItem(storageKey, JSON.stringify(current));
  } catch (error) {
    console.warn("Nie udało się zsynchronizować oficjalnych wyników.", error);
  }
})();
