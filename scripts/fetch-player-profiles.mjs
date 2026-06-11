import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const squads = JSON.parse(
  await fs.readFile(path.join(root, "data/squads.json"), "utf8"),
);
const cachePath = path.join(root, "data/player-wikidata.json");
const outputDataPath = path.join(root, "data/player-profiles.json");
const outputScriptPath = path.join(root, "assets/player-profiles.js");
const userAgent =
  "mistrzostwaswiata2026.pl/1.0 (emistrzostwaswiata2026@gmail.com)";

const teamConfigs = [
  {
    code: "FRA",
    team: "Francja",
    teamGenitive: "Francji",
    flag: "🇫🇷",
    directory: "france",
  },
  {
    code: "ESP",
    team: "Hiszpania",
    teamGenitive: "Hiszpanii",
    flag: "🇪🇸",
    directory: "spain",
  },
  {
    code: "ARG",
    team: "Argentyna",
    teamGenitive: "Argentyny",
    flag: "🇦🇷",
    directory: "argentina",
  },
  {
    code: "ENG",
    team: "Anglia",
    teamGenitive: "Anglii",
    flag:
      "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
    directory: "england",
  },
  {
    code: "POR",
    team: "Portugalia",
    teamGenitive: "Portugalii",
    flag: "🇵🇹",
    directory: "portugal",
  },
  {
    code: "BRA",
    team: "Brazylia",
    teamGenitive: "Brazylii",
    flag: "🇧🇷",
    directory: "brazil",
  },
  {
    code: "NED",
    team: "Holandia",
    teamGenitive: "Holandii",
    flag: "🇳🇱",
    directory: "netherlands",
  },
  {
    code: "MAR",
    team: "Maroko",
    teamGenitive: "Maroka",
    flag: "🇲🇦",
    directory: "morocco",
  },
  {
    code: "BEL",
    team: "Belgia",
    teamGenitive: "Belgii",
    flag: "🇧🇪",
    directory: "belgium",
  },
  {
    code: "GER",
    team: "Niemcy",
    teamGenitive: "Niemiec",
    flag: "🇩🇪",
    directory: "germany",
  },
  {
    code: "CRO",
    team: "Chorwacja",
    teamGenitive: "Chorwacji",
    flag: "🇭🇷",
    directory: "croatia",
  },
  {
    code: "COL",
    team: "Kolumbia",
    teamGenitive: "Kolumbii",
    flag: "🇨🇴",
    directory: "colombia",
  },
];

const seedWikidataIds = {
  "FRA:Brice Samba": "Q15627817",
  "FRA:Malo Gusto": "Q78752401",
  "FRA:Lucas Digne": "Q72648",
  "FRA:Dayot Upamecano": "Q20723878",
  "FRA:Jules Kounde": "Q47170176",
  "FRA:Manu Kone": "Q64029237",
  "FRA:Ousmane Dembele": "Q20851003",
  "FRA:Aurelien Tchouameni": "Q46951844",
  "FRA:Marcus Thuram": "Q19903718",
  "FRA:Kylian Mbappe": "Q21621995",
  "FRA:Michael Olise": "Q62050484",
  "FRA:Bradley Barcola": "Q99670930",
  "FRA:Ngolo Kante": "Q16665941",
  "FRA:Adrien Rabiot": "Q18962",
  "FRA:Ibrahima Konate": "Q30301454",
  "FRA:Mike Maignan": "Q17274709",
  "FRA:William Saliba": "Q56868118",
  "FRA:Warren Zaire-Emery": "Q111280241",
  "FRA:Theo Hernandez": "Q23703372",
  "FRA:Desire Doue": "Q112170256",
  "FRA:Lucas Hernandez": "Q18924954",
  "FRA:Jean-Philippe Mateta": "Q26964668",
  "FRA:Robin Risser": "Q124745247",
  "FRA:Rayan Cherki": "Q64736321",
  "FRA:Maghnes Akliouche": "Q108910786",
  "FRA:Maxence Lacroix": "Q60286976",
  "BRA:Alisson": "Q18237361",
  "MAR:Youssef Belamm Ari": "Q110964329",
  "COL:Willer Ditta": "Q79880395",
  "COL:Cucho Hernandez": "Q27037962",
  "COL:Andres Gomez": "Q116215934",
};

