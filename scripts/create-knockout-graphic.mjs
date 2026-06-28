import fs from "node:fs";

const matchesPath = new URL("../data/matches.json", import.meta.url);
const outDir = new URL("../assets/graphics/", import.meta.url);
const svgPath = new URL("../assets/graphics/drabinka-ms-2026.svg", import.meta.url);
const htmlPath = new URL("../assets/graphics/drabinka-ms-2026.html", import.meta.url);

fs.mkdirSync(outDir, { recursive: true });

const schedule = JSON.parse(fs.readFileSync(matchesPath, "utf8"));
const knockoutMatches = schedule.matches
  .filter((match) => match.phase === "knockout")
  .sort((first, second) => Number(first.id) - Number(second.id));
const byId = new Map(knockoutMatches.map((match) => [Number(match.id), match]));

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function teamLabel(match, side) {
  const flag = match[`${side}Flag`] || "";
  const name = match[`${side}Name`] || match[`${side}Label`] || "Do ustalenia";
  return `${flag} ${name}`.trim();
}

function sourceMatchId(label) {
  return Number(label?.match(/meczu (\d+)/)?.[1]) || null;
}

function possibleFromMatch(id, depth = 0) {
  const match = byId.get(Number(id));
  if (!match || depth > 5) return `Mecz ${id}`;

  if (match.homeName && match.awayName) {
    return `${teamLabel(match, "home")} / ${teamLabel(match, "away")}`;
  }

  const homeSource = sourceMatchId(match.homeLabel);
  const awaySource = sourceMatchId(match.awayLabel);
  const home = homeSource ? possibleFromMatch(homeSource, depth + 1) : match.homeLabel;
  const away = awaySource ? possibleFromMatch(awaySource, depth + 1) : match.awayLabel;
  return `${home} / ${away}`;
}

function slotLabel(match, side, mode = "possible") {
  const name = match[`${side}Name`];
  if (name) return teamLabel(match, side);

  const label = match[`${side}Label`];
  const source = sourceMatchId(label);
  if (mode === "source") {
    return label
      ? label
          .replace("Zwycięzca meczu ", "Zwyc. #")
          .replace("Przegrany meczu ", "Przegr. #")
      : "Do ustalenia";
  }
  if (source) return possibleFromMatch(source);

  return label || "Do ustalenia";
}

function roundCard(match, mode = "possible") {
  const home = slotLabel(match, "home", mode);
  const away = slotLabel(match, "away", mode);
  const title = mode === "teams" ? `#${match.id} · ${match.time}` : `#${match.id} · ${match.date} · ${match.time}`;
  return {
    id: match.id,
    title,
    home,
    away,
    venue: `${match.stadium} · ${match.city}`,
  };
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function textBlock(lines, x, y, options = {}) {
  const {
    size = 24,
    weight = 800,
    color = "#f8fafc",
    anchor = "start",
    gap = size * 1.25,
    maxChars = 38,
  } = options;
  const wrapped = Array.isArray(lines) ? lines : wrapText(lines, maxChars);
  return wrapped
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * gap}" fill="${color}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" font-family="Inter, Arial, sans-serif">${escapeXml(line)}</text>`,
    )
    .join("");
}

