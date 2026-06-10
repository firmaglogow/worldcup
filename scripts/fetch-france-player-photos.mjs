import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const squads = JSON.parse(
  await fs.readFile(path.join(root, "data/squads.json"), "utf8"),
);
const france = squads.teams.FRA;
const outputDirectory = path.join(root, "assets/players/france");

const wikidataIds = {
  "Brice Samba": "Q15627817",
  "Malo Gusto": "Q78752401",
  "Lucas Digne": "Q72648",
  "Dayot Upamecano": "Q20723878",
  "Jules Kounde": "Q47170176",
  "Manu Kone": "Q64029237",
  "Ousmane Dembele": "Q20851003",
  "Aurelien Tchouameni": "Q46951844",
  "Marcus Thuram": "Q19903718",
  "Kylian Mbappe": "Q21621995",
  "Michael Olise": "Q62050484",
  "Bradley Barcola": "Q99670930",
  "Ngolo Kante": "Q16665941",
  "Adrien Rabiot": "Q18962",
  "Ibrahima Konate": "Q30301454",
  "Mike Maignan": "Q17274709",
  "William Saliba": "Q56868118",
  "Warren Zaire-Emery": "Q111280241",
  "Theo Hernandez": "Q23703372",
  "Desire Doue": "Q112170256",
  "Lucas Hernandez": "Q18924954",
  "Jean-Philippe Mateta": "Q26964668",
  "Robin Risser": "Q124745247",
  "Rayan Cherki": "Q64736321",
  "Maghnes Akliouche": "Q108910786",
  "Maxence Lacroix": "Q60286976",
};

const displayNames = {
  "Jules Kounde": "Jules Koundé",
  "Manu Kone": "Manu Koné",
  "Ousmane Dembele": "Ousmane Dembélé",
  "Aurelien Tchouameni": "Aurélien Tchouaméni",
  "Kylian Mbappe": "Kylian Mbappé",
  "Ngolo Kante": "N'Golo Kanté",
  "Ibrahima Konate": "Ibrahima Konaté",
  "Warren Zaire-Emery": "Warren Zaïre-Emery",
  "Theo Hernandez": "Théo Hernandez",
  "Desire Doue": "Désiré Doué",
};

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
    .replace(/\s+/g, " ")
    .trim();
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "mistrzostwaswiata2026.pl/1.0 (emistrzostwaswiata2026@gmail.com)",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

const wikidataUrl = new URL("https://www.wikidata.org/w/api.php");
wikidataUrl.search = new URLSearchParams({
  action: "wbgetentities",
  format: "json",
  props: "claims",
  ids: Object.values(wikidataIds).join("|"),
});
const wikidata = await getJson(wikidataUrl);