const commonsFileOverrides = {
  "BRA:Raphinha": "Raphinha (2025) (cropped).png",
  "MAR:Abde Ezzalzouli": "Barcelona Training Miami 2022 04 (cropped).jpg",
  "CRO:Ivor Pandur": "Ivor Pandur.jpg",
  "COL:Andres Gomez": "IMCF vs. RSL 25 (cropped) (cropped).jpg",
};

const displayNameOverrides = {
  "FRA:Jules Kounde": "Jules Koundé",
  "FRA:Manu Kone": "Manu Koné",
  "FRA:Ousmane Dembele": "Ousmane Dembélé",
  "FRA:Aurelien Tchouameni": "Aurélien Tchouaméni",
  "FRA:Kylian Mbappe": "Kylian Mbappé",
  "FRA:Ngolo Kante": "N'Golo Kanté",
  "FRA:Ibrahima Konate": "Ibrahima Konaté",
  "FRA:Warren Zaire-Emery": "Warren Zaïre-Emery",
  "FRA:Theo Hernandez": "Théo Hernandez",
  "FRA:Desire Doue": "Désiré Doué",
  "ESP:Alex Grimaldo": "Álex Grimaldo",
  "ESP:Eric Garcia": "Eric García",
  "ESP:Fabian Ruiz": "Fabián Ruiz",
  "ESP:Joan Garcia": "Joan García",
  "ESP:Alex Baena": "Álex Baena",
  "ESP:Martin Zubimendi": "Martín Zubimendi",
  "ESP:Pau Cubarsi": "Pau Cubarsí",
  "ESP:Unai Simon": "Unai Simón",
  "ESP:Victor Munoz": "Víctor Muñoz",
  "ARG:Nicolas Tagliafico": "Nicolás Tagliafico",
  "ARG:Lisandro Martinez": "Lisandro Martínez",
  "ARG:Valentin Barco": "Valentín Barco",
  "ARG:Julian Alvarez": "Julián Álvarez",
  "ARG:Geronimo Rulli": "Gerónimo Rulli",
  "ARG:Nico Gonzalez": "Nicolás González",
  "ARG:Nicolas Otamendi": "Nicolás Otamendi",
  "ARG:Jose Manuel Lopez": "José Manuel López",
  "ARG:Lautaro Martinez": "Lautaro Martínez",
  "ARG:Emiliano Martinez": "Emiliano Martínez",
  "ARG:Enzo Fernandez": "Enzo Fernández",
  "ENG:Marc Guehi": "Marc Guéhi",
  "POR:Nelson Semedo": "Nélson Semedo",
  "POR:Ruben Dias": "Rúben Dias",
  "POR:Tomas Araujo": "Tomás Araújo",
  "POR:Goncalo Ramos": "Gonçalo Ramos",
  "POR:Joao Felix": "João Félix",
  "POR:Jose Sa": "José Sá",
  "POR:Goncalo Inacio": "Gonçalo Inácio",
  "POR:Joao Neves": "João Neves",
  "POR:Francisco Trincao": "Francisco Trincão",
  "POR:Rafael Leao": "Rafael Leão",
  "POR:Goncalo Guedes": "Gonçalo Guedes",
  "POR:Joao Cancelo": "João Cancelo",
  "POR:Ruben Neves": "Rúben Neves",
  "POR:Francisco Conceicao": "Francisco Conceição",
  "BRA:Ederson Silva": "Éderson",
  "BRA:Gabriel Magalhaes": "Gabriel Magalhães",
  "BRA:Vinicius Junior": "Vinícius Júnior",
  "BRA:Bruno Guimaraes": "Bruno Guimarães",
  "BRA:Lucas Paqueta": "Lucas Paquetá",
  "BRA:Roger Ibanez": "Roger Ibañez",
  "NED:Nathan Ake": "Nathan Aké",
  "MAR:Brahim Diaz": "Brahim Díaz",
  "MAR:Youssef Belamm Ari": "Youssef Belammari",
  "MAR:Ayoub El Kaabi": "Ayoub El Kaâbi",
  "BEL:Jeremy Doku": "Jérémy Doku",
  "BEL:Joaquin Seys": "Joaquin Seys",
  "BEL:Matias Fernandez-Pardo": "Matías Fernández-Pardo",
  "GER:Antonio Ruediger": "Antonio Rüdiger",
  "GER:Aleksandar Pavlovic": "Aleksandar Pavlović",
  "GER:Pascal Gross": "Pascal Groß",
  "GER:Leroy Sane": "Leroy Sané",
  "GER:Alexander Nuebel": "Alexander Nübel",
  "GER:Assan Ouedraogo": "Assan Ouédraogo",
  "CRO:Dominik Livakovic": "Dominik Livaković",
  "CRO:Josip Stanisic": "Josip Stanišić",
  "CRO:Marin Pongracic": "Marin Pongračić",
  "CRO:Josko Gvardiol": "Joško Gvardiol",
  "CRO:Duje Caleta-Car": "Duje Ćaleta-Car",
  "CRO:Josip Sutalo": "Josip Šutalo",
  "CRO:Mateo Kovacic": "Mateo Kovačić",
  "CRO:Andrej Kramaric": "Andrej Kramarić",
  "CRO:Luka Modric": "Luka Modrić",
  "CRO:Nikola Vlasic": "Nikola Vlašić",
  "CRO:Ivan Perisic": "Ivan Perišić",
  "CRO:Mario Pasalic": "Mario Pašalić",
  "CRO:Petar Sucic": "Petar Sučić",
  "CRO:Kristijan Jakic": "Kristijan Jakić",
  "CRO:Igor Matanovic": "Igor Matanović",
  "CRO:Luka Sucic": "Luka Sučić",
  "CRO:Luka Vuskovic": "Luka Vušković",
  "CRO:Marco Pasalic": "Marco Pašalić",
  "CRO:Martin Erlic": "Martin Erlić",
  "COL:Daniel Munoz": "Daniel Muñoz",
  "COL:Jhon Lucumi": "Jhon Lucumí",
  "COL:Kevin Castano": "Kevin Castaño",
  "COL:Richard Rios": "Richard Ríos",
  "COL:Luis Diaz": "Luis Díaz",
  "COL:Jhon Cordoba": "Jhon Córdoba",
  "COL:James Rodriguez": "James Rodríguez",
  "COL:Cucho Hernandez": "Cucho Hernández",
  "COL:Juan Quintero": "Juan Fernando Quintero",
  "COL:Davinson Sanchez": "Davinson Sánchez",
  "COL:Alvaro Montero": "Álvaro Montero",
  "COL:Luis Suarez": "Luis Suárez",
  "COL:Andres Gomez": "Andrés Gómez",
};

