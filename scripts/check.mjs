import assert from "node:assert/strict";
import fs from "node:fs";

const index = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
const enhancements = fs.readFileSync(
  new URL("../assets/enhancements.js", import.meta.url),
  "utf8",
);
const liveResults = fs.readFileSync(
  new URL("../assets/live-results.js", import.meta.url),
  "utf8",
);
const css = fs.readFileSync(
  new URL("../assets/styles.css", import.meta.url),
  "utf8",
);
const liveBracketCss = fs.readFileSync(
  new URL("../assets/live-bracket.css", import.meta.url),
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
const account = fs.readFileSync(
  new URL("../assets/account.js", import.meta.url),
  "utf8",
);
const accountCss = fs.readFileSync(
  new URL("../assets/account.css", import.meta.url),
  "utf8",
);
const worldStarsPage = fs.readFileSync(
  new URL("../gwiazdy-mundialu/index.html", import.meta.url),
  "utf8",
);
const worldStars = fs.readFileSync(
  new URL("../assets/world-stars.v20260618.js", import.meta.url),
  "utf8",
);
const worldStarsCss = fs.readFileSync(
  new URL("../assets/world-stars.v20260618.css", import.meta.url),
  "utf8",
);
const supabaseConfig = fs.readFileSync(
  new URL("../assets/supabase-config.js", import.meta.url),
  "utf8",
);
const supabaseSchema = fs.readFileSync(
  new URL("../supabase/schema.sql", import.meta.url),
  "utf8",
);
const supabaseResultsSync = fs.readFileSync(
  new URL("../scripts/sync-supabase-results.mjs", import.meta.url),
  "utf8",
);
const matchWorkflow = fs.readFileSync(
  new URL(
    "../.github/workflows/update-match-center.yml",
    import.meta.url,
  ),
  "utf8",
);
const matchUpdater = fs.readFileSync(
  new URL("../scripts/update-match-center.mjs", import.meta.url),
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
  enhancements.includes("function isMatchesTabActive()"),
  "Active matches tab detection is missing",
);
assert(
  enhancements.includes("function enhanceUpcomingMatches()"),
  "Upcoming matches panel is missing",
);
assert(
  enhancements.includes("const now = Date.now()") &&
    enhancements.includes("kickoff.getTime() > now") &&
    enhancements.includes("nextDates") &&
    enhancements.includes("slice(0, 2)"),
  "Upcoming matches panel does not show two future match days",
);
assert(
  enhancements.includes("NAJBLIŻSZE MECZE"),
  "Upcoming matches heading is missing",
);
assert(
  enhancements.includes("match.html?id="),
  "Upcoming match detail links are missing",
);
assert(
  enhancements.includes('.querySelectorAll("[data-upcoming-matches]")'),
  "Upcoming matches are not removed from other tabs",
);
assert(
  enhancements.includes("function enhanceMatchBrowser()") &&
    enhancements.includes('results: "Wyniki"') &&
    enhancements.includes('day: "Dzisiaj"') &&
    enhancements.includes('upcoming: "Nadchodzące"') &&
    enhancements.includes('all: "Wszystkie"'),
  "Match browser modes are missing",
);
assert(
  enhancements.includes("function setNativeDateFilter(value)") &&
    enhancements.includes("function updateMatchBrowserDates(browser)"),
  "Match browser date navigation is missing",
);
assert(
  enhancements.includes("matchBrowserFinishedStatuses") &&
    enhancements.includes("Pokaż starsze wyniki") &&
    enhancements.includes("Pokaż kolejne mecze"),
  "Compact results and upcoming views are missing",
);
assert(
  !enhancements.includes("removeAdsAfterNavigation"),
  "Advertising should remain visible on every tab",
);
assert(
  index.includes("assets/enhancements.v20260618.js?v=20260621-mobile-nav-fix") &&
    index.includes("assets/match-center.css?v=20260621-mobile-wow"),
  "Latest advertising visibility cache key is missing",
);
assert(
  enhancements.includes("mailto:emistrzostwaswiata2026@gmail.com"),
  "Advertising contact link is missing",
);
assert(
  matchUpdater.includes('["turkey", "TUR"]') &&
    matchUpdater.includes(
      '["democratic-republic-of-the-congo", "COD"]',
    ),
  "Community team aliases are incomplete",
);
assert(
  matchUpdater.includes("function worldCup26Events(game)"),
  "Community goal events are not imported",
);
assert(
  index.includes("assets/live-results.js?v=20260618-live-refresh") &&
    matchPage.includes("assets/live-results.js?v=20260618-live-refresh"),
  "Browser live-results fallback is not connected",
);
assert(
  liveResults.includes("https://worldcup26.ir/get/games") &&
    liveResults.includes("window.setInterval") &&
    liveResults.includes("wc2026:live-fixtures-v1"),
  "Browser live-results fallback is incomplete",
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
  assert(
    matchCards.includes(
      `${JSON.stringify(stadium)}: ${JSON.stringify(mapCapacity.replace(" miejsc", ""))}`,
    ),
    `Wrong match card capacity for ${stadium}`,
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
assert.equal(matchCenter.competition.id, 1, "Wrong match competition");
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
  !matchCards.includes("Szczegóły meczu") &&
    matchCards.includes("is-status-only"),
  "Separate match detail links are still visible",
);
assert(
  matchCards.includes("stadiumCapacities"),
  "Stadium capacities are missing from match cards",
);
assert(
  matchCards.includes("match-card-venue"),
  "Detailed venue information is missing from match cards",
);
assert(
  matchCards.includes('"AT&T Stadium": "94 000"'),
  "Dallas capacity is missing from match cards",
);
assert(
  !matchCards.includes("Wynik oficjalny"),
  "Official result label is still visible on match cards",
);
assert(
  matchSync.includes('storageKey = "wc2026:v1"'),
  "Official results are not connected to tables",
);
assert(
  matchSync.includes("current.results = { ...groupResults }"),
  "Manual group results are not cleared during official sync",
);
assert(
  matchSync.includes('button.dataset.officialScoreLocked = "true"'),
  "Manual official result editing is not locked",
);
assert(
  matchSync.includes("button.dataset.matchCenterTarget") &&
    matchSync.includes("window.location.assign(`match.html?id=${matchId}`)"),
  "Match scores do not open match details",
);
assert(
  matchSync.includes('button.textContent = "– : –"'),
  "Upcoming matches do not use a neutral score placeholder",
);
assert(
  !matchSync.includes("Wynik oficjalny"),
  "Official result tooltip is still present",
);
assert(
  matchSync.includes('officialTabs = new Set(["Mecze", "Faza pucharowa"])'),
  "Result locking is not limited to official match tabs",
);
assert(
  matchCenterCss.includes(".official-score-locked"),
  "Locked official result styles are missing",
);
assert(
  matchCenterCss.includes(".match-card-venue"),
  "Detailed venue styles are missing",
);
assert(
  matchCenterCss.includes(".upcoming-matches-grid"),
  "Upcoming matches responsive grid is missing",
);
assert(
  matchCenterCss.includes(".match-browser-tabs") &&
    matchCenterCss.includes(".match-browser-date-navigation") &&
    matchCenterCss.includes(".match-browser-grid"),
  "Match browser styles are missing",
);
assert(
  app.includes("function typOutcomeLabel") &&
    app.includes("prediction-outcome-button") &&
    app.includes('y("Remis","X",0,"0","0")'),
  "Simple 1-X-2 predictions are missing",
);
assert(
  app.includes("Każdy trafiony typ to 1 punkt") &&
    !app.includes("Dok\\u0142adne (3pkt)") &&
    !app.includes("Rezultat (1pkt)"),
  "Prediction scoring copy was not simplified",
);
assert(
  app.includes("Typowanie zakończone — mecz już się rozpoczął") &&
    app.includes("Date.now()>=new Date(`${e.date}T${e.time}:00+02:00`)"),
  "Prediction buttons are not locked at kickoff",
);
assert(
  matchCenterCss.includes(".prediction-outcome-grid") &&
    matchCenterCss.includes(".prediction-outcome-button.is-selected") &&
    matchCenterCss.includes(".prediction-outcome-lock"),
  "Simple prediction styles are missing",
);
assert(
  index.includes("assets/app.js?v=20260614-account-system") &&
    index.includes(
      "assets/match-center.css?v=20260621-mobile-wow",
    ),
  "Latest prediction cache keys are missing",
);
assert(
  index.includes("assets/supabase-config.js?v=20260614-account-system") &&
    index.includes("assets/account.js?v=20260614-account-system") &&
    index.includes("assets/account.css?v=20260620-account-in-menu"),
  "Account system assets are not connected",
);
assert(
  supabaseConfig.includes("publishableKey") &&
    !supabaseConfig.includes("service_role"),
  "Public Supabase configuration is unsafe",
);
assert(
  account.includes('const APP_STORAGE_KEY = "wc2026:v1"') &&
    account.includes("sync_my_predictions") &&
    account.includes("/auth/v1/token?grant_type=password") &&
    account.includes("/auth/v1/signup") &&
    account.includes("/auth/v1/user") &&
    account.includes("get_leaderboard"),
  "Account login or prediction synchronization is missing",
);
assert(
  accountCss.includes(".wc-account-launcher") &&
    accountCss.includes(".wc-account-dialog") &&
    accountCss.includes(".wc-leaderboard"),
  "Account system styles are missing",
);
assert(
  supabaseSchema.includes("enable row level security") &&
    supabaseSchema.includes("match.kickoff > now()") &&
    supabaseSchema.includes("create or replace function public.get_leaderboard") &&
    supabaseSchema.includes("create or replace function public.delete_my_account"),
  "Supabase security, deadline lock, or ranking is missing",
);
assert(
  supabaseResultsSync.includes("match_results?on_conflict=match_id") &&
    supabaseResultsSync.includes("SUPABASE_SERVICE_ROLE_KEY"),
  "Result synchronization for the leaderboard is missing",
);
assert(
  index.includes("Założenie konta typera jest dobrowolne") &&
    index.includes("nigdy adres e-mail"),
  "Account privacy information is missing",
);
assert(
  index.includes("FREE HOME design Studio") &&
    index.includes('href="http://www.freehomedesign.pl/"') &&
    index.includes('rel="noopener noreferrer"'),
  "Footer creator credit is missing",
);
assert(
  matchCenterCss.includes("[data-legacy-today-matches]"),
  "Legacy today matches strip is not hidden",
);
assert(
  index.includes("assets/match-center.js?v=20260618-live-refresh"),
  "Latest match card cache key is missing",
);
assert(
  enhancements.includes("function reorderNavigation()"),
  "Statistics navigation reorder is missing",
);
assert(
  enhancements.includes('["Statystyki", "Staty"]'),
  "Mobile statistics navigation reorder is missing",
);
assert(
  enhancements.includes("button.dataset.navOrder = String(order)"),
  "Statistics navigation order is not stable across application refreshes",
);
assert(
  index.includes("assets/enhancements.v20260618.js?v=20260621-mobile-nav-fix"),
  "Latest navigation enhancement cache key is missing",
);
assert(
  index.includes("assets/live-bracket.css?v=20260620-swipe-hint") &&
    enhancements.includes("function enhanceLiveKnockoutBracket()") &&
    enhancements.includes("DRABINKA NA ŻYWO") &&
    liveBracketCss.includes(".live-knockout-panel") &&
    liveBracketCss.includes("Przesuń w prawo") &&
    !enhancements.includes("<small>na dziś</small>"),
  "Live knockout bracket module is missing",
);
assert(
  enhancements.includes("function enhanceMatchBrowserFilterToggle") &&
    enhancements.includes("match-browser-filter-toggle") &&
    enhancements.includes('toggle.setAttribute("aria-expanded", "true")') &&
    enhancements.includes("filterPanel.classList.add(\"is-filter-open\")") &&
    matchCenterCss.includes(".upcoming-matches") &&
    matchCenterCss.includes(".match-browser-filter-collapsible"),
  "Mobile match schedule cleanup is missing",
);
assert(
  accountCss.includes(".wc-account-launcher") &&
    accountCss.includes("display: none") &&
    enhancements.includes("site-mobile-account-button") &&
    enhancements.includes("data-mobile-account-button") &&
    enhancements.includes("grid-column: 1 / -1"),
  "Mobile account entry is not moved into the menu",
);
assert(
  enhancements.includes("function enhanceCollapsibleMobileNavigation()") &&
    enhancements.includes("site-mobile-nav-toggle") &&
    enhancements.includes("site-mobile-nav-panel"),
  "Collapsible mobile navigation is missing",
);
assert(
  index.includes("assets/match-center.css?v=20260621-mobile-wow"),
  "Latest navigation styles cache key is missing",
);
assert(
  matchCenterCss.includes(".ad-slot-main .ad-slot-visual") &&
    matchCenterCss.includes("min-height: 96px"),
  "Compact main advertising module styles are missing",
);
assert(
  enhancements.includes('x="158" y="58" width="188" height="92"') &&
    enhancements.includes("ad-slot-partner-label") &&
    matchCenterCss.includes(".ad-slot-main .ad-slot-partner-label"),
  "Wider advertising goal and partner board are missing",
);
assert(
  enhancements.includes("function makeHeaderTrophyInteractive()") &&
    enhancements.includes('mark.dataset.homeNavigation = "true"'),
  "Clickable home trophy is missing",
);
assert(
  enhancements.includes("function enhanceTeamBackButton()") &&
    matchCenterCss.includes(".team-list-back-button"),
  "Prominent national team back button is missing",
);
assert(
  enhancements.includes("function enhanceDreamTeamPhotos()") &&
    matchCenterCss.includes(".dream-team-player-photo"),
  "Dream Team player portraits are missing",
);
assert(
  enhancements.includes("function enhanceMobileMatchHero()") &&
    enhancements.includes("function enhanceMobileBottomNavigation()") &&
    !enhancements.includes("function enhanceStickyLiveTicker()") &&
    !enhancements.includes("function liveTickerItem()") &&
    enhancements.includes('short: "Staty"') &&
    enhancements.includes('short: "Gwiazdy"') &&
    enhancements.includes("function findNavigationButton(labels)") &&
    !enhancements.includes('short: "Dream XI"') &&
    !enhancements.includes('short: "Typy"') &&
    enhancements.includes("function enhanceScoreChangeToast()") &&
    enhancements.includes("function enhanceMatchActionButtons()") &&
    matchCenterCss.includes(".mobile-match-hero") &&
    matchCenterCss.includes(".mobile-bottom-nav") &&
    !matchCenterCss.includes(".sticky-live-ticker") &&
    matchCenterCss.includes(".goal-update-toast") &&
    matchCenterCss.includes(".upcoming-match-actions"),
  "Mobile wow match experience is missing",
);
assert(
  matchCenterCss.includes(".site-primary-nav-desktop") &&
    matchCenterCss.includes("grid-template-columns: repeat(6"),
  "Two-row desktop navigation is missing",
);
assert(
  matchCenterCss.includes('[data-nav-order="3"] { order: 3; }'),
  "Statistics navigation order styles are missing",
);
assert(
  enhancements.includes('section.dataset.automaticScorers = "true"'),
  "Automatic scorers ranking is missing",
);
assert(
  enhancements.includes('event.detail !== "Own Goal"'),
  "Own goals are not excluded from the scorers ranking",
);
assert(
  matchCenterCss.includes(".automatic-scorers"),
  "Automatic scorers ranking styles are missing",
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
  !matchPage.includes(
    "Bezpłatne źródła nie udostępniają pełnych statystyk meczu",
  ) &&
    !matchPage.includes(
      "Bezpłatne źródła nie gwarantują danych o składach",
    ),
  "Technical empty-state notices are still visible on match pages",
);
assert(
  matchPage.includes("data-match-statistics-section hidden") &&
    matchPage.includes("data-match-lineups-section hidden"),
  "Empty match statistics and lineups are not hidden",
);
assert(
  matchDetail.includes("renderEvents"),
  "Match event timeline is missing",
);
assert(
  matchDetail.includes('if (short === "HT") return "PRZERWA"'),
  "Halftime status is not presented clearly",
);
assert(
  matchDetail.includes("section.hidden = false"),
  "Match data sections are not revealed when data becomes available",
);
assert(
  matchDetail.includes("5 * 60 * 1000") &&
    matchDetail.includes('url.searchParams.set("live"'),
  "Live match page refresh is missing",
);
assert(
  matchCenterCss.includes(".match-scoreboard"),
  "Match center styles are missing",
);
assert(
  matchCenterCss.includes(".match-page-grid.is-single-panel"),
  "Single match panel layout is missing",
);
assert(
  matchWorkflow.includes('cron: "*/5 * * * *"'),
  "Automatic update schedule is missing",
);
assert(
  matchUpdater.includes("capturedCommunityHalftime") &&
    matchUpdater.includes(
      "openHalftime || capturedCommunityHalftime || existingHalftime",
    ),
  "Halftime score capture and preservation are missing",
);
assert(
  matchUpdater.includes("matchCenterDataPattern") &&
    matchUpdater.includes("$1${dataVersion}") &&
    matchUpdater.includes("../gwiazdy-mundialu/index.html"),
  "Automatic live-data cache refresh is missing",
);
assert(
  matchWorkflow.includes("Pobierz bezpłatne wyniki"),
  "Free match update step is missing",
);
assert(
  worldStarsPage.includes("assets/match-center-data.js?v=") &&
    worldStarsPage.includes("world-stars.v20260618.css?v=20260621-star-live-stats") &&
    worldStarsPage.includes("world-stars.v20260618.js?v=20260621-star-live-stats") &&
    worldStars.includes("world-star-fifa-age") &&
    worldStars.includes("${player.age} lat") &&
    worldStars.includes("function buildLiveStats()") &&
    worldStars.includes("function refreshWorldStarStats()") &&
    worldStars.includes("data/match-center.json") &&
    worldStars.includes("Śr. nota") &&
    worldStars.includes("formatLiveStat(liveStats.averageRating") &&
    worldStarsCss.includes(".world-star-fifa-age"),
  "World stars live stats or age badge are missing",
);

console.log("All project checks passed.");
