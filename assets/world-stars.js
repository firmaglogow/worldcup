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

    const imageWrap = createElement("div", "world-star-image");
    const image = document.createElement("img");
    image.src = player.image;
    image.alt = `Zdjęcie: ${player.name}`;
    image.width = 420;
    image.height = 520;
    image.decoding = "async";
    imageWrap.append(image);

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

    const media = createElement("div", "world-star-detail-media");
    const image = document.createElement("img");
    image.src = player.image;
    image.alt = `Zdjęcie: ${player.name}`;
    media.append(image);

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
