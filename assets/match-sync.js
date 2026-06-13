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

  try {
    const storageKey = "wc2026:v1";
    const current = JSON.parse(localStorage.getItem(storageKey) || "{}");
    current.results = { ...groupResults };
    current.koResults = { ...knockoutResults };
    current.lastSync = matchCenter.updatedAt;
    current.autoSync = true;
    localStorage.setItem(storageKey, JSON.stringify(current));
  } catch (error) {
    console.warn("Nie udało się zsynchronizować oficjalnych wyników.", error);
  }
})();

(function lockManualOfficialScores() {
  const officialTabs = new Set(["Mecze", "Faza pucharowa"]);
  const scorePattern = /^\d+\s*:\s*\d+$/;

  function activeTabName() {
    const activeTab = [...document.querySelectorAll("button")].find(
      (button) =>
        officialTabs.has(button.textContent.trim()) &&
        button.classList.contains("border-amber-400"),
    );
    return activeTab?.textContent.trim() || "";
  }

  function lockScoreButton(button) {
    const label = button.textContent.trim();
    const normalizedLabel = label.toLocaleLowerCase("pl");
    const awaitingResult =
      normalizedLabel === "wpisz wynik" || normalizedLabel === "wpisz";

    if (!awaitingResult && !scorePattern.test(label)) return;

    button.disabled = true;
    button.dataset.officialScoreLocked = "true";
    button.classList.add("official-score-locked");
    button.setAttribute("aria-disabled", "true");

    if (awaitingResult) {
      button.textContent = "wynik automatyczny";
      button.classList.add("is-awaiting-result");
      button.setAttribute(
        "aria-label",
        "Wynik zostanie uzupełniony automatycznie po meczu",
      );
      button.title = "Wynik zostanie uzupełniony automatycznie po meczu";
      return;
    }

    button.title = "Wynik oficjalny, aktualizowany automatycznie";
  }

  function applyScoreLocks() {
    if (!officialTabs.has(activeTabName())) return;

    document
      .querySelectorAll("[data-match-id] button")
      .forEach(lockScoreButton);
  }

  let scheduled = false;
  function scheduleScoreLocks() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyScoreLocks();
    });
  }

  document.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest(
        'button[data-official-score-locked="true"]',
      );
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );

  document.addEventListener("DOMContentLoaded", scheduleScoreLocks);
  new MutationObserver(scheduleScoreLocks).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
