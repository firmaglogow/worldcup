import fs from "node:fs";

const matchesPath = new URL("../data/matches.json", import.meta.url);
const matchCenterPath = new URL("../data/match-center.json", import.meta.url);
const browserSchedulePath = new URL("../assets/matches.js", import.meta.url);

const schedule = JSON.parse(fs.readFileSync(matchesPath, "utf8"));
const matchCenter = JSON.parse(fs.readFileSync(matchCenterPath, "utf8"));

const finishedStatuses = new Set(["FT", "AET", "PEN"]);

function resultIsComplete(result) {
  return Number.isInteger(result?.hg) && Number.isInteger(result?.ag);
}

function teamInfo(code) {
  return schedule.teams[code] || null;
}

function createStanding(code, group) {
  const team = teamInfo(code);
  return {
    code,
    group,
    name: team?.name || code,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
  };
}

const groupResults = {};
const knockoutResults = {};
for (const fixture of matchCenter.fixtures || []) {
  const id = Number(fixture.appMatchId);
  if (
    !id ||
    !finishedStatuses.has(fixture.status?.short) ||
    !Number.isInteger(fixture.goals?.home) ||
    !Number.isInteger(fixture.goals?.away)
  ) {
    continue;
  }

  const result = { hg: fixture.goals.home, ag: fixture.goals.away };
  const penalties = fixture.score?.penalty;
  if (
    Number.isInteger(penalties?.home) &&
    Number.isInteger(penalties?.away) &&
    penalties.home !== penalties.away
  ) {
    result.pen = penalties.home > penalties.away ? "home" : "away";
  }

  if (id <= 72) groupResults[id] = result;
  else knockoutResults[id] = result;
}

function calculateStandings() {
  const groupMatches = schedule.matches.filter((match) => match.phase === "group");
  const groups = {};

  groupMatches.forEach((match) => {
    groups[match.group] ||= {};
    groups[match.group][match.homeCode] ||= createStanding(match.homeCode, match.group);
    groups[match.group][match.awayCode] ||= createStanding(match.awayCode, match.group);

    const result = groupResults[match.id];
    if (!resultIsComplete(result)) return;

    const home = groups[match.group][match.homeCode];
    const away = groups[match.group][match.awayCode];
    home.played += 1;
    away.played += 1;
    home.gf += result.hg;
    home.ga += result.ag;
    away.gf += result.ag;
    away.ga += result.hg;
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;

    if (result.hg > result.ag) {
      home.won += 1;
      away.lost += 1;
      home.points += 3;
    } else if (result.ag > result.hg) {
      away.won += 1;
      home.lost += 1;
      away.points += 3;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  });

  const completedGroups = new Set();
  const sortedGroups = {};
  Object.keys(groups)
    .sort()
    .forEach((group) => {
      sortedGroups[group] = Object.values(groups[group]).sort(
        (first, second) =>
          second.points - first.points ||
          second.gd - first.gd ||
          second.gf - first.gf ||
          first.name.localeCompare(second.name, "pl"),
      );

      const groupDone = groupMatches
        .filter((match) => match.group === group)
        .every((match) => resultIsComplete(groupResults[match.id]));
      if (groupDone) completedGroups.add(group);
    });

  const thirdTeams = Object.entries(sortedGroups)
    .map(([group, table]) => ({ ...table[2], group }))
    .sort(
      (first, second) =>
        second.points - first.points ||
        second.gd - first.gd ||
        second.gf - first.gf ||
        first.name.localeCompare(second.name, "pl"),
    );

  return { groups: sortedGroups, completedGroups, thirdTeams };
}

function knockoutDecision(homeCode, awayCode, result) {
  if (!homeCode || !awayCode || !resultIsComplete(result)) return {};
  if (result.hg > result.ag) return { winner: homeCode, loser: awayCode };
  if (result.ag > result.hg) return { winner: awayCode, loser: homeCode };
  if (result.pen === "home") return { winner: homeCode, loser: awayCode };
  if (result.pen === "away") return { winner: awayCode, loser: homeCode };
  return {};
}

function resolveGroupLabel(label, standings, usedThirds) {
  const winner = label?.match(/^Zwycięzca grupy ([A-L])$/);
  if (winner) return standings.groups[winner[1]]?.[0]?.code || null;

  const runnerUp = label?.match(/^2\. miejsce grupy ([A-L])$/);
  if (runnerUp) return standings.groups[runnerUp[1]]?.[1]?.code || null;

  const thirdPlace = label?.match(/^3\. miejsce \(([^)]+)\)$/);
  if (thirdPlace) {
    const allowed = new Set(thirdPlace[1].split("/"));
    const team = standings.thirdTeams
      .slice(0, 8)
      .find((candidate) => allowed.has(candidate.group) && !usedThirds.has(candidate.code));
    if (!team) return null;
    usedThirds.add(team.code);
    return team.code;
  }

  return null;
}

function resolveKnockoutSlot(label, standings, bracket, usedThirds) {
  const matchWinner = label?.match(/^Zwycięzca meczu (\d+)$/);
  if (matchWinner) return bracket[Number(matchWinner[1])]?.winner || null;

  const matchLoser = label?.match(/^Przegrany meczu (\d+)$/);
  if (matchLoser) return bracket[Number(matchLoser[1])]?.loser || null;

  return resolveGroupLabel(label, standings, usedThirds);
}

function applyTeam(match, side, code) {
  if (!code) return;
  const team = teamInfo(code);
  if (!team) return;

  match[`${side}Code`] = team.code;
  match[`${side}Name`] = team.name;
  match[`${side}Flag`] = team.flag;
}

const standings = calculateStandings();
const usedThirds = new Set();
const bracket = {};
let filledSlots = 0;

schedule.matches
  .filter((match) => match.phase === "knockout")
  .sort((first, second) => Number(first.id) - Number(second.id))
  .forEach((match) => {
    const homeCode =
      match.homeCode ||
      resolveKnockoutSlot(match.homeLabel, standings, bracket, usedThirds);
    const awayCode =
      match.awayCode ||
      resolveKnockoutSlot(match.awayLabel, standings, bracket, usedThirds);

    if (homeCode && !match.homeCode) filledSlots += 1;
    if (awayCode && !match.awayCode) filledSlots += 1;
    applyTeam(match, "home", homeCode);
    applyTeam(match, "away", awayCode);

    const decision = knockoutDecision(homeCode, awayCode, knockoutResults[match.id]);
    bracket[match.id] = {
      homeCode,
      awayCode,
      winner: decision.winner || null,
      loser: decision.loser || null,
    };
  });

fs.writeFileSync(matchesPath, `${JSON.stringify(schedule, null, 2)}\n`);
fs.writeFileSync(
  browserSchedulePath,
  `window.WC2026_MATCHES = ${JSON.stringify(schedule)};\n`,
);

console.log(`Uzupełniono ${filledSlots} miejsc w fazie pucharowej.`);