const playerDataOverrides = {
  "COL:Willer Ditta": { birthDate: "23/01/1997" },
  "COL:Cucho Hernandez": { birthDate: "22/04/1999" },
};

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&nbsp;", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value) {
  return value
    .toLocaleLowerCase("en")
    .replace(/(^|[-' ])\p{L}/gu, (match) => match.toLocaleUpperCase("en"));
}

function formatWikidataDate(value) {
  const match = value?.match(/^\+?(\d{4})-(\d{2})-(\d{2})T/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : null;
}

function playerSearchQueries(player) {
  const reconstructed = `${player.firstNames.split(" ")[0]} ${titleCase(player.lastNames)}`;
  return [...new Set([player.name, reconstructed])].filter(Boolean);
}

function chunks(values, size) {
  const result = [];
  for (let index = 0; index < values.length; index += size) {
    result.push(values.slice(index, index + size));
  }
  return result;
}

async function fetchWithRetry(url, options = {}, attempts = 7) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, {
      ...options,
      headers: { "user-agent": userAgent, ...options.headers },
    });
    if (response.ok) return response;
    if (attempt === attempts || ![429, 500, 502, 503, 504].includes(response.status)) {
      throw new Error(`${response.status} ${response.statusText}: ${url}`);
    }
    const retryAfter = Number(response.headers.get("retry-after")) || 0;
    await sleep(Math.max(retryAfter * 1000, attempt * 2500));
  }
  throw new Error(`Nie udało się pobrać: ${url}`);
}

async function getJson(url) {
  return (await fetchWithRetry(url)).json();
}

async function getEntities(ids) {
  const entities = {};
  for (const idChunk of chunks([...new Set(ids)].filter(Boolean), 50)) {
    const url = new URL("https://www.wikidata.org/w/api.php");
    url.search = new URLSearchParams({
      action: "wbgetentities",
      format: "json",
      props: "claims|labels",
      languages: "en|pl",
      ids: idChunk.join("|"),
    });
    Object.assign(entities, (await getJson(url)).entities);
  }
  return entities;
}

