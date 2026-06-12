import assert from "node:assert/strict";
import fs from "node:fs";

const index = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
const enhancements = fs.readFileSync(
  new URL("../assets/enhancements.js", import.meta.url),
  "utf8",
);
const css = fs.readFileSync(
  new URL("../assets/styles.css", import.meta.url),
  "utf8",
);
const playerProfile = fs.readFileSync(
  new URL("../assets/player-profile.js", import.meta.url),
  "utf8",
);
const playerPage = fs.readFileSync(
  new URL("../player.html", import.meta.url),
  "utf8",
);
const playerProfiles = JSON.parse(
  fs.readFileSync(
    new URL("../data/player-profiles.json", import.meta.url),
    "utf8",
  ),
);
const stadiumMap = new URL("../assets/stadium-map.jpg", import.meta.url);
const squads = JSON.parse(
  fs.readFileSync(new URL("../data/squads.json", import.meta.url), "utf8"),
);
const matches = JSON.parse(
  fs.readFileSync(new URL("../data/matches.json", import.meta.url), "utf8"),
);
const matchCenter = JSON.parse(
  fs.readFileSync(
    new URL("../data/match-center.json", import.meta.url),
    "utf8",
  ),
);
const matchPage = fs.readFileSync(
  new URL("../match.html", import.meta.url),
  "utf8",
);
const matchDetail = fs.readFileSync(
  new URL("../assets/match-detail.js", import.meta.url),
  "utf8",
);
const matchCards = fs.readFileSync(
  new URL("../assets/match-center.js", import.meta.url),
  "utf8",
);
const matchSync = fs.readFileSync(
  new URL("../assets/match-sync.js", import.meta.url),
  "utf8",
);
const matchCenterCss = fs.readFileSync(
  new URL("../assets/match-center.css", import.meta.url),
  "utf8",
);
const matchWorkflow = fs.readFileSync(
  new URL(
    "../.github/workflows/update-match-center.yml",
    import.meta.url,
  ),
  "utf8",
);
const stadiumImages = [
  "arrowhead-stadium.webp",
  "att-stadium.webp",
  "bc-place.webp",
  "bmo-field.webp",
  "estadio-akron.webp",
  "estadio-azteca.webp",
  "estadio-bbva.webp",
  "gillette-stadium.webp",
  "hard-rock-stadium.webp",
  "levis-stadium.webp",
  "lincoln-financial-field.webp",
  "lumen-field.webp",
  "mercedes-benz-stadium.webp",
  "metlife-stadium.webp",
  "nrg-stadium.webp",
  "sofi-stadium.webp",
];

