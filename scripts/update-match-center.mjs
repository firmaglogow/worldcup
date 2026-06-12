import fs from "node:fs";

const API_BASE_URL = "https://v3.football.api-sports.io";
const COMPETITION_ID = 1;
const SEASON = 2026;
const TIMEZONE = "Europe/Warsaw";
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);

const schedule = JSON.parse(
  fs.readFileSync(new URL("../data/matches.json", import.meta.url), "utf8"),
);
const matchCenterPath = new URL("../data/match-center.json", import.meta.url);
const browserDataPath = new URL(
  "../assets/match-center-data.js",
  import.meta.url,
);
const previous = fs.existsSync(matchCenterPath)
  ? JSON.parse(fs.readFileSync(matchCenterPath, "utf8"))
  : { fixtures: [] };

const apiKey = process.env.API_FOOTBALL_KEY;
if (!apiKey) {
  throw new Error(
    "Brak API_FOOTBALL_KEY. Dodaj klucz jako sekret repozytorium GitHub.",
  );
}

const TEAM_CODE_ALIASES = new Map([
  ["bosnia-and-herzegovina", "BIH"],
  ["bosnia-herzegovina", "BIH"],
  ["cape-verde", "CPV"],
  ["cote-divoire", "CIV"],
  ["curacao", "CUW"],
  ["czech-republic", "CZE"],
  ["czechia", "CZE"],
  ["dr-congo", "COD"],
  ["congo-dr", "COD"],
  ["iran", "IRN"],
  ["ivory-coast", "CIV"],
  ["korea-republic", "KOR"],
  ["saudi-arabia", "KSA"],
  ["south-africa", "RSA"],
  ["south-korea", "KOR"],
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

for (const team of Object.values(schedule.teams)) {
  TEAM_CODE_ALIASES.set(normalize(team.providerName), team.code);
  TEAM_CODE_ALIASES.set(normalize(team.name), team.code);
}

async function apiGet(pathname, params) {
  const url = new URL(pathname, API_BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: {
      "x-apisports-key": apiKey,
    },
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`API-Football ${response.status}: ${response.statusText}`);
  }
  if (payload.errors && Object.keys(payload.errors).length > 0) {
    throw new Error(`API-Football: ${JSON.stringify(payload.errors)}`);
  }

  return payload.response || [];
}

function fixtureLocalParts(fixture) {
  const date = new Date(fixture.fixture.date);
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

function minutes(time) {
  const [hour, minute] = String(time).split(":").map(Number);
  return hour * 60 + minute;
}

function findAppMatch(fixture) {
  const homeCode = TEAM_CODE_ALIASES.get(normalize(fixture.teams.home.name));
  const awayCode = TEAM_CODE_ALIASES.get(normalize(fixture.teams.away.name));
  const local = fixtureLocalParts(fixture);

  if (homeCode && awayCode) {
    const exactTeams = schedule.matches.find(
      (match) =>
        match.phase === "group" &&
        match.homeCode === homeCode &&
        match.awayCode === awayCode,
    );
    if (exactTeams) return exactTeams;
  }

  const sameDay = schedule.matches.filter((match) => match.date === local.date);
  if (sameDay.length === 0) return null;

  return sameDay
    .map((match) => ({
      match,
      difference: Math.abs(minutes(match.time) - minutes(local.time)),
      venueMatch:
        normalize(match.stadium) === normalize(fixture.fixture.venue?.name),
    }))
    .sort(
      (left, right) =>
        Number(right.venueMatch) - Number(left.venueMatch) ||
        left.difference - right.difference,
    )[0]?.match;
}

function normalizeEvents(events) {
  return events.map((event) => ({
    elapsed: event.time?.elapsed ?? null,
    extra: event.time?.extra ?? null,
    team: event.team?.name || "",
    player: event.player?.name || "",
    assist: event.assist?.name || "",
    type: event.type || "",
    detail: event.detail || "",
    comments: event.comments || "",
  }));
}

function normalizeStatistics(statistics) {
  return statistics.map((team) => ({
    team: team.team?.name || "",
    values: Object.fromEntries(
      (team.statistics || []).map((item) => [item.type, item.value]),
    ),
  }));
}

function normalizeLineups(lineups) {
  return lineups.map((lineup) => ({
    team: lineup.team?.name || "",
    formation: lineup.formation || "",
    coach: lineup.coach?.name || "",
    startXI: (lineup.startXI || []).map(({ player }) => ({
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.pos,
      grid: player.grid,
    })),
    substitutes: (lineup.substitutes || []).map(({ player }) => ({
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.pos,
    })),
  }));
}

async function fetchDetails(fixtureId, previousAttempts = 0) {
  const requests = await Promise.allSettled([
    apiGet("/fixtures/events", { fixture: fixtureId }),
    apiGet("/fixtures/statistics", { fixture: fixtureId }),
    apiGet("/fixtures/lineups", { fixture: fixtureId }),
  ]);
  const [events, statistics, lineups] = requests.map((request) => {
    if (request.status === "fulfilled") return request.value;
    console.warn(
      `Nie udało się pobrać części danych meczu ${fixtureId}:`,
      request.reason?.message || request.reason,
    );
    return [];
  });

  return {
    events: normalizeEvents(events),
    statistics: normalizeStatistics(statistics),
    lineups: normalizeLineups(lineups),
    detailsFetchedAt: new Date().toISOString(),
    detailsAttempts: previousAttempts + 1,
  };
}

const apiFixtures = await apiGet("/fixtures", {
  league: COMPETITION_ID,
  season: SEASON,
  timezone: TIMEZONE,
});
const previousByProviderId = new Map(
  (previous.fixtures || []).map((fixture) => [fixture.providerId, fixture]),
);

const fixtures = [];
for (const fixture of apiFixtures) {
  const providerId = fixture.fixture.id;
  const existing = previousByProviderId.get(providerId);
  const appMatch = findAppMatch(fixture);
  const statusShort = fixture.fixture.status?.short || "NS";
  const isFinished = FINISHED_STATUSES.has(statusShort);
  let details = {
    events: existing?.events || [],
    statistics: existing?.statistics || [],
    lineups: existing?.lineups || [],
    detailsFetchedAt: existing?.detailsFetchedAt || null,
    detailsAttempts: existing?.detailsAttempts || 0,
  };

  const detailsIncomplete =
    details.statistics.length === 0 || details.lineups.length === 0;
  if (
    isFinished &&
    details.detailsAttempts < 2 &&
    (!details.detailsFetchedAt || detailsIncomplete)
  ) {
    details = await fetchDetails(providerId, details.detailsAttempts);
  }

  fixtures.push({
    providerId,
    appMatchId: appMatch?.id || null,
    phase: appMatch?.phase || null,
    round: fixture.league?.round || appMatch?.round || "",
    kickoff: fixture.fixture.date,
    date: appMatch?.date || fixtureLocalParts(fixture).date,
    time: appMatch?.time || fixtureLocalParts(fixture).time,
    venue: fixture.fixture.venue?.name || appMatch?.stadium || "",
    city: fixture.fixture.venue?.city || appMatch?.city || "",
    referee: fixture.fixture.referee || "",
    status: {
      short: statusShort,
      long: fixture.fixture.status?.long || "",
      elapsed: fixture.fixture.status?.elapsed ?? null,
    },
    teams: {
      home: {
        id: fixture.teams.home.id,
        name: fixture.teams.home.name,
        winner: fixture.teams.home.winner,
      },
      away: {
        id: fixture.teams.away.id,
        name: fixture.teams.away.name,
        winner: fixture.teams.away.winner,
      },
    },
    goals: {
      home: fixture.goals?.home ?? null,
      away: fixture.goals?.away ?? null,
    },
    score: {
      halftime: fixture.score?.halftime || { home: null, away: null },
      fulltime: fixture.score?.fulltime || { home: null, away: null },
      extratime: fixture.score?.extratime || { home: null, away: null },
      penalty: fixture.score?.penalty || { home: null, away: null },
    },
    ...details,
  });
}

fixtures.sort(
  (left, right) =>
    (left.appMatchId ?? Number.MAX_SAFE_INTEGER) -
      (right.appMatchId ?? Number.MAX_SAFE_INTEGER) ||
    left.kickoff.localeCompare(right.kickoff),
);

const output = {
  version: 1,
  source: "API-Football",
  competition: {
    id: COMPETITION_ID,
    name: "FIFA World Cup",
    season: SEASON,
  },
  timezone: TIMEZONE,
  updatedAt: new Date().toISOString(),
  fixtures,
};

const comparableOutput = JSON.stringify({
  version: output.version,
  source: output.source,
  competition: output.competition,
  timezone: output.timezone,
  fixtures: output.fixtures,
});
const comparablePrevious = JSON.stringify({
  version: previous.version,
  source: previous.source,
  competition: previous.competition,
  timezone: previous.timezone,
  fixtures: previous.fixtures || [],
});

if (comparableOutput === comparablePrevious) {
  console.log("Brak nowych wyników lub statystyk.");
  process.exit(0);
}

fs.writeFileSync(matchCenterPath, `${JSON.stringify(output, null, 2)}\n`);
fs.writeFileSync(
  browserDataPath,
  `window.WC2026_MATCH_CENTER = ${JSON.stringify(output)};\n`,
);

console.log(
  `Zaktualizowano ${fixtures.length} meczów, w tym ${
    fixtures.filter((fixture) => FINISHED_STATUSES.has(fixture.status.short))
      .length
  } zakończonych.`,
);