async function resolveWikidataId(player) {
  for (const search of playerSearchQueries(player)) {
    const url = new URL("https://www.wikidata.org/w/api.php");
    url.search = new URLSearchParams({
      action: "wbsearchentities",
      format: "json",
      language: "en",
      uselang: "en",
      type: "item",
      limit: "10",
      search,
    });
    const results = (await getJson(url)).search || [];
    const entities = await getEntities(results.map((result) => result.id));
    const matching = results.find((result) => {
      const entity = entities[result.id];
      const birthDates = (entity?.claims?.P569 || []).map((claim) =>
        formatWikidataDate(claim.mainsnak?.datavalue?.value?.time),
      );
      return birthDates.includes(player.birthDate);
    });
    if (matching) return matching.id;
    await sleep(80);
  }
  return null;
}

async function loadCache() {
  try {
    return JSON.parse(await fs.readFile(cachePath, "utf8"));
  } catch {
    return {};
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function saveCache(cache) {
  await fs.writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
}

async function getCommonsMetadata(fileNames) {
  const pagesByTitle = new Map();
  for (const fileChunk of chunks([...new Set(fileNames)].filter(Boolean), 35)) {
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    url.search = new URLSearchParams({
      action: "query",
      format: "json",
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "700",
      titles: fileChunk.map((fileName) => `File:${fileName}`).join("|"),
    });
    const pages = Object.values((await getJson(url)).query?.pages || {});
    pages.forEach((page) => pagesByTitle.set(page.title, page));
  }
  return pagesByTitle;
}

function hasFreeLicense(metadata) {
  const license = metadata?.LicenseShortName?.value || "";
  return /^(CC|Public domain|PDM|PD)/i.test(license);
}

async function downloadAndConvertImage(remoteUrl, outputPath) {
  const temporaryPath = path.join(
    os.tmpdir(),
    `wc2026-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  const response = await fetchWithRetry(remoteUrl);
  await fs.writeFile(temporaryPath, Buffer.from(await response.arrayBuffer()));
  try {
    await execFileAsync("sips", [
      "-Z",
      "700",
      "-s",
      "format",
      "jpeg",
      "-s",
      "formatOptions",
      "78",
      temporaryPath,
      "--out",
      outputPath,
    ]);
  } finally {
    await fs.rm(temporaryPath, { force: true });
  }
}

async function mapConcurrent(values, limit, mapper) {
  const results = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(values[index], index);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, values.length) }, () => worker()),
  );
  return results;
}

const wikidataCache = {
  ...(await loadCache()),
  ...seedWikidataIds,
};
await saveCache(wikidataCache);

for (const config of teamConfigs) {
  const squad = squads.teams[config.code];
  console.log(`Weryfikuję Wikidata: ${config.team}`);
  for (const player of squad.players) {
    const key = `${config.code}:${player.name}`;
    if (!(key in wikidataCache)) {
      wikidataCache[key] = await resolveWikidataId(player);
      console.log(
        `  ${player.name}: ${wikidataCache[key] || "brak dopasowania"}`,
      );
      await saveCache(wikidataCache);
    }
  }
}

const allIds = Object.values(wikidataCache).filter(Boolean);
const wikidataEntities = await getEntities(allIds);
const commonsFiles = allIds
  .map(
    (id) =>
      wikidataEntities[id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value,
  )
  .filter(Boolean)
  .concat(Object.values(commonsFileOverrides));
const commonsByTitle = await getCommonsMetadata(commonsFiles);
const profiles = {};

for (const config of teamConfigs) {
  const squad = squads.teams[config.code];
  const outputDirectory = path.join(
    root,
    "assets/players",
    config.directory,
  );
  await fs.mkdir(outputDirectory, { recursive: true });

  console.log(`Przygotowuję zdjęcia: ${config.team}`);
  const players = await mapConcurrent(squad.players, 1, async (player) => {
    const wikidataId = wikidataCache[`${config.code}:${player.name}`];
    const entity = wikidataEntities[wikidataId];
    const commonsFile =
      commonsFileOverrides[`${config.code}:${player.name}`] ||
      entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value ||
      null;
    const commonsPage = commonsByTitle.get(`File:${commonsFile}`);
    const imageInfo = commonsPage?.imageinfo?.[0];
    const metadata = imageInfo?.extmetadata || {};
    const remoteImage = imageInfo?.thumburl || imageInfo?.url;
    const slug = slugify(player.name);
    let image = null;
    let photo = null;

    if (remoteImage && hasFreeLicense(metadata)) {
      const localName = `${slug}.jpg`;
      const localPath = path.join(outputDirectory, localName);
      try {
        if (!(await fileExists(localPath))) {
          await downloadAndConvertImage(remoteImage, localPath);
          await sleep(350);
        }
        image = `assets/players/${config.directory}/${localName}`;
        photo = {
          author: stripHtml(metadata.Artist?.value) || "Wikimedia Commons",
          license: metadata.LicenseShortName?.value,
          licenseUrl: metadata.LicenseUrl?.value || "",
          sourceUrl: imageInfo.descriptionurl,
          wikidataUrl: `https://www.wikidata.org/wiki/${wikidataId}`,
        };
      } catch (error) {
        console.warn(`  Avatar dla ${player.name}: ${error.message}`);
      }
    }

    return {
      ...player,
      ...playerDataOverrides[`${config.code}:${player.name}`],
      name:
        displayNameOverrides[`${config.code}:${player.name}`] || player.name,
      slug,
      team: config.team,
      teamCode: config.code,
      image,
      photo,
    };
  });

  profiles[config.code] = {
    team: config.team,
    teamGenitive: config.teamGenitive,
    teamCode: config.code,
    flag: config.flag,
    coach: squad.coach,
    source: squad.source,
    players,
  };
  console.log(
    `  ${players.filter((player) => player.image).length}/26 zdjęć, ${players.filter((player) => !player.image).length} avatarów`,
  );
}

