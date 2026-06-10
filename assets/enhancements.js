(() => {
  "use strict";

  const selectLabels = new Map([
    ["Wszystkie grupy", "Filtr grupy"],
    ["Wszystkie dni", "Filtr dnia"],
    ["Wszystkie drużyny", "Filtr drużyny"],
    ["-- Drużyna A --", "Pierwsza drużyna do porównania"],
    ["-- Drużyna B --", "Druga drużyna do porównania"],
  ]);

  function labelControls() {
    document.querySelectorAll("select:not([aria-label])").forEach((select) => {
      const firstOption = select.options[0]?.textContent.trim();
      select.setAttribute(
        "aria-label",
        selectLabels.get(firstOption) || "Wybierz opcję",
      );
    });

    document
      .querySelectorAll('input[type="number"]:not([aria-label])')
      .forEach((input, index) => {
        input.setAttribute(
          "aria-label",
          index % 2 === 0 ? "Gole gospodarzy" : "Gole gości",
        );
        input.setAttribute("inputmode", "numeric");
      });
  }

  function labelFavoriteButtons() {
    document
      .querySelectorAll(
        'button[title="Ulubione"], button[data-favorite-button="true"]',
      )
      .forEach((button) => {
        const teamButton = button.parentElement?.querySelector(
          'button:not([title="Ulubione"]):not([data-favorite-button="true"])',
        );
        const teamText = teamButton?.textContent.trim() || "";
        const teamName =
          teamText.match(
            /^#\d+.*?([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż. ]+?)(UEFA|CONMEBOL|CONCACAF|CAF|AFC|OFC)/,
          )?.[1]?.trim() || "drużynę";
        const iconClass =
          button.querySelector("svg")?.getAttribute("class") || "";
        const active = iconClass.includes("fill-amber");
        const action = active ? "Usuń" : "Dodaj";
        const label = `${action} ${teamName} ${active ? "z" : "do"} ulubionych`;

        button.dataset.favoriteButton = "true";
        button.setAttribute("aria-label", label);
        button.setAttribute("title", label);
        button.setAttribute("aria-pressed", String(active));
      });
  }

  function addDataSource() {
    const footer = document.querySelector("footer");
    if (!footer || footer.querySelector("[data-data-source]")) return;

    const note = document.createElement("p");
    note.dataset.dataSource = "true";
    note.className = "mt-3 text-xs text-slate-400";
    note.textContent =
      "Terminarz i oficjalne kadry: FIFA. Aktualizacja: 9 czerwca 2026.";
    footer.append(note);
  }

  function replaceHeaderTrophy() {
    const heading = [...document.querySelectorAll("h1")].find(
      (element) => element.textContent.trim() === "MISTRZOSTWA ŚWIATA 2026",
    );
    const brandRow = heading?.parentElement?.parentElement;
    const mark = brandRow?.firstElementChild;

    if (!mark || mark.querySelector(".site-trophy-image")) return;

    const image = document.createElement("img");
    image.src = "assets/trophy-header.png";
    image.alt = "";
    image.className = "site-trophy-image";
    image.width = 48;
    image.height = 48;
    image.decoding = "async";

    mark.classList.add("site-trophy-mark");
    mark.replaceChildren(image);
  }

  const stadiumMapInfo = [
    {
      city: "Vancouver",
      stadium: "BC Place",
      details: "48 821 miejsc · 8 meczów",
      image: "bc-place.webp",
      x: 17.96,
      y: 17.96,
      color: "#fb5b4b",
    },
    {
      city: "Seattle",
      stadium: "Lumen Field",
      details: "65 123 miejsc · 5 meczów",
      image: "lumen-field.webp",
      x: 18.85,
      y: 25.05,
      color: "#3b82f6",
    },
    {
      city: "San Francisco",
      stadium: "Levi's Stadium",
      details: "69 391 miejsc · 6 meczów",
      image: "levis-stadium.webp",
      x: 15.95,
      y: 43.19,
      color: "#3b82f6",
    },
    {
      city: "Los Angeles",
      stadium: "SoFi Stadium",
      details: "69 650 miejsc · 8 meczów",
      image: "sofi-stadium.webp",
      x: 17.96,
      y: 49.54,
      color: "#3b82f6",
    },
    {
      city: "Kansas City",
      stadium: "Arrowhead Stadium",
      details: "67 513 miejsc · 6 meczów",
      image: "arrowhead-stadium.webp",
      x: 53.25,
      y: 43.74,
      color: "#3b82f6",
    },
    {
      city: "Dallas",
      stadium: "AT&T Stadium",
      details: "70 122 miejsc · 9 meczów",
      image: "att-stadium.webp",
      x: 50.28,
      y: 53.96,
      color: "#3b82f6",
    },
    {
      city: "Houston",
      stadium: "NRG Stadium",
      details: "68 311 miejsc · 7 meczów",
      image: "nrg-stadium.webp",
      x: 51.38,
      y: 61.6,
      color: "#3b82f6",
    },
    {
      city: "Atlanta",
      stadium: "Mercedes-Benz Stadium",
      details: "67 382 miejsc · 8 meczów",
      image: "mercedes-benz-stadium.webp",
      x: 67.54,
      y: 50.55,
      color: "#3b82f6",
    },
    {
      city: "Miami",
      stadium: "Hard Rock Stadium",
      details: "64 091 miejsc · 7 meczów",
      image: "hard-rock-stadium.webp",
      x: 73.76,
      y: 61.05,
      color: "#3b82f6",
    },
    {
      city: "Boston",
      stadium: "Gillette Stadium",
      details: "63 815 miejsc · 7 meczów",
      image: "gillette-stadium.webp",
      x: 81.42,
      y: 31.68,
      color: "#3b82f6",
    },
    {
      city: "New York / New Jersey",
      stadium: "MetLife Stadium",
      details: "82 500 miejsc · 8 meczów · finał",
      image: "metlife-stadium.webp",
      x: 79.97,
      y: 36.37,
      color: "#fbbf24",
    },
    {
      city: "Philadelphia",
      stadium: "Lincoln Financial Field",
      details: "65 827 miejsc · 6 meczów",
      image: "lincoln-financial-field.webp",
      x: 78.45,
      y: 40.61,
      color: "#3b82f6",
    },
    {
      city: "Toronto",
      stadium: "BMO Field",
      details: "45 000 miejsc · 6 meczów",
      image: "bmo-field.webp",
      x: 72.31,
      y: 23.94,
      color: "#fb5b4b",
    },
    {
      city: "Monterrey",
      stadium: "Estadio BBVA",
      details: "50 113 miejsc · 4 mecze",
      image: "estadio-bbva.webp",
      x: 44.54,
      y: 73.3,
      color: "#4ade80",
    },
    {
      city: "Guadalajara",
      stadium: "Estadio Akron",
      details: "44 330 miejsc · 4 mecze",
      image: "estadio-akron.webp",
      x: 37.29,
      y: 79.74,
      color: "#4ade80",
    },
    {
      city: "Mexico City",
      stadium: "Estadio Azteca",
      details: "72 766 miejsc · 5 meczów · otwarcie",
      image: "estadio-azteca.webp",
      x: 45.3,
      y: 82.87,
      color: "#4ade80",
    },
  ];

  function createStadiumMapVisual(viewport) {
    const visual = document.createElement("div");
    visual.dataset.stadiumMapVisual = "true";
    visual.className = "stadium-map-image-wrap";

    const image = document.createElement("img");
    image.src = "assets/stadium-map.jpg";
    image.alt =
      "Mapa Kanady, Stanów Zjednoczonych i Meksyku z miastami-gospodarzami Mistrzostw Świata 2026";
    image.className = "stadium-map-image";
    image.width = 1448;
    image.height = 1086;
    image.decoding = "async";

    const tooltip = document.createElement("div");
    tooltip.dataset.stadiumMapTooltip = "true";
    tooltip.className = "stadium-map-tooltip";
    tooltip.setAttribute("role", "status");
    tooltip.hidden = true;

    const tooltipImage = document.createElement("img");
    tooltipImage.className = "stadium-map-tooltip-image";
    tooltipImage.alt = "";
    tooltipImage.width = 112;
    tooltipImage.height = 76;
    tooltipImage.decoding = "async";

    const tooltipContent = document.createElement("span");
    tooltipContent.className = "stadium-map-tooltip-content";

    const tooltipTitle = document.createElement("strong");
    tooltipTitle.className = "stadium-map-tooltip-title";

    const tooltipDetails = document.createElement("span");
    tooltipDetails.className = "stadium-map-tooltip-details";
    tooltipContent.append(tooltipTitle, tooltipDetails);
    tooltip.append(tooltipImage, tooltipContent);

    const clearSelection = () => {
      visual
        .querySelectorAll(".stadium-map-marker.is-active")
        .forEach((marker) => marker.classList.remove("is-active"));
      tooltip.hidden = true;
    };

    const showStadium = (marker, centerMarker = false) => {
      const stadium = stadiumMapInfo[Number(marker.dataset.stadiumIndex)];
      if (!stadium) return;

      visual
        .querySelectorAll(".stadium-map-marker.is-active")
        .forEach((element) => element.classList.remove("is-active"));
      marker.classList.add("is-active");

      tooltipImage.src = `assets/stadiums/${stadium.image}`;
      tooltipTitle.textContent = stadium.stadium;
      tooltipDetails.textContent = `${stadium.city} · ${stadium.details}`;
      tooltip.style.setProperty("--tooltip-x", `${stadium.x}%`);
      tooltip.style.setProperty("--tooltip-y", `${stadium.y}%`);
      tooltip.hidden = false;

      if (centerMarker && window.matchMedia("(max-width: 639px)").matches) {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        viewport.scrollTo({
          left: marker.offsetLeft - viewport.clientWidth / 2,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
    };

    stadiumMapInfo.forEach((stadium, index) => {
      const marker = document.createElement("button");
      marker.type = "button";
      marker.className = "stadium-map-marker";
      marker.dataset.stadiumIndex = String(index);
      marker.style.setProperty("--marker-x", `${stadium.x}%`);
      marker.style.setProperty("--marker-y", `${stadium.y}%`);
      marker.style.setProperty("--marker-color", stadium.color);
      marker.setAttribute(
        "aria-label",
        `Pokaż informacje: ${stadium.city}, ${stadium.stadium}, ${stadium.details}`,
      );

      marker.addEventListener("mouseenter", () => showStadium(marker));
      marker.addEventListener("focus", () => showStadium(marker, true));
      marker.addEventListener("click", () => showStadium(marker, true));
      visual.append(marker);
    });

    visual.addEventListener("mouseleave", () => {
      if (window.matchMedia("(hover: hover)").matches) clearSelection();
    });
    visual.addEventListener("pointerdown", (event) => {
      if (
        event.target instanceof Element &&
        !event.target.closest(".stadium-map-marker")
      ) {
        clearSelection();
      }
    });

    visual.prepend(image);
    visual.append(tooltip);

    const preloadPreviews = () => {
      stadiumMapInfo.forEach((stadium) => {
        const preview = new Image();
        preview.src = `assets/stadiums/${stadium.image}`;
      });
    };
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preloadPreviews, { timeout: 2500 });
    } else {
      window.setTimeout(preloadPreviews, 600);
    }

    return visual;
  }

  function enhanceStadiumMap() {
    const heading = [...document.querySelectorAll("h3")].find((element) =>
      element.textContent.includes("MAPA STADIONÓW MŚ 2026"),
    );
    const viewport = heading?.nextElementSibling;
    const legacyMap = viewport?.querySelector('svg[viewBox="0 0 1000 800"]');

    if (!viewport || !legacyMap) return;

    const mapDescription = [...document.querySelectorAll("p")].find((element) =>
      element.textContent.includes("Na mapie najedź na pinezkę."),
    );
    if (mapDescription) {
      mapDescription.textContent = mapDescription.textContent.replace(
        "Na mapie najedź na pinezkę.",
        "Na mapie kliknij lub dotknij pinezki.",
      );
    }

    viewport.classList.add("stadium-map-viewport");
    legacyMap.classList.add("stadium-map-legacy");
    legacyMap.setAttribute("aria-hidden", "true");

    const desktopHelp = [...heading.parentElement.querySelectorAll("span")].find(
      (element) =>
        element.textContent.includes("najedź na pinezkę po szczegóły"),
    );
    if (desktopHelp) {
      desktopHelp.classList.add("stadium-map-desktop-help");
      desktopHelp.textContent = "najedź lub kliknij punkt po szczegóły";
    }

    if (!viewport.previousElementSibling?.matches("[data-stadium-map-hint]")) {
      const hint = document.createElement("p");
      hint.dataset.stadiumMapHint = "true";
      hint.className = "stadium-map-mobile-hint";
      hint.textContent =
        "Przesuń mapę na boki i dotknij punktu, aby zobaczyć stadion.";
      viewport.before(hint);
    }

    if (!viewport.querySelector("[data-stadium-map-visual]")) {
      viewport.append(createStadiumMapVisual(viewport));
    }
  }

  function createContactLink(className) {
    const link = document.createElement("a");
    link.href = "mailto:emistrzostwaswiata2026@gmail.com";
    link.className = className;
    link.textContent = "emistrzostwaswiata2026@gmail.com";
    return link;
  }

  const playerPositionLabels = {
    GK: "Bramkarz",
    DF: "Obrońca",
    MF: "Pomocnik",
    FW: "Napastnik",
  };

  const franceSquadGroups = [
    ["GK", "Bramkarze"],
    ["DF", "Obrońcy"],
    ["MF", "Pomocnicy"],
    ["FW", "Napastnicy"],
  ];

  function calculatePlayerAge(birthDate, today = new Date()) {
    const [day, month, year] = birthDate.split("/").map(Number);
    let age = today.getFullYear() - year;
    const birthdayThisYear = new Date(today.getFullYear(), month - 1, day);
    if (today < birthdayThisYear) age -= 1;
    return age;
  }

  function formatPlayerAge(age) {
    if (age === 1) return "1 rok";
    const lastTwo = age % 100;
    const last = age % 10;
    return `${age} ${last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14) ? "lata" : "lat"}`;
  }

  function playerInitials(name) {
    return name
      .split(/[\s-]+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function createPlayerPortrait(player, className) {
    const portrait = document.createElement("span");
    portrait.className = className;

    const fallback = document.createElement("span");
    fallback.className = "player-portrait-fallback";
    fallback.textContent = playerInitials(player.name);
    fallback.setAttribute("aria-hidden", "true");
    portrait.append(fallback);

    if (player.image) {
      const image = document.createElement("img");
      image.src = player.image;
      image.alt = `Zdjęcie: ${player.name}`;
      image.loading = "lazy";
      image.decoding = "async";
      image.width = 72;
      image.height = 72;
      image.addEventListener("load", () => {
        portrait.classList.add("has-player-image");
      });
      image.addEventListener("error", () => image.remove());
      portrait.prepend(image);
    }

    return portrait;
  }

  function createFrancePlayerCard(player) {
    const link = document.createElement("a");
    link.href = `player.html?id=${encodeURIComponent(player.slug)}`;
    link.className = "france-player-card";
    link.dataset.playerSlug = player.slug;
    link.setAttribute(
      "aria-label",
      `${player.name}, ${playerPositionLabels[player.position]}, ${formatPlayerAge(calculatePlayerAge(player.birthDate))}, profil zawodnika`,
    );

    const number = document.createElement("span");
    number.className = "france-player-number";
    number.textContent = player.number;

    const info = document.createElement("span");
    info.className = "france-player-info";

    const name = document.createElement("strong");
    name.className = "france-player-name";
    name.textContent = player.name;

    const club = document.createElement("span");
    club.className = "france-player-club";
    club.textContent = player.club;
    info.append(name, club);

    const metrics = document.createElement("span");
    metrics.className = "france-player-metrics";

    const age = document.createElement("strong");
    age.className = "france-player-age";
    age.textContent = formatPlayerAge(calculatePlayerAge(player.birthDate));

    const height = document.createElement("span");
    height.className = "france-player-height";
    height.textContent = `${player.heightCm} cm`;
    metrics.append(age, height);

    const arrow = document.createElement("span");
    arrow.className = "france-player-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "›";

    link.append(
      createPlayerPortrait(player, "france-player-portrait"),
      number,
      info,
      metrics,
      arrow,
    );
    return link;
  }

  function enhanceFranceSquad() {
    const france = window.WC2026_PLAYER_PROFILES?.FRA;
    if (!france?.players?.length) return;

    const teamHeading = [...document.querySelectorAll("h2")].find(
      (element) => element.textContent.trim() === "Francja",
    );
    const squadHeading = [...document.querySelectorAll("h3")].find((element) =>
      element.textContent.includes("PEŁNA KADRA"),
    );
    if (!teamHeading || !squadHeading) return;

    const panel = squadHeading.parentElement?.parentElement;
    if (!panel || panel.querySelector("[data-france-squad]")) return;

    const originalGrid = panel.querySelector(".grid.grid-cols-1");
    if (!originalGrid) return;

    const squad = document.createElement("div");
    squad.className = "france-squad-grid";
    squad.dataset.franceSquad = "true";

    franceSquadGroups.forEach(([position, label]) => {
      const group = document.createElement("section");
      group.className = "france-squad-group";

      const heading = document.createElement("h4");
      heading.className = "france-squad-group-title";
      heading.textContent = label;

      const players = document.createElement("div");
      players.className = "france-squad-players";
      france.players
        .filter((player) => player.position === position)
        .forEach((player) => players.append(createFrancePlayerCard(player)));

      group.append(heading, players);
      squad.append(group);
    });

    originalGrid.replaceWith(squad);
  }

  function createAdVisual() {
    const visual = document.createElement("div");
    visual.className = "ad-slot-visual";
    visual.setAttribute("aria-hidden", "true");
    visual.innerHTML = `
      <svg class="ad-slot-scene" viewBox="0 0 360 176" role="presentation">
        <defs>
          <linearGradient id="adGoalGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#fbbf24" />
            <stop offset="1" stop-color="#34d399" />
          </linearGradient>
          <radialGradient id="adBallGlow">
            <stop offset="0" stop-color="#fef3c7" stop-opacity=".7" />
            <stop offset="1" stop-color="#fbbf24" stop-opacity="0" />
          </radialGradient>
        </defs>

        <path class="ad-slot-flight-path" d="M34 136 C94 34 184 25 278 100" />
        <path class="ad-slot-field-line" d="M16 151 H344" />
        <path class="ad-slot-penalty-area" d="M188 151 207 124 H344" />
        <ellipse class="ad-slot-field-mark" cx="278" cy="151" rx="70" ry="12" />

        <g class="ad-slot-goal">
          <rect class="ad-slot-goal-shadow" x="218" y="54" width="120" height="96" rx="3" />
          <g class="ad-slot-goal-net">
            <path d="M238 56 V148 M258 56 V148 M278 56 V148 M298 56 V148 M318 56 V148" />
            <path d="M220 73 H336 M220 92 H336 M220 111 H336 M220 130 H336" />
          </g>
          <path class="ad-slot-goal-frame" d="M218 149 V52 H338 V149 M218 52 H338" />
          <path class="ad-slot-goal-base" d="M207 151 H346" />
          <circle class="ad-slot-goal-impact" cx="278" cy="100" r="25" />
        </g>

        <g class="ad-slot-brand-board">
          <rect x="224" y="14" width="108" height="28" rx="7" />
          <text x="278" y="26">MIEJSCE DLA</text>
          <text x="278" y="36">PARTNERA</text>
        </g>

        <circle class="ad-slot-ball-glow" cx="0" cy="0" r="28" />
        <g class="ad-slot-ball">
          <circle cx="0" cy="0" r="13" />
          <path d="m0-6 5 4-2 6h-6l-2-6 5-4Zm-9 5 4 5-3 5m17-10-4 5 3 5M-3 4l-3 7M3 4l3 7" />
        </g>

        <circle class="ad-slot-spark ad-slot-spark-one" cx="112" cy="55" r="2.5" />
        <circle class="ad-slot-spark ad-slot-spark-two" cx="174" cy="34" r="2" />
        <circle class="ad-slot-spark ad-slot-spark-three" cx="207" cy="58" r="1.8" />
      </svg>
      <span class="ad-slot-visual-caption">Twoja marka w centrum emocji</span>
    `;
    return visual;
  }

  function createMainAdSlot() {
    const slot = document.createElement("section");
    slot.dataset.adSlot = "main";
    slot.className = "ad-slot ad-slot-main";
    slot.setAttribute("aria-label", "Reklama i współpraca");

    const badge = document.createElement("p");
    badge.className = "ad-slot-kicker";
    badge.textContent = "ZOSTAŃ PARTNEREM SERWISU";

    const title = document.createElement("h2");
    title.className = "ad-slot-title";
    title.textContent = "Mistrzostwa Świata 2026";

    const contact = document.createElement("p");
    contact.className = "ad-slot-contact";
    contact.append("Napisz: ");
    contact.append(createContactLink("ad-slot-email"));

    const content = document.createElement("div");
    content.className = "ad-slot-content";
    content.append(badge, title, contact);

    slot.append(content, createAdVisual());
    return slot;
  }

  function createSidebarAdSlot() {
    const slot = document.createElement("aside");
    slot.dataset.adSlot = "sidebar";
    slot.className = "ad-slot ad-slot-sidebar";
    slot.setAttribute("aria-label", "Miejsce na reklamę");

    const badge = document.createElement("p");
    badge.className = "ad-slot-kicker";
    badge.textContent = "MIEJSCE NA REKLAMĘ";

    const size = document.createElement("p");
    size.className = "ad-slot-size";
    size.textContent = "300 × 250 px";

    const description = document.createElement("p");
    description.className = "ad-slot-description";
    description.textContent = "Promuj swoją firmę przy MŚ 2026.";

    const contact = document.createElement("p");
    contact.className = "ad-slot-contact";
    contact.append("Kontakt:");

    const email = createContactLink("ad-slot-email");
    slot.append(badge, size, description, contact, email);
    return slot;
  }

  function addAdSlots() {
    if (!document.querySelector('[data-ad-slot="main"]')) {
      const countdown = [...document.querySelectorAll(".mb-6.rounded-2xl")].find(
        (element) =>
          element.textContent.includes("Do meczu otwarcia") ||
          element.textContent.includes("Do wielkiego finału") ||
          element.textContent.includes("Mundial zakończony"),
      );

      if (countdown?.parentElement) {
        countdown.insertAdjacentElement("afterend", createMainAdSlot());
      }
    }

    if (!document.querySelector('[data-ad-slot="sidebar"]')) {
      document.body.append(createSidebarAdSlot());
    }
  }

  function secureExternalLinks() {
    document
      .querySelectorAll('a[target="_blank"]')
      .forEach((link) => link.setAttribute("rel", "noopener noreferrer"));
  }

  function applyEnhancements() {
    labelControls();
    labelFavoriteButtons();
    addDataSource();
    replaceHeaderTrophy();
    enhanceStadiumMap();
    enhanceFranceSquad();
    addAdSlots();
    secureExternalLinks();
  }

  let scheduled = false;
  const scheduleEnhancements = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyEnhancements();
    });
  };

  document.addEventListener("DOMContentLoaded", scheduleEnhancements);
  new MutationObserver(scheduleEnhancements).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
