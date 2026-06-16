import fs from "node:fs";

import { scheduleCorrections } from "./schedule-corrections.mjs";

const appSource = fs.readFileSync(
  new URL("../assets/app.js", import.meta.url),
  "utf8",
);

function readLiteral(startMarker, endMarker, prefixLength = startMarker.length) {
  const start = appSource.indexOf(startMarker);
  const end = appSource.indexOf(endMarker, start);

  if (start < 0 || end < 0) {
    throw new Error(`Nie znaleziono danych pomiędzy ${startMarker} i ${endMarker}`);
  }

  return Function(`"use strict"; return ${appSource.slice(start + prefixLength, end + 1)}`)();
}

const teams = readLiteral("J={", "},see=", 2);
const providerNames = readLiteral("see={", "},Uo=", 4);
const groupMatches = readLiteral("It=[", "],Ma=", 3);
const knockoutMatches = readLiteral("Ma=[", "],cee=", 3);

function describeSide(side) {
  if (side.w) return `Zwycięzca grupy ${side.w}`;
  if (side.r) return `2. miejsce grupy ${side.r}`;
  if (side.t) return `3. miejsce (${side.t.join("/")})`;
  if (side.m) return `Zwycięzca meczu ${side.m}`;
  if (side.l) return `Przegrany meczu ${side.l}`;
  return "Do ustalenia";
}

const schedule = {
  version: 1,
  timezone: "Europe/Warsaw",
  teams: Object.fromEntries(
    Object.entries(teams).map(([code, team]) => [
      code,
      {
        code,
        name: team.name,
        flag: team.flag,
        providerName: providerNames[code] || team.name,
      },
    ]),
  ),
  matches: [
    ...groupMatches.map((match) => ({
      id: match.id,
      phase: "group",
      round: `Grupa ${match.group}`,
      group: match.group,
      date: match.date,
      time: match.time,
      stadium: match.stadium,
      city: match.city,
      homeCode: match.home,
      awayCode: match.away,
      homeName: teams[match.home].name,
      awayName: teams[match.away].name,
      homeFlag: teams[match.home].flag,
      awayFlag: teams[match.away].flag,
    })),
    ...knockoutMatches.map((match) => ({
      id: match.no,
      phase: "knockout",
      round: match.round,
      date: match.date,
      time: match.time,
      stadium: match.stadium,
      city: match.city,
      homeLabel: describeSide(match.home),
      awayLabel: describeSide(match.away),
    })),
  ].sort((left, right) => left.id - right.id),
};

const correctionsById = new Map(
  scheduleCorrections.map((correction) => [correction.id, correction]),
);

for (const match of schedule.matches) {
  const correction = correctionsById.get(match.id);
  if (!correction) continue;
  Object.assign(match, correction);
}

const json = `${JSON.stringify(schedule, null, 2)}\n`;
const browserScript = `window.WC2026_MATCHES = ${JSON.stringify(schedule)};\n`;

fs.writeFileSync(new URL("../data/matches.json", import.meta.url), json);
fs.writeFileSync(
  new URL("../assets/matches.js", import.meta.url),
  browserScript,
);

console.log(`Wyeksportowano ${schedule.matches.length} meczów.`);