await fs.writeFile(outputDataPath, `${JSON.stringify(profiles, null, 2)}\n`);
await fs.writeFile(
  outputScriptPath,
  `window.WC2026_PLAYER_PROFILES = ${JSON.stringify(profiles)};\n`,
);

const creditGroups = Object.values(profiles)
  .map((team) => {
    const rows = team.players
      .filter((player) => player.photo)
      .map(
        (player) => `
        <article class="credit">
          <img src="${player.image}" alt="" width="72" height="72">
          <div>
            <strong>${player.name}</strong>
            <span>${player.photo.author} · <a href="${player.photo.licenseUrl}">${player.photo.license}</a> · <a href="${player.photo.sourceUrl}">źródło</a></span>
          </div>
        </article>`,
      )
      .join("");
    return `<section><h2>${team.flag} ${team.team}</h2><div class="credits">${rows}</div></section>`;
  })
  .join("");

const credits = `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Autorzy zdjęć piłkarzy – Mistrzostwa Świata 2026</title>
<meta name="robots" content="noindex,follow">
<style>
  :root { color-scheme: dark; font-family: system-ui, sans-serif; }
  body { margin: 0; background: #07111f; color: #e2e8f0; }
  main { width: min(1080px, calc(100% - 32px)); margin: 0 auto; padding: 40px 0 64px; }
  h1 { color: #f8fafc; font-size: clamp(1.5rem, 4vw, 2.25rem); }
  h2 { margin: 36px 0 14px; color: #a7f3d0; }
  p { color: #94a3b8; line-height: 1.65; }
  a { color: #fde68a; }
  .back { display: inline-block; margin-bottom: 24px; color: #a7f3d0; }
  .credits { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
  .credit { display: flex; align-items: center; gap: 14px; padding: 12px; border: 1px solid rgba(52, 211, 153, .24); border-radius: 14px; background: rgba(15, 30, 48, .88); }
  .credit img { width: 72px; height: 72px; flex: 0 0 auto; border-radius: 12px; object-fit: cover; object-position: 50% 18%; background: #172033; }
  .credit strong { display: block; margin-bottom: 6px; color: #f8fafc; }
  .credit span { color: #cbd5e1; font-size: .875rem; line-height: 1.45; }
</style>
</head>
<body>
<main>
<a class="back" href="/">← Powrót do strony</a>
<h1>Autorzy zdjęć piłkarzy i licencje</h1>
<p>Zdjęcia pochodzą z Wikimedia Commons. Zostały zmniejszone i wykadrowane na potrzeby list zawodników i profili. Zawodnicy bez potwierdzonego zdjęcia otrzymują avatar z inicjałami.</p>
${creditGroups}
</main>
</body>
</html>
`;

await fs.writeFile(path.join(root, "player-credits.html"), credits);
console.log("Gotowe.");