const photosByPlayer = new Map();
for (const [name, id] of Object.entries(wikidataIds)) {
  const fileName =
    wikidata.entities[id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (fileName) photosByPlayer.set(name, fileName);
}

const commonsUrl = new URL("https://commons.wikimedia.org/w/api.php");
commonsUrl.search = new URLSearchParams({
  action: "query",
  format: "json",
  prop: "imageinfo",
  iiprop: "url|extmetadata",
  iiurlwidth: "700",
  titles: [...photosByPlayer.values()]
    .map((fileName) => `File:${fileName}`)
    .join("|"),
});
const commons = await getJson(commonsUrl);
const commonsByTitle = new Map(
  Object.values(commons.query.pages).map((page) => [page.title, page]),
);

await fs.mkdir(outputDirectory, { recursive: true });

const players = [];
for (const player of france.players) {
  const slug = slugify(player.name);
  const wikidataId = wikidataIds[player.name];
  const commonsFile = photosByPlayer.get(player.name);
  const commonsPage = commonsByTitle.get(`File:${commonsFile}`);
  const imageInfo = commonsPage?.imageinfo?.[0];
  const remoteImage = imageInfo?.thumburl || imageInfo?.url;
  let image = null;
  let photo = null;

  if (remoteImage) {
    const extension = new URL(remoteImage).pathname
      .match(/\.(jpe?g|png|webp)$/i)?.[1]
      ?.toLowerCase()
      .replace("jpeg", "jpg");
    const localName = `${slug}.${extension || "jpg"}`;
    const localPath = path.join(outputDirectory, localName);
    const response = await fetch(remoteImage, {
      headers: {
        "user-agent":
          "mistrzostwaswiata2026.pl/1.0 (emistrzostwaswiata2026@gmail.com)",
      },
    });
    if (!response.ok) {
      throw new Error(`Nie udało się pobrać zdjęcia ${player.name}`);
    }
    await fs.writeFile(localPath, Buffer.from(await response.arrayBuffer()));

    const metadata = imageInfo.extmetadata || {};
    image = `assets/players/france/${localName}`;
    photo = {
      author: stripHtml(metadata.Artist?.value) || "Wikimedia Commons",
      license: metadata.LicenseShortName?.value || "Wolna licencja",
      licenseUrl: metadata.LicenseUrl?.value || "",
      sourceUrl: imageInfo.descriptionurl,
      wikidataUrl: `https://www.wikidata.org/wiki/${wikidataId}`,
    };
  }

  players.push({
    ...player,
    name: displayNames[player.name] || player.name,
    slug,
    team: "Francja",
    teamCode: "FRA",
    image,
    photo,
  });
}

const payload = {
  team: "Francja",
  teamCode: "FRA",
  flag: "🇫🇷",
  coach: france.coach,
  source: france.source,
  players,
};

await fs.writeFile(
  path.join(root, "data/france-players.json"),
  `${JSON.stringify(payload, null, 2)}\n`,
);
await fs.writeFile(
  path.join(root, "assets/france-players.js"),
  `window.WC2026_PLAYER_PROFILES = ${JSON.stringify({ FRA: payload })};\n`,
);

const creditRows = players
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

const credits = `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Autorzy zdjęć piłkarzy Francji – Mistrzostwa Świata 2026</title>
<meta name="robots" content="noindex,follow">
<style>
  :root { color-scheme: dark; font-family: system-ui, sans-serif; }
  body { margin: 0; background: #07111f; color: #e2e8f0; }
  main { width: min(960px, calc(100% - 32px)); margin: 0 auto; padding: 40px 0 64px; }
  h1 { color: #f8fafc; font-size: clamp(1.5rem, 4vw, 2.25rem); }
  p { color: #94a3b8; line-height: 1.65; }
  a { color: #fde68a; }
  .back { display: inline-block; margin-bottom: 24px; color: #a7f3d0; }
  .credits { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-top: 28px; }
  .credit { display: flex; align-items: center; gap: 14px; padding: 12px; border: 1px solid rgba(52, 211, 153, .24); border-radius: 14px; background: rgba(15, 30, 48, .88); }
  .credit img { width: 72px; height: 72px; flex: 0 0 auto; border-radius: 12px; object-fit: cover; object-position: 50% 18%; background: #172033; }
  .credit strong { display: block; margin-bottom: 6px; color: #f8fafc; }
  .credit span { color: #cbd5e1; font-size: .875rem; line-height: 1.45; }
</style>
</head>
<body>
<main>
<a class="back" href="/">← Powrót do strony</a>
<h1>Autorzy zdjęć piłkarzy Francji i licencje</h1>
<p>Zdjęcia pochodzą z Wikimedia Commons. Zostały zmniejszone i wykadrowane przez przeglądarkę na potrzeby listy zawodników i profili.</p>
<div class="credits">${creditRows}
</div>
</main>
</body>
</html>
`;

await fs.writeFile(path.join(root, "player-credits.html"), credits);
console.log(`Pobrano ${players.filter((player) => player.image).length} zdjęć.`);
