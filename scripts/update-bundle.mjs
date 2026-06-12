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

replaceOnce(
  "[L,I]=(0,Y.useState)({})",
  "[L,I]=(0,Y.useState)(()=>window.WC2026_SQUADS||{})",
);
replaceOnce(
  "I(Z.teamData||{})",
  "I(Object.assign({},Z.teamData||{},window.WC2026_SQUADS||{}))",
);
const stadiumCapacityCorrections = [
  ["capacity:72766", "capacity:83e3"],
  ["capacity:44330", "capacity:48e3"],
  ["capacity:50113", "capacity:53500"],
  ["capacity:48821", "capacity:54e3"],
  ["capacity:78576", "capacity:82500"],
  ["capacity:69650", "capacity:70e3"],
  ["capacity:69391", "capacity:71e3"],
  ["capacity:68311", "capacity:72e3"],
  ["capacity:70122", "capacity:94e3"],
  ["capacity:63815", "capacity:65e3"],
  ["capacity:65827", "capacity:69e3"],
  ["capacity:64091", "capacity:65e3"],
  ["capacity:67382", "capacity:75e3"],
  ["capacity:67513", "capacity:73e3"],
  ["capacity:65123", "capacity:69e3"],
];

for (const [from, to] of stadiumCapacityCorrections) replaceOnce(from, to);

replaceOnce(
  String.raw`children:"Pojemno\u015B\u0107"`,
  String.raw`children:"Pojemno\u015B\u0107 wg FIFA"`,
);
replaceOnce(
  String.raw`fact:"Gigantyczny ekran 50\xD722m. Dom Dallas Cowboys \u2013 go\u015Bci p\xF3\u0142fina\u0142."`,
  String.raw`fact:"Stadion znajduje si\u0119 w Arlington. Gigantyczny ekran 50\xD722m. Dom Dallas Cowboys \u2013 go\u015Bci p\xF3\u0142fina\u0142."`,
);
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
replaceOnce(
  String.raw`S&&!f&&(0,c.jsxs)("button",{onClick:L,className:"text-xs text-emerald-300 hover:text-emerald-100 flex items-center gap-1",children:[(0,c.jsx)(no,{className:"w-3 h-3"})," Od\u015Bwie\u017C"]})`,
  String.raw`S&&!f&&(0,c.jsx)("span",{className:"text-xs text-slate-500",children:"26 zawodnik\u00f3w"})`,
);
replaceOnce(
  String.raw`Sk\u0142ad orientacyjny \u2014 oficjalne kadry FIFA og\u0142aszane s\u0105 ok. 3 tygodnie przed turniejem.`,
  String.raw`Oficjalna kadra turniejowa \u00b7 lista FIFA z 9 czerwca 2026.`,
);
replaceOnce(
  String.raw`Chcesz wi\u0119cej nazwisk? Pobierz kadry dru\u017Cyn w zak\u0142adce Reprezentacje \u2014 pojawi\u0105 si\u0119 tutaj.`,
  String.raw`Do wyboru s\u0105 wszyscy zawodnicy z oficjalnych kadr turniejowych.`,
);
replaceOnce(
  String.raw`(gwiazdy + pobrane kadry).`,
  String.raw`(oficjalne kadry turniejowe).`,
);
replaceOnce(
  "return Object.entries(Q_).forEach(([n,o])=>(o.stars||[]).forEach(i=>a(i,n,null))),Object.entries(e||{})",
  "return Object.entries(e||{})",
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