assert(!index.includes("G-XXXXXXXXXX"), "Placeholder analytics is still present");
assert(!index.includes("cdn.tailwindcss.com"), "Tailwind CDN is still present");
assert(index.includes('rel="canonical"'), "Canonical URL is missing");
assert(index.includes("assets/og-image.png"), "Open Graph image is missing");
assert(index.includes("assets/squads.js"), "Squad data script is missing");
assert(
  index.includes('name="theme-color" content="#07111f"'),
  "Updated browser theme color is missing",
);
assert(css.length > 10_000, "Generated stylesheet looks incomplete");
assert(
  css.includes("linear-gradient(145deg,#07111f,#0a1924 52%,#08131f)"),
  "Improved dark background is missing",
);
assert(
  enhancements.includes('slot.dataset.adSlot = "main"'),
  "Main advertising slot is missing",
);
assert(
  enhancements.includes('slot.dataset.adSlot = "sidebar"'),
  "Sidebar advertising slot is missing",
);
assert(
  enhancements.includes("mailto:emistrzostwaswiata2026@gmail.com"),
  "Advertising contact link is missing",
);
assert(
  enhancements.includes("ad-slot-scene"),
  "Advertising animation scene is missing",
);
assert(
  css.includes("@keyframes ad-ball-flight"),
  "Advertising animation styles are missing",
);
assert(
  enhancements.includes("ad-slot-goal-frame"),
  "Recognizable advertising goal is missing",
);
assert(
  enhancements.includes("assets/trophy-header.png"),
  "Realistic header trophy is missing",
);
assert(
  css.includes(".site-trophy-image"),
  "Header trophy styles are missing",
);
assert(
  enhancements.includes("stadium-map-viewport"),
  "Mobile stadium map enhancement is missing",
);
assert(
  enhancements.includes("assets/stadium-map.jpg"),
  "Detailed stadium map image is not connected",
);
assert(
  enhancements.includes("Pokaż informacje:"),
  "Touchable stadium markers are missing",
);
assert(
  enhancements.includes("stadiumMapTooltip"),
  "Stadium map tooltip is missing",
);
assert(
  enhancements.includes("stadium-map-tooltip-image"),
  "Stadium preview image is missing from the map tooltip",
);
assert(
  css.includes(".stadium-map-desktop-help"),
  "Desktop-only stadium map hint handling is missing",
);
assert(fs.existsSync(stadiumMap), "Detailed stadium map image is missing");
assert(
  index.includes("stadium-credits.html"),
  "Stadium photo credits link is missing",
);
assert(
  index.includes("assets/player-profiles.js"),
  "Player profile data is missing",
);
assert(
  index.includes("player-credits.html"),
  "Player photo credits link is missing",
);
assert(
  enhancements.includes("calculatePlayerAge"),
  "Automatic player age calculation is missing",
);
assert(
  enhancements.includes("dataset.playerSquad"),
  "Detailed player squads are missing",
);
assert(
  enhancements.includes("player.html?team="),
  "Player profile links are missing",
);
assert(
  playerProfile.includes("birthdayThisYear"),
  "Player profile age is not calculated from the full birth date",
);
assert(
  playerPage.includes("data-player-profile"),
  "Player profile page is incomplete",
);
const expectedProfileTeams = [
  "FRA",
  "ESP",
  "ARG",
  "ENG",
  "POR",
  "BRA",
  "NED",
  "MAR",
  "BEL",
  "GER",
  "CRO",
  "COL",
  "SEN",
  "MEX",
  "USA",
  "URU",
  "JPN",
  "SUI",
  "IRN",
  "TUR",
  "ECU",
  "AUT",
  "ALG",
  "AUS",
  "BIH",
  "CAN",
  "CIV",
  "COD",
  "CPV",
  "CUW",
  "CZE",
  "EGY",
  "GHA",
  "HAI",
  "IRQ",
  "JOR",
  "KOR",
  "KSA",
  "NOR",
  "NZL",
  "PAN",
  "PAR",
  "QAT",
  "RSA",
  "SCO",
  "SWE",
  "TUN",
  "UZB",
];
assert.deepEqual(
  Object.keys(playerProfiles),
  expectedProfileTeams,
  "Unexpected player profile team order",
);
let profileCount = 0;
let imageCount = 0;
for (const [teamCode, team] of Object.entries(playerProfiles)) {
  assert.equal(team.players.length, 26, `Expected 26 profiles for ${teamCode}`);
  profileCount += team.players.length;
  for (const player of team.players) {
    assert(player.birthDate, `Missing birth date: ${player.name}`);
    assert(player.club, `Missing club: ${player.name}`);
    assert(player.heightCm, `Missing height: ${player.name}`);
    if (player.image) {
      imageCount += 1;
      assert(player.photo?.license, `Missing photo license: ${player.name}`);
      assert(
        fs.existsSync(new URL(`../${player.image}`, import.meta.url)),
        `Missing player image: ${player.name}`,
      );
    }
  }
}
assert.equal(profileCount, 1248, "Expected 1248 player profiles");
assert(imageCount >= 505, "Too many player avatars instead of photos");
for (const image of stadiumImages) {
  assert(
    fs.existsSync(new URL(`../assets/stadiums/${image}`, import.meta.url)),
    `Missing stadium image: ${image}`,
  );
  assert(
    app.includes(`assets/stadiums/${image}`),
    `Stadium image is not connected: ${image}`,
  );
  assert(
    enhancements.includes(`image: "${image}"`),
    `Stadium map preview is not connected: ${image}`,
  );
}
assert(
  css.includes("height:132px"),
  "Mobile advertising animation is missing",
);
assert(
  !enhancements.includes("googlesyndication"),
  "External advertising script found",
);
assert.equal(Object.keys(squads.teams).length, 48, "Expected 48 squad lists");
assert("CIV" in squads.teams, "Côte d'Ivoire must use the app code CIV");
assert(!("WKS" in squads.teams), "Unsupported WKS code found in squad data");
assert.equal(
  Object.values(squads.teams).reduce(
    (total, team) => total + team.players.length,
    0,
  ),
  1248,
  "Expected 1248 players",
);

const expectedMatches = [
  'id:6,date:"2026-06-14",time:"00:00"',
  'id:17,date:"2026-06-16",time:"21:00"',
  'id:43,date:"2026-06-23",time:"02:00"',
  'id:55,date:"2026-06-25",time:"22:00"',
  'id:67,date:"2026-06-27",time:"23:00"',
  'id:"M104",no:104,round:"FINA\\u0141",date:"2026-07-19",time:"21:00"',
];

