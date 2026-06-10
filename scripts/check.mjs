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
const stadiumMap = new URL("../assets/stadium-map.jpg", import.meta.url);
const squads = JSON.parse(
  fs.readFileSync(new URL("../data/squads.json", import.meta.url), "utf8"),
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
assert(app.includes("capacity:82500"), "Final venue capacity was not corrected");

console.log("All project checks passed.");
