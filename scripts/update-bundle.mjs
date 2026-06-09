import fs from "node:fs";

const file = new URL("../assets/app.js", import.meta.url);
let source = fs.readFileSync(file, "utf8");

function replaceOnce(from, to) {
  const count = source.split(from).length - 1;
  if (count === 0 && source.includes(to)) return;
  if (count !== 1) {
    throw new Error(`Expected one occurrence, found ${count}: ${from}`);
  }
  source = source.replace(from, to);
}

const matchCorrections = [
  [
    'id:6,date:"2026-06-14",time:"01:00"',
    'id:6,date:"2026-06-14",time:"00:00"',
  ],
  [
    'id:17,date:"2026-06-16",time:"22:00"',
    'id:17,date:"2026-06-16",time:"21:00"',
  ],
  [
    'id:43,date:"2026-06-23",time:"03:00"',
    'id:43,date:"2026-06-23",time:"02:00"',
  ],
  [
    'id:55,date:"2026-06-25",time:"23:00"',
    'id:55,date:"2026-06-25",time:"22:00"',
  ],
  [
    'id:67,date:"2026-06-28",time:"00:00"',
    'id:67,date:"2026-06-27",time:"23:00"',
  ],
  [
    'id:"M104",no:104,round:"FINA\\u0141",date:"2026-07-19",time:"20:00"',
    'id:"M104",no:104,round:"FINA\\u0141",date:"2026-07-19",time:"21:00"',
  ],
  ["2026-07-19T20:00", "2026-07-19T21:00"],
];

for (const [from, to] of matchCorrections) replaceOnce(from, to);

replaceOnce("capacity:78576", "capacity:82500");
replaceOnce(
  String.raw`najwi\u0119kszym obiekcie turnieju (78 576 miejsc).`,
  String.raw`arenie fina\u0142u turnieju (82 500 miejsc).`,
);
replaceOnce(
  String.raw`children:"Post\u0119p turnieju"`,
  String.raw`children:"Post\u0119p fazy grupowej"`,
);
replaceOnce(
  String.raw`Punkty FIFA podane dla czo\u0142owych reprezentacji (kwiecie\u0144 2026). Pe\u0142na punktacja po aktualizacji rankingu 9 czerwca 2026.`,
  String.raw`Ranga i punkty FIFA maj\u0105 charakter orientacyjny. Aktualizujemy je po publikacji kolejnego oficjalnego rankingu.`,
);
replaceOnce(
  String.raw`Ranga i punkty wg oficjalnego rankingu FIFA z kwietnia 2026. Kliknij dru\u017Cyn\u0119 \u2014 pobior\u0119 z netu jej kadr\u0119 i osi\u0105gni\u0119cia. Kliknij \u2B50 by doda\u0107 do ulubionych (ich mecze pod\u015Bwietl\u0105 si\u0119 w terminarzu).`,
  String.raw`Ranga i punkty pochodz\u0105 z rankingu FIFA z kwietnia 2026. Kliknij dru\u017Cyn\u0119, aby zobaczy\u0107 jej profil. Gwiazdk\u0105 dodasz j\u0105 do ulubionych, a jej mecze pod\u015Bwietl\u0105 si\u0119 w terminarzu.`,
);
replaceOnce(
  String.raw`Osi\u0105gni\u0119cia i gwiazdy powy\u017Cej s\u0105 dost\u0119pne offline \u2014 pe\u0142na kadra wymaga po\u0142\u0105czenia.`,
  String.raw`Osi\u0105gni\u0119cia i wyr\u00f3\u017cnieni zawodnicy s\u0105 zapisani bezpo\u015brednio na stronie.`,
);
replaceOnce(
  String.raw`Oficjalne, pe\u0142ne kadry (26 zawodnik\xF3w) zostan\u0105 og\u0142oszone przez federacje ok. 3 tygodnie przed turniejem.`,
  String.raw`FIFA opublikowa\u0142a oficjalne kadry turniejowe 2 czerwca 2026.`,
);

const fetchHint = String.raw`"\u2014 (pobierz kadr\u0119)"`;
const fetchHintCount = source.split(fetchHint).length - 1;
if (fetchHintCount > 0) {
  source = source.replaceAll(fetchHint, String.raw`"Jeszcze nieuzupe\u0142nione"`);
}

const anthropicUrl = "https://api.anthropic.com/v1/messages";
const anthropicCount = source.split(anthropicUrl).length - 1;
if (anthropicCount > 0) {
  source = source.replaceAll(anthropicUrl, "/worldcup/api-disabled");
}

fs.writeFileSync(file, source);
console.log("Bundle updated.");