for (const match of expectedMatches) {
  assert(app.includes(match), `Missing corrected match: ${match}`);
}

assert(!app.includes("api.anthropic.com"), "Broken Anthropic endpoint remains");
assert(!app.includes("zostan\\u0105 og\\u0142oszone"), "Old squad notice remains");
assert(!app.includes("pobior\\u0119 z netu"), "Old network fetch promise remains");
assert(
  !app.includes("Sk\\u0142ad orientacyjny"),
  "Old provisional squad notice remains",
);
const expectedStadiumCapacities = {
  "Estadio Azteca": ["83e3", "83 000 miejsc"],
  "Estadio Akron": ["48e3", "48 000 miejsc"],
  "Estadio BBVA": ["53500", "53 500 miejsc"],
  "BMO Field": ["45e3", "45 000 miejsc"],
  "BC Place": ["54e3", "54 000 miejsc"],
  "MetLife Stadium": ["82500", "82 500 miejsc"],
  "SoFi Stadium": ["70e3", "70 000 miejsc"],
  "Levi's Stadium": ["71e3", "71 000 miejsc"],
  "NRG Stadium": ["72e3", "72 000 miejsc"],
  "AT&T Stadium": ["94e3", "94 000 miejsc"],
  "Gillette Stadium": ["65e3", "65 000 miejsc"],
  "Lincoln Financial Field": ["69e3", "69 000 miejsc"],
  "Hard Rock Stadium": ["65e3", "65 000 miejsc"],
  "Mercedes-Benz Stadium": ["75e3", "75 000 miejsc"],
  "Arrowhead Stadium": ["73e3", "73 000 miejsc"],
  "Lumen Field": ["69e3", "69 000 miejsc"],
};

for (const [stadium, [bundleCapacity, mapCapacity]] of Object.entries(
  expectedStadiumCapacities,
)) {
  assert(
    app.includes(`${JSON.stringify(stadium)}:{capacity:${bundleCapacity}`),
    `Wrong capacity for ${stadium}`,
  );
  assert(
    enhancements.includes(mapCapacity),
    `Wrong map capacity for ${stadium}`,
  );
}

assert(
  app.includes(String.raw`children:"Pojemno\u015B\u0107 wg FIFA"`),
  "Stadium capacity source label is missing",
);
assert(
  enhancements.includes("94 000 miejsc · Arlington · 9 meczów"),
  "Dallas map capacity or location is wrong",
);
assert(
  index.includes(
    "Terminarz, oficjalne kadry i pojemności stadionów: FIFA. Aktualizacja: 12 czerwca 2026.",
  ),
  "Stadium capacity source note is missing",
);
assert.equal(matches.matches.length, 104, "Expected 104 scheduled matches");
assert.equal(
  matches.matches.filter((match) => match.phase === "group").length,
  72,
  "Expected 72 group matches",
);
assert.equal(
  new Set(matches.matches.map((match) => match.id)).size,
  104,
  "Match identifiers must be unique",
);
assert.equal(matchCenter.competition.id, 1, "Wrong API-Football competition");
assert(index.includes("assets/matches.js"), "Match schedule script is missing");
assert(
  index.includes("assets/match-center-data.js"),
  "Automatic result data script is missing",
);
assert(
  index.indexOf("assets/match-sync.js") < index.indexOf("assets/app.js"),
  "Official results must sync before the application starts",
);
assert(
  index.includes("assets/match-center.js"),
  "Match card enhancement is missing",
);
assert(
  matchCards.includes("Szczegóły meczu"),
  "Match detail links are missing",
);
assert(
  matchSync.includes('storageKey = "wc2026:v1"'),
  "Official results are not connected to tables",
);
assert(
  matchPage.includes("data-match-statistics"),
  "Match statistics section is missing",
);
assert(
  matchPage.includes("data-match-lineups"),
  "Match lineups section is missing",
);
assert(
  matchDetail.includes("renderEvents"),
  "Match event timeline is missing",
);
assert(
  matchCenterCss.includes(".match-scoreboard"),
  "Match center styles are missing",
);
assert(
  matchWorkflow.includes("API_FOOTBALL_KEY"),
  "GitHub Actions API secret is missing",
);
assert(
  matchWorkflow.includes('cron: "7,37 * * * *"'),
  "Automatic update schedule is missing",
);

console.log("All project checks passed.");