function matchCard(card, x, y, width, height, accent = "#34d399", options = {}) {
  const maxChars = options.maxChars || 32;
  const teamSize = options.teamSize || 25;
  const homeLines = wrapText(card.home, maxChars);
  const awayLines = wrapText(card.away, maxChars);
  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="22" fill="rgba(15,23,42,0.86)" stroke="${accent}" stroke-opacity="0.5" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="${width}" height="6" rx="3" fill="${accent}"/>
      ${textBlock(card.title, x + 24, y + 36, { size: 18, weight: 900, color: "#94a3b8", maxChars: 40 })}
      ${textBlock(homeLines, x + 24, y + 72, { size: teamSize, weight: 950, color: "#ffffff", maxChars })}
      <text x="${x + width / 2}" y="${y + Math.floor(height / 2) + 8}" fill="#fbbf24" font-size="22" font-weight="950" text-anchor="middle" font-family="Inter, Arial, sans-serif">VS</text>
      ${textBlock(awayLines, x + 24, y + Math.floor(height / 2) + 44, { size: teamSize, weight: 950, color: "#ffffff", maxChars })}
      ${
        options.showVenue
          ? textBlock(card.venue, x + 24, y + height - 18, {
              size: 15,
              weight: 800,
              color: "#64748b",
              maxChars: Math.floor(width / 13),
            })
          : ""
      }
    </g>
  `;
}

function sectionTitle(title, x, y, subtitle = "") {
  return `
    <g>
      <text x="${x}" y="${y}" fill="#fbbf24" font-size="24" font-weight="950" letter-spacing="3" font-family="Inter, Arial, sans-serif">${escapeXml(title.toUpperCase())}</text>
      ${
        subtitle
          ? `<text x="${x}" y="${y + 30}" fill="#94a3b8" font-size="17" font-weight="800" font-family="Inter, Arial, sans-serif">${escapeXml(subtitle)}</text>`
          : ""
      }
    </g>
  `;
}

const round16 = knockoutMatches.filter((match) => match.round === "1/16").map((match) => roundCard(match, "teams"));
const round8 = knockoutMatches.filter((match) => match.round === "1/8").map((match) => roundCard(match, "possible"));
const quarters = knockoutMatches.filter((match) => match.round === "Ćwierćfinał").map((match) => roundCard(match, "source"));
const semis = knockoutMatches.filter((match) => match.round === "Półfinał").map((match) => roundCard(match, "source"));
const third = knockoutMatches.filter((match) => match.round === "O 3. miejsce").map((match) => roundCard(match, "source"));
const final = knockoutMatches.filter((match) => match.round === "FINAŁ").map((match) => roundCard(match, "source"));

const width = 1440;
const height = 3600;
let body = `
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#020617"/>
      <stop offset="0.52" stop-color="#082018"/>
      <stop offset="1" stop-color="#07111f"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="12%" r="55%">
      <stop offset="0" stop-color="#34d399" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#34d399" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <circle cx="1180" cy="150" r="220" fill="#fbbf24" opacity="0.08"/>
  <text x="80" y="96" fill="#fbbf24" font-size="24" font-weight="950" letter-spacing="6" font-family="Inter, Arial, sans-serif">MUNDIAL 26'</text>
  <text x="80" y="156" fill="#ffffff" font-size="58" font-weight="950" font-family="Inter, Arial, sans-serif">DRABINKA FAZY PUCHAROWEJ</text>
  <text x="80" y="202" fill="#a7f3d0" font-size="24" font-weight="850" font-family="Inter, Arial, sans-serif">Mistrzostwa Świata 2026 · podgląd możliwych par</text>
  <text x="1360" y="108" fill="#fde68a" font-size="48" font-weight="950" text-anchor="end" font-family="Inter, Arial, sans-serif">🏆</text>
`;

body += sectionTitle("1/16 finału", 80, 290, "Aktualne pary startowe fazy pucharowej");
round16.forEach((card, index) => {
  const col = index % 2;
  const row = Math.floor(index / 2);
  body += matchCard(card, 80 + col * 650, 340 + row * 150, 610, 128, ["#fbbf24", "#34d399"][col], {
    maxChars: 30,
    teamSize: 25,
  });
});

body += sectionTitle("1/8 finału", 80, 1580, "Kto może trafić na kogo po meczach 1/16");
round8.forEach((card, index) => {
  const col = index % 2;
  const row = Math.floor(index / 2);
  body += matchCard(card, 80 + col * 650, 1620 + row * 210, 610, 178, col ? "#60a5fa" : "#34d399", {
    maxChars: 33,
    teamSize: 24,
  });
});

body += sectionTitle("Ćwierćfinały", 80, 2510, "Tu wejdą zwycięzcy wskazanych meczów 1/8");
quarters.forEach((card, index) => {
  const col = index % 2;
  const row = Math.floor(index / 2);
  body += matchCard(card, 80 + col * 650, 2550 + row * 165, 610, 132, "#fbbf24", {
    maxChars: 28,
    teamSize: 24,
  });
});

body += sectionTitle("Półfinały i finał", 80, 2950, "Ostatnia prosta turnieju");
semis.forEach((card, index) => {
  body += matchCard(card, 80 + index * 650, 2990, 610, 132, "#34d399", {
    maxChars: 28,
    teamSize: 24,
  });
});
final.forEach((card) => {
  body += matchCard(card, 80, 3165, 610, 132, "#fbbf24", {
    maxChars: 28,
    teamSize: 24,
  });
});
third.forEach((card) => {
  body += matchCard(card, 730, 3165, 610, 132, "#60a5fa", {
    maxChars: 28,
    teamSize: 24,
  });
});

body += `<text x="80" y="3470" fill="#94a3b8" font-size="18" font-weight="800" font-family="Inter, Arial, sans-serif">Grafika generowana z terminarza mistrzostwaswiata2026.pl · po wynikach mecze automatycznie zawężą się do konkretnych drużyn.</text>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>\n`;
const html = `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Drabinka MŚ 2026</title>
  <style>
    html, body { margin: 0; background: #07111f; }
    img { display: block; max-width: 100%; height: auto; margin: 0 auto; }
  </style>
</head>
<body>
  <img src="./drabinka-ms-2026.svg" alt="Drabinka fazy pucharowej Mistrzostw Świata 2026">
</body>
</html>
`;

fs.writeFileSync(svgPath, svg);
fs.writeFileSync(htmlPath, html);
console.log(new URL(svgPath).pathname);
console.log(new URL(htmlPath).pathname);
