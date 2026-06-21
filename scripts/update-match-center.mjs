import fs from "node:fs";

const TIMEZONE = "Europe/Warsaw";
const OPENFOOTBALL_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";
const WORLDCUP26_URL = "https://worldcup26.ir/get/games";
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);
const WORLD_STAR_PLAYERS = [
  {
    id: "lionel-messi",
    names: ["Lionel Messi", "Messi"],
    country: "Argentina",
  },
  {
    id: "kylian-mbappe",
    names: ["Kylian Mbappé", "Mbappé"],
    country: "France",
  },
  {
    id: "erling-haaland",
    names: ["Erling Haaland", "Haaland"],
    country: "Norway",
  },
  {
    id: "cristiano-ronaldo",
    names: ["Cristiano Ronaldo", "Ronaldo"],
    country: "Portugal",
  },
  {
    id: "lamine-yamal",
    names: ["Lamine Yamal", "Yamal"],
    country: "Spain",
  },
  {
    id: "vinicius-junior",
    names: ["Vinícius Júnior", "Vinícius Junior", "Vinicius Junior", "Vinícius"],
    country: "Brazil",
  },
  {
    id: "neymar-jr",
    names: ["Neymar Jr", "Neymar"],
    country: "Brazil",
  },
  {
    id: "raphinha",
    names: ["Raphinha"],
    country: "Brazil",
  },
  {
    id: "jude-bellingham",
    names: ["Jude Bellingham", "Bellingham"],
    country: "England",
  },
  {
    id: "pedri",
    names: ["Pedri"],
    country: "Spain",
  },
  {
    id: "jamal-musiala",
    names: ["Jamal Musiala", "Musiala"],
    country: "Germany",
  },
  {
    id: "harry-kane",
    names: ["Harry Kane", "Kane"],
    country: "England",
  },
  {
    id: "mohamed-salah",
    names: ["Mohamed Salah", "Salah"],
    country: "Egypt",
  },
  {
    id: "son-heung-min",
    names: ["Son Heung-min", "Heung-min Son", "Son"],
    country: "South Korea",
  },
];

const schedule = JSON.parse(
  fs.readFileSync(new URL("../data/matches.json", import.meta.url), "utf8"),
);
const matchCenterPath = new URL("../data/match-center.json", import.meta.url);
const browserDataPath = new URL(
  "../assets/match-center-data.js",
  import.meta.url,
);
const pagePaths = [
  new URL("../index.html", import.meta.url),
  new URL("../match.html", import.meta.url),
  new URL("../gwiazdy-mundialu/index.html", import.meta.url),
];
const previous = fs.existsSync(matchCenterPath)
  ? JSON.parse(fs.readFileSync(matchCenterPath, "utf8"))
  : { fixtures: [] };
const previousByMatchId = new Map(
  (previous.fixtures || [])
    .filter((fixture) => fixture.appMatchId)
    .map((fixture) => [fixture.appMatchId, fixture]),
);

const TEAM_CODE_ALIASES = new Map([
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
  ["iran", "IRN"],
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

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizePerson(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(jr|junior|sr|senior)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function personMatches(value, names) {
  const normalized = normalizePerson(value);
  if (!normalized) return false;
  return names.map(normalizePerson).some((name) => name === normalized);
}

for (const team of Object.values(schedule.teams)) {
  TEAM_CODE_ALIASES.set(normalize(team.providerName), team.code);
  TEAM_CODE_ALIASES.set(normalize(team.name), team.code);
}

function teamCode(name) {
  return TEAM_CODE_ALIASES.get(normalize(name)) || null;
}

function teamPairKey(home, away) {
  const homeCode = teamCode(home);
  const awayCode = teamCode(away);
  return homeCode && awayCode ? `${homeCode}:${awayCode}` : null;
}

const scheduleByPair = new Map(
  schedule.matches
    .filter((match) => match.homeCode && match.awayCode)
    .map((match) => [`${match.homeCode}:${match.awayCode}`, match]),
);
const scheduleById = new Map(
  schedule.matches.map((match) => [match.id, match]),
);

async function fetchJson(url, label) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "firmaglogow-worldcup/1.0",
    },
  });
  if (!response.ok) {
    throw new Error(`${label}: HTTP ${response.status}`);
  }
  return response.json();
}

