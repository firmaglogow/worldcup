(() => {
  "use strict";

  const players = [
    {
      id: "lionel-messi",
      rating: 94,
      name: "Lionel Messi",
      shortName: "Messi",
      country: "Argentyna",
      flag: "🇦🇷",
      position: "Napastnik",
      club: "Inter Miami CF",
      age: 38,
      image: "../assets/players/argentina/lionel-messi.jpg",
      accent: "#74c0fc",
      accentStrong: "#f8fafc",
      keyStat: {
        label: "Key stat",
        value: "10",
        detail: "numer i centrum gry Argentyny",
      },
      tournamentStats: {
        goals: 3,
        assists: 0,
        minutes: 270,
      },
      formImpact: 94,
      route:
        "Messi przyjeżdża na Mundial jako symbol Argentyny i zawodnik, który nadal potrafi jednym zagraniem zmienić ciężar meczu. Dla mistrzów świata jego doświadczenie, stałe fragmenty i spokój w decydujących momentach mogą być bezcenne.",
      curiosity:
        "To może być jeden z ostatnich wielkich turniejów Messiego w reprezentacji.",
      whyWatch:
        "Warto go obserwować, bo nawet gdy nie dominuje fizycznie, nadal widzi boisko szybciej niż większość rywali. Jeśli Argentyna będzie potrzebować jednego podania, wolnego albo karnego pod presją, oczy całego stadionu znów pójdą w jego stronę.",
    },
    {
      id: "kylian-mbappe",
      rating: 96,
      name: "Kylian Mbappé",
      shortName: "Mbappé",
      country: "Francja",
      flag: "🇫🇷",
      position: "Napastnik",
      club: "Real Madrid C. F.",
      age: 27,
      image: "../assets/players/france/kylian-mbappe.jpg",
      accent: "#60a5fa",
      accentStrong: "#fef08a",
      keyStat: {
        label: "Key stat",
        value: "10",
        detail: "numer lidera i główna broń Francji",
      },
      tournamentStats: {
        goals: "do uzupełnienia",
        assists: "do uzupełnienia",
        minutes: "do uzupełnienia",
      },
      formImpact: 96,
      route:
        "Mbappé przyjeżdża na Mundial jako zawodnik, który potrafi rozstrzygać mecze jednym sprintem, jednym zejściem do środka i jednym strzałem. To typ piłkarza, którego rywale muszą pilnować cały czas, bo zostawia mało miejsca na oddech.",
      curiosity:
        "Mbappé jest jednym z najmocniejszych symboli współczesnej reprezentacji Francji i od lat wnosi do niej natychmiastową groźbę pod bramką.",
      whyWatch:
        "Warto go obserwować, bo łączy szybkość, timing i pewność w polu karnym. Gdy Francja przyspiesza, Mbappé bywa tym momentem, po którym mecz zaczyna się naprawdę.",
    },
    {
      id: "erling-haaland",
      rating: 95,
      name: "Erling Haaland",
      shortName: "Haaland",
      country: "Norwegia",
      flag: "🇳🇴",
      position: "Napastnik",
      club: "Manchester City FC",
      age: 25,
      image: null,
      accent: "#ef4444",
      accentStrong: "#f8fafc",
      keyStat: {
        label: "Key stat",
        value: "9",
        detail: "numer klasycznego snajpera i punkt odniesienia w polu karnym",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 95,
      route:
        "Haaland przyjeżdża na Mundial jako zawodnik zbudowany do najtrudniejszych meczów: silny, bezpośredni i niebezpieczny w każdej sytuacji w polu karnym. Norwegia może opierać swoją ofensywę właśnie na jego ruchu, sile i finalizacji.",
      curiosity:
        "To jeden z nielicznych napastników, którzy potrafią zamienić pół sytuacji w pełną panikę dla obrony rywala.",
      whyWatch:
        "Warto go obserwować, bo Haaland zmienia mecz samą obecnością w szesnastce. Nawet przy małej liczbie kontaktów potrafi zrobić wielką różnicę jednym przyjęciem, jednym wbiegnięciem albo jednym wykończeniem.",
    },
    {
      id: "cristiano-ronaldo",
      rating: 94,
      name: "Cristiano Ronaldo",
      shortName: "Ronaldo",
      country: "Portugalia",
      flag: "🇵🇹",
      position: "Napastnik",
      club: "Al Nassr FC",
      age: 41,
      image: "../assets/players/portugal/cristiano-ronaldo.jpg",
      accent: "#22c55e",
      accentStrong: "#facc15",
      keyStat: {
        label: "Key stat",
        value: "7",
        detail: "ikoniczny numer i stałe zagrożenie w polu karnym",
      },
      tournamentStats: {
        goals: "do uzupełnienia",
        assists: "do uzupełnienia",
        minutes: "do uzupełnienia",
      },
      formImpact: 92,
      route:
        "Ronaldo wciąż pozostaje symbolem ambicji, profesjonalizmu i pewności siebie na największej scenie. Portugalia zyskuje dzięki niemu nie tylko strzelca, ale też zawodnika, który potrafi pociągnąć drużynę energią i doświadczeniem.",
      curiosity:
        "To jeden z najbardziej rozpoznawalnych piłkarzy w historii, a jego obecność nadal zmienia temperaturę każdego meczu.",
      whyWatch:
        "Warto go obserwować, bo Ronaldo zawsze ma w sobie coś z zawodnika, który potrafi odwrócić narrację meczu w jednym momencie. W szesnastce nadal jest jednym z najbardziej niebezpiecznych napastników turnieju.",
    },
  ];

  const positionLabels = {
    Napastnik: "FW",
    Pomocnik: "MF",
    Obrońca: "DF",
    Bramkarz: "GK",
  };

  function createElement(tag, className, text = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function fact(label, value, className = "world-star-fact") {
    const item = createElement("div", className);
    item.append(createElement("span", "", label), createElement("strong", "", value));
    return item;
  }

  function createVisual(player, className) {
    const wrap = createElement("div", className);
    wrap.style.setProperty("--accent", player.accent);

    if (player.image) {
      const image = document.createElement("img");
      image.src = player.image;
      image.alt = `Zdjęcie: ${player.name}`;
      image.width = 420;
      image.height = 520;
      image.decoding = "async";
      image.addEventListener("error", () => {
        wrap.replaceChildren(createPlaceholder(player));
      });
      wrap.append(image);
      return wrap;
    }

    wrap.append(createPlaceholder(player));
    return wrap;
  }

  function createPlaceholder(player) {
    const placeholder = createElement("div", "world-star-placeholder");
    placeholder.style.setProperty("--accent", player.accent);
    placeholder.style.setProperty("--accent-strong", player.accentStrong);

    const monogram = createElement("div", "world-star-placeholder-monogram", player.shortName.slice(0, 2).toUpperCase());
    const label = createElement("div", "world-star-placeholder-label");
    label.append(
      createElement("span", "", player.flag),
      createElement("strong", "", player.country),
      createElement("p", "", player.position),
    );

    placeholder.append(monogram, label);
    return placeholder;
  }

  function createCard(player) {
    const card = document.createElement("button");
    card.className = "world-star-card";
    card.type = "button";
    card.dataset.starId = player.id;
    card.style.setProperty("--accent", player.accent);
    card.style.setProperty("--accent-strong", player.accentStrong);
    card.setAttribute("aria-label", `Otwórz profil: ${player.name}`);

    const top = createElement("div", "world-star-card-top");
    const rating = createElement("div", "world-star-rating", String(player.rating));
    rating.append(createElement("span", "", positionLabels[player.position] || player.position));
    const flag = createElement("span", "world-star-flag", player.flag);
    flag.setAttribute("aria-label", player.country);
    top.append(rating, flag);

    const imageWrap = createVisual(player, "world-star-image");

    const body = createElement("div", "world-star-card-body");
    body.append(
      createElement("h3", "world-star-name", player.shortName),
      createElement("p", "world-star-meta", `${player.flag} ${player.country} · ${player.position} · ${player.club}`),
    );

    const keyStat = createElement("div", "world-star-key-stat");
    keyStat.append(
      createElement("span", "", player.keyStat.label),
      createElement("strong", "", player.keyStat.value),
    );
    body.append(keyStat, createElement("p", "world-star-cta", "Kliknij kartę, żeby zobaczyć profil"));

    card.append(top, imageWrap, body);
    card.addEventListener("click", () => openDialog(player));
    return card;
  }

  function renderDialogContent(player) {
    const content = createElement("article", "world-star-detail");

    const media = createVisual(player, "world-star-detail-media");

    const details = createElement("div", "world-star-detail-content");
    const title = createElement("div", "world-star-detail-title");
    title.append(
      createElement("p", "", `${player.flag} ${player.country} · ${player.position}`),
      createElement("h2", "", player.name),
    );
    title.querySelector("h2").id = "star-dialog-title";

    const facts = createElement("div", "world-star-facts");
    facts.append(
      fact("Wiek", `${player.age} lat`),
      fact("Reprezentacja", player.country),
      fact("Klub", player.club),
      fact("Pozycja", player.position),
      fact("Key stat", player.keyStat.detail),
      fact("Karta", `${player.rating} OVR`),
    );

    const route = createElement("section", "world-star-copy-block");
    route.append(createElement("h3", "", "Droga na Mundial"), createElement("p", "", player.route));

    const stats = createElement("div", "world-star-stats");
    stats.append(
      fact("Gole", String(player.tournamentStats.goals), "world-star-stat"),
      fact("Asysty", String(player.tournamentStats.assists), "world-star-stat"),
      fact("Minuty", String(player.tournamentStats.minutes), "world-star-stat"),
    );

    const impact = createElement("section", "world-star-impact");
    const impactTop = createElement("div", "world-star-impact-top");
    impactTop.append(
      createElement("span", "", "Forma / wpływ na drużynę"),
      createElement("strong", "", `${player.formImpact}%`),
    );
    const impactTrack = createElement("div", "world-star-impact-track");
    const impactFill = createElement("span", "world-star-impact-fill");
    impactFill.style.width = `${player.formImpact}%`;
    impactTrack.append(impactFill);
    impact.append(impactTop, impactTrack);

    const curiosity = createElement("section", "world-star-copy-block");
    curiosity.append(createElement("h3", "", "Ciekawostka"), createElement("p", "", player.curiosity));

    const whyWatch = createElement("section", "world-star-copy-block");
    whyWatch.append(
      createElement("h3", "", "Dlaczego warto go obserwować"),
      createElement("p", "", player.whyWatch),
    );

    details.append(title, facts, route, stats, impact, curiosity, whyWatch);
    content.append(media, details);
    return content;
  }

  function openDialog(player) {
    const dialog = document.querySelector("[data-star-dialog]");
    const content = document.querySelector("[data-star-dialog-content]");
    if (!dialog || !content) return;

    content.replaceChildren(renderDialogContent(player));
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeDialog() {
    const dialog = document.querySelector("[data-star-dialog]");
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  const grid = document.querySelector("[data-stars-grid]");
  players.forEach((player) => grid?.append(createCard(player)));

  document.querySelector("[data-star-close]")?.addEventListener("click", closeDialog);
  document.querySelector("[data-star-dialog]")?.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeDialog();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDialog();
  });
})();