function appMatchForOpenFootball(match) {
  if (Number.isInteger(match.num)) {
    return scheduleById.get(match.num) || null;
  }
  const key = teamPairKey(match.team1, match.team2);
  return key ? scheduleByPair.get(key) || null : null;
}

function appMatchForWorldCup26(game) {
  const key = teamPairKey(game.home_team_name_en, game.away_team_name_en);
  if (key && scheduleByPair.has(key)) return scheduleByPair.get(key);

  const id = Number(game.id);
  if (game.type !== "group" && id >= 73 && id <= 104) {
    return scheduleById.get(id) || null;
  }
  return null;
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

function worldCup26Status(game) {
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

function goalEvent(goal, scoringTeam, opposingTeam) {
  const minuteParts = String(goal.minute || "").match(
    /^(\d+)(?:\+(\d+))?/,
  );
  return {
    elapsed: minuteParts ? Number(minuteParts[1]) : null,
    extra: minuteParts?.[2] ? Number(minuteParts[2]) : null,
    team: goal.owngoal ? opposingTeam : scoringTeam,
    player: goal.name || "",
    assist: "",
    type: "Goal",
    detail: goal.owngoal
      ? "Own Goal"
      : goal.penalty
        ? "Penalty"
        : "Normal Goal",
    comments: "",
  };
}

function openFootballEvents(match) {
  return [
    ...(match.goals1 || []).map((goal) =>
      goalEvent(goal, match.team1, match.team2),
    ),
    ...(match.goals2 || []).map((goal) =>
      goalEvent(goal, match.team2, match.team1),
    ),
  ].sort(
    (left, right) =>
      (left.elapsed ?? Number.MAX_SAFE_INTEGER) -
        (right.elapsed ?? Number.MAX_SAFE_INTEGER) ||
      (left.extra || 0) - (right.extra || 0),
  );
}

function parseCommunityScorers(value) {
  const source = String(value || "").trim();
  if (!source || source.toLowerCase() === "null") return [];

  const scorers = [];
  const itemPattern = /"([^"]+)"|([^,{}]+)/g;
  for (const match of source.matchAll(itemPattern)) {
    const item = (match[1] || match[2] || "").trim();
    const scorer = item.match(/^(.+?)\s+(\d+)(?:\+(\d+))?'$/);
    if (!scorer) continue;
    scorers.push({
      name: scorer[1].trim(),
      minute: `${scorer[2]}${scorer[3] ? `+${scorer[3]}` : ""}`,
      penalty: false,
      owngoal: false,
    });
  }
  return scorers;
}

function worldCup26Events(game) {
  return [
    ...parseCommunityScorers(game.home_scorers).map((goal) =>
      goalEvent(goal, game.home_team_name_en, game.away_team_name_en),
    ),
    ...parseCommunityScorers(game.away_scorers).map((goal) =>
      goalEvent(goal, game.away_team_name_en, game.home_team_name_en),
    ),
  ].sort(
    (left, right) =>
      (left.elapsed ?? Number.MAX_SAFE_INTEGER) -
        (right.elapsed ?? Number.MAX_SAFE_INTEGER) ||
      (left.extra || 0) - (right.extra || 0),
  );
}

function scheduledTeam(match, side) {
  const code = match[`${side}Code`];
  const team = code ? schedule.teams[code] : null;
  return {
    id: null,
    name: team?.providerName || match[`${side}Label`] || "Do ustalenia",
    winner: null,
  };
}

const sourceErrors = [];
let openFootball = { matches: [] };
let worldCup26 = { games: [] };

try {
  openFootball = await fetchJson(OPENFOOTBALL_URL, "OpenFootball");
} catch (error) {
  sourceErrors.push(error.message);
}

try {
  worldCup26 = await fetchJson(WORLDCUP26_URL, "WorldCup26");
} catch (error) {
  sourceErrors.push(error.message);
}

if (!openFootball.matches?.length && !worldCup26.games?.length) {
  throw new Error(
    `Brak danych z bezpłatnych źródeł: ${sourceErrors.join("; ")}`,
  );
}

const openByMatchId = new Map();
for (const match of openFootball.matches || []) {
  const appMatch = appMatchForOpenFootball(match);
  if (appMatch) openByMatchId.set(appMatch.id, match);
}

const communityByMatchId = new Map();
for (const game of worldCup26.games || []) {
  const appMatch = appMatchForWorldCup26(game);
  if (appMatch) communityByMatchId.set(appMatch.id, game);
}

const fixtures = schedule.matches.map((appMatch) => {
  const openMatch = openByMatchId.get(appMatch.id);
  const communityMatch = communityByMatchId.get(appMatch.id);
  const existing = previousByMatchId.get(appMatch.id);
  const openScore = openMatch?.score;
  const communityStatus = communityMatch
    ? worldCup26Status(communityMatch)
    : null;
  const hasOpenResult =
    Array.isArray(openScore?.ft) && openScore.ft.length === 2;
  const status = hasOpenResult
    ? { short: "FT", long: "Mecz zakończony", elapsed: null }
    : communityStatus || {
        short: "NS",
        long: "Mecz zaplanowany",
        elapsed: null,
      };
  const communityHome = numberOrNull(communityMatch?.home_score);
  const communityAway = numberOrNull(communityMatch?.away_score);
  const canUseCommunityScore =
    status.short !== "NS" &&
    Number.isInteger(communityHome) &&
    Number.isInteger(communityAway);
  const homeGoals = hasOpenResult
    ? numberOrNull(openScore.ft[0])
    : canUseCommunityScore
      ? communityHome
      : null;
  const awayGoals = hasOpenResult
    ? numberOrNull(openScore.ft[1])
    : canUseCommunityScore
      ? communityAway
      : null;
  const openHalftimeCandidate =
    Array.isArray(openScore?.ht) && openScore.ht.length === 2
      ? {
          home: numberOrNull(openScore.ht[0]),
          away: numberOrNull(openScore.ht[1]),
        }
      : null;
  const openHalftime =
    Number.isInteger(openHalftimeCandidate?.home) &&
    Number.isInteger(openHalftimeCandidate?.away)
      ? openHalftimeCandidate
      : null;
  const capturedCommunityHalftime =
    status.short === "HT" &&
    Number.isInteger(communityHome) &&
    Number.isInteger(communityAway)
      ? { home: communityHome, away: communityAway }
      : null;
  const existingHalftime =
    Number.isInteger(existing?.score?.halftime?.home) &&
    Number.isInteger(existing?.score?.halftime?.away)
      ? existing.score.halftime
      : null;
  const halftime =
    openHalftime || capturedCommunityHalftime || existingHalftime || {
      home: null,
      away: null,
    };
  const communityEvents = communityMatch
    ? worldCup26Events(communityMatch)
    : [];
  const events = hasOpenResult
    ? openFootballEvents(openMatch)
    : communityEvents.length
      ? communityEvents
      : existing?.events || [];
  const home = scheduledTeam(appMatch, "home");
  const away = scheduledTeam(appMatch, "away");

  if (openMatch?.team1) home.name = openMatch.team1;
  else if (communityMatch?.home_team_name_en) {
    home.name = communityMatch.home_team_name_en;
  }
  if (openMatch?.team2) away.name = openMatch.team2;
  else if (communityMatch?.away_team_name_en) {
    away.name = communityMatch.away_team_name_en;
  }

  if (Number.isInteger(homeGoals) && Number.isInteger(awayGoals)) {
    home.winner = homeGoals > awayGoals;
    away.winner = awayGoals > homeGoals;
  }

  return {
    providerId: `free-${appMatch.id}`,
    appMatchId: appMatch.id,
    phase: appMatch.phase,
    round: appMatch.round,
    kickoff: `${appMatch.date}T${appMatch.time}:00+02:00`,
    date: appMatch.date,
    time: appMatch.time,
    venue: appMatch.stadium,
    city: appMatch.city,
    referee: "",
    status,
    teams: { home, away },
    goals: { home: homeGoals, away: awayGoals },
    score: {
      halftime,
      fulltime: FINISHED_STATUSES.has(status.short)
        ? { home: homeGoals, away: awayGoals }
        : { home: null, away: null },
      extratime: existing?.score?.extratime || { home: null, away: null },
      penalty: existing?.score?.penalty || { home: null, away: null },
    },
    events,
    statistics: [],
    lineups: [],
    detailsFetchedAt:
      hasOpenResult || canUseCommunityScore ? new Date().toISOString() : null,
    detailsAttempts: 0,
    dataSource: hasOpenResult
      ? "OpenFootball"
      : communityMatch
        ? "WorldCup26"
        : "",
  };
});

function buildWorldStarStats(fixtures) {
  const players = WORLD_STAR_PLAYERS.map((player) => {
    let goals = 0;

    fixtures
      .filter((fixture) =>
        [fixture.teams?.home?.name, fixture.teams?.away?.name]
          .map(normalizePerson)
          .includes(normalizePerson(player.country)),
      )
      .forEach((fixture) => {
        (fixture.events || []).forEach((event) => {
          if (event.type === "Goal" && event.detail !== "Own Goal") {
            if (personMatches(event.player, player.names)) goals += 1;
          }
        });
      });

    return {
      id: player.id,
      goals,
    };
  });

  return {
    updatedAt: new Date().toISOString(),
    source: "match-center-events",
    capabilities: {
      goals: true,
    },
    players,
  };
}

const output = {
  version: 2,
  source: "OpenFootball + WorldCup26",
  sourceNotice:
    "Bezpłatne dane społecznościowe. Wyniki mogą pojawić się z opóźnieniem i wymagają potwierdzenia.",
  competition: {
    id: 1,
    name: "FIFA World Cup",
    season: 2026,
  },
  timezone: TIMEZONE,
  updatedAt: new Date().toISOString(),
  starStats: buildWorldStarStats(fixtures),
  fixtures,
};

const comparableOutput = JSON.stringify({
  version: output.version,
  source: output.source,
  competition: output.competition,
  timezone: output.timezone,
  starStats: output.starStats,
  fixtures: output.fixtures.map(({ detailsFetchedAt, ...fixture }) => fixture),
});
const comparablePrevious = JSON.stringify({
  version: previous.version,
  source: previous.source,
  competition: previous.competition,
  timezone: previous.timezone,
  starStats: previous.starStats,
  fixtures: (previous.fixtures || []).map(
    ({ detailsFetchedAt, ...fixture }) => fixture,
  ),
});

if (comparableOutput === comparablePrevious) {
  console.log("Brak nowych wyników.");
  process.exit(0);
}

fs.writeFileSync(matchCenterPath, `${JSON.stringify(output, null, 2)}\n`);
fs.writeFileSync(
  browserDataPath,
  `window.WC2026_MATCH_CENTER = ${JSON.stringify(output)};\n`,
);
const dataVersion = `live-${output.updatedAt.replace(/\D/g, "").slice(0, 12)}`;
const matchCenterDataPattern = /((?:\.\.\/)?assets\/match-center-data\.js\?v=)[^"]+/g;
for (const pagePath of pagePaths) {
  const page = fs.readFileSync(pagePath, "utf8");
  matchCenterDataPattern.lastIndex = 0;
  if (!matchCenterDataPattern.test(page)) {
    throw new Error(`Nie znaleziono wersji danych w ${pagePath.pathname}`);
  }
  matchCenterDataPattern.lastIndex = 0;
  const updatedPage = page.replace(
    matchCenterDataPattern,
    `$1${dataVersion}`,
  );
  if (updatedPage !== page) fs.writeFileSync(pagePath, updatedPage);
}

console.log(
  `Zaktualizowano ${fixtures.length} meczów: ${
    fixtures.filter((fixture) => FINISHED_STATUSES.has(fixture.status.short))
      .length
  } zakończonych, ${
    fixtures.filter((fixture) =>
      ["1H", "HT", "2H", "ET", "LIVE"].includes(fixture.status.short),
    ).length
  } na żywo.${
    sourceErrors.length ? ` Ostrzeżenia: ${sourceErrors.join("; ")}` : ""
  }`,
);
