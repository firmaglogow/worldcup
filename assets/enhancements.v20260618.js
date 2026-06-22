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
      "Terminarz, oficjalne kadry i pojemności stadionów: FIFA. Aktualizacja: 12 czerwca 2026.";
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

  function activateMatchesTab() {
    const matchesButton = [...document.querySelectorAll("button")].find(
      (button) => button.textContent.trim() === "Mecze",
    );
    if (!matchesButton) return;

    matchesButton.click();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  function makeHeaderTrophyInteractive() {
    const mark = document.querySelector(".site-trophy-mark");
    if (!mark || mark.dataset.homeNavigation === "true") return;

    mark.dataset.homeNavigation = "true";
    mark.setAttribute("role", "button");
    mark.setAttribute("tabindex", "0");
    mark.setAttribute("aria-label", "Przejdź do strony głównej i zakładki Mecze");
    mark.setAttribute("title", "Strona główna - Mecze");

    mark.addEventListener("click", activateMatchesTab);
    mark.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activateMatchesTab();
    });
  }

  const stadiumMapInfo = [
    {
      city: "Vancouver",
      stadium: "BC Place",
      details: "54 000 miejsc · 8 meczów",
      image: "bc-place.webp",
      x: 17.96,
      y: 17.96,
      color: "#fb5b4b",
    },
    {
      city: "Seattle",
      stadium: "Lumen Field",
      details: "69 000 miejsc · 5 meczów",
      image: "lumen-field.webp",
      x: 18.85,
      y: 25.05,
      color: "#3b82f6",
    },
    {
      city: "San Francisco",
      stadium: "Levi's Stadium",
      details: "71 000 miejsc · 6 meczów",
      image: "levis-stadium.webp",
      x: 15.95,
      y: 43.19,
      color: "#3b82f6",
    },
    {
      city: "Los Angeles",
      stadium: "SoFi Stadium",
      details: "70 000 miejsc · 8 meczów",
      image: "sofi-stadium.webp",
      x: 17.96,
      y: 49.54,
      color: "#3b82f6",
    },
    {
      city: "Kansas City",
      stadium: "Arrowhead Stadium",
      details: "73 000 miejsc · 6 meczów",
      image: "arrowhead-stadium.webp",
      x: 53.25,
      y: 43.74,
      color: "#3b82f6",
    },
    {
      city: "Dallas",
      stadium: "AT&T Stadium",
      details: "94 000 miejsc · Arlington · 9 meczów",
      image: "att-stadium.webp",
      x: 50.28,
      y: 53.96,
      color: "#3b82f6",
    },
    {
      city: "Houston",
      stadium: "NRG Stadium",
      details: "72 000 miejsc · 7 meczów",
      image: "nrg-stadium.webp",
      x: 51.38,
      y: 61.6,
      color: "#3b82f6",
    },
    {
      city: "Atlanta",
      stadium: "Mercedes-Benz Stadium",
      details: "75 000 miejsc · 8 meczów",
      image: "mercedes-benz-stadium.webp",
      x: 67.54,
      y: 50.55,
      color: "#3b82f6",
    },
    {
      city: "Miami",
      stadium: "Hard Rock Stadium",
      details: "65 000 miejsc · 7 meczów",
      image: "hard-rock-stadium.webp",
      x: 73.76,
      y: 61.05,
      color: "#3b82f6",
    },
    {
      city: "Boston",
      stadium: "Gillette Stadium",
      details: "65 000 miejsc · 7 meczów",
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
      details: "69 000 miejsc · 6 meczów",
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
      details: "53 500 miejsc · 4 mecze",
      image: "estadio-bbva.webp",
      x: 44.54,
      y: 73.3,
      color: "#4ade80",
    },
    {
      city: "Guadalajara",
      stadium: "Estadio Akron",
      details: "48 000 miejsc · 4 mecze",
      image: "estadio-akron.webp",
      x: 37.29,
      y: 79.74,
      color: "#4ade80",
    },
    {
      city: "Mexico City",
      stadium: "Estadio Azteca",
      details: "83 000 miejsc · 5 meczów · otwarcie",
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

  const playerSquadGroups = [
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

  function playerInitials(player) {
    const source = player.name.includes(" ") ? player.name : player.firstNames;
    return source
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
    fallback.textContent = playerInitials(player);
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

  function createPlayerCard(player) {
    const link = document.createElement("a");
    link.href = `player.html?team=${encodeURIComponent(player.teamCode)}&id=${encodeURIComponent(player.slug)}`;
    link.className = "player-card";
    link.dataset.playerProfileLink = "true";
    link.dataset.playerTeam = player.teamCode;
    link.dataset.playerSlug = player.slug;
    link.setAttribute(
      "aria-label",
      `${player.name}, ${playerPositionLabels[player.position]}, ${formatPlayerAge(calculatePlayerAge(player.birthDate))}, profil zawodnika`,
    );

    const number = document.createElement("span");
    number.className = "player-card-number";
    number.textContent = player.number;

    const info = document.createElement("span");
    info.className = "player-card-info";

    const name = document.createElement("strong");
    name.className = "player-card-name";
    name.textContent = player.name;

    const club = document.createElement("span");
    club.className = "player-card-club";
    club.textContent = player.club;
    info.append(name, club);

    const metrics = document.createElement("span");
    metrics.className = "player-card-metrics";

    const age = document.createElement("strong");
    age.className = "player-card-age";
    age.textContent = formatPlayerAge(calculatePlayerAge(player.birthDate));

    const height = document.createElement("span");
    height.className = "player-card-height";
    height.textContent = `${player.heightCm} cm`;
    metrics.append(age, height);

    const arrow = document.createElement("span");
    arrow.className = "player-card-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "›";

    link.append(
      createPlayerPortrait(player, "player-card-portrait"),
      number,
      info,
      metrics,
      arrow,
    );
    return link;
  }

  function enhancePlayerSquad() {
    const profiles = Object.values(window.WC2026_PLAYER_PROFILES || {});
    if (!profiles.length) return;

    const teamHeading = [...document.querySelectorAll("h2")].find((element) =>
      profiles.some((team) => team.team === element.textContent.trim()),
    );
    const squadHeading = [...document.querySelectorAll("h3")].find((element) =>
      element.textContent.includes("PEŁNA KADRA"),
    );
    if (!teamHeading || !squadHeading) return;

    const team = profiles.find(
      (profile) => profile.team === teamHeading.textContent.trim(),
    );
    if (!team?.players?.length) return;

    const panel = squadHeading.parentElement?.parentElement;
    if (!panel || panel.querySelector("[data-player-squad]")) return;

    const originalGrid = panel.querySelector(".grid.grid-cols-1");
    if (!originalGrid) return;

    const squad = document.createElement("div");
    squad.className = "player-squad-grid";
    squad.dataset.playerSquad = team.teamCode;

    playerSquadGroups.forEach(([position, label]) => {
      const group = document.createElement("section");
      group.className = "player-squad-group";

      const heading = document.createElement("h4");
      heading.className = "player-squad-group-title";
      heading.textContent = label;

      const players = document.createElement("div");
      players.className = "player-squad-players";
      team.players
        .filter((player) => player.position === position)
        .forEach((player) => players.append(createPlayerCard(player)));

      group.append(heading, players);
      squad.append(group);
    });

    originalGrid.replaceWith(squad);
  }

  function enhanceTeamBackButton() {
    const button = [...document.querySelectorAll("button")].find((element) =>
      element.textContent.includes("Powrót do listy"),
    );
    if (!button) return;

    button.classList.add("team-list-back-button");
    if (button.textContent.trim() !== "← Wróć do wszystkich reprezentacji") {
      button.textContent = "← Wróć do wszystkich reprezentacji";
    }
    button.setAttribute("aria-label", "Wróć do listy wszystkich reprezentacji");
  }

  let dreamTeamProfilesByName;

  function dreamTeamProfileIndex() {
    if (dreamTeamProfilesByName) return dreamTeamProfilesByName;

    dreamTeamProfilesByName = new Map();
    Object.values(window.WC2026_PLAYER_PROFILES || {}).forEach((team) => {
      (team.players || []).forEach((player) => {
        const key = normalizeScorerText(player.name);
        const profiles = dreamTeamProfilesByName.get(key) || [];
        profiles.push({ player, team });
        dreamTeamProfilesByName.set(key, profiles);
      });
    });
    return dreamTeamProfilesByName;
  }

  function enhanceDreamTeamPhotos() {
    const heading = [...document.querySelectorAll("p")].find((element) =>
      element.textContent.includes("Twój Dream Team turnieju"),
    );
    const panel = heading?.closest(".space-y-4");
    if (!panel) return;

    const positionLabels = new Set([
      "Bramkarz",
      "Obrońcy",
      "Pomocnicy",
      "Napastnicy",
    ]);
    const profiles = dreamTeamProfileIndex();

    panel
      .querySelectorAll("button.flex.flex-col.items-center.group")
      .forEach((button) => {
        const parts = button.querySelectorAll(":scope > div");
        const portrait = parts[0];
        const label = parts[1];
        const playerName = label?.textContent.trim();
        if (
          !portrait ||
          !playerName ||
          positionLabels.has(playerName) ||
          portrait.textContent.trim() === "+"
        ) {
          return;
        }

        const flag = portrait.textContent.trim();
        const candidates =
          profiles.get(normalizeScorerText(playerName)) || [];
        const profile =
          candidates.find(
            ({ player, team }) => player.image && team.flag === flag,
          ) || candidates.find(({ player }) => player.image);

        if (!profile?.player.image) return;
        if (
          button.dataset.dreamTeamPhoto === playerName &&
          portrait.querySelector("img")
        ) {
          return;
        }

        portrait.querySelector("img")?.remove();
        button.dataset.dreamTeamPhoto = playerName;
        portrait.classList.add("dream-team-player-photo");

        const image = document.createElement("img");
        image.src = profile.player.image;
        image.alt = `Zdjęcie: ${playerName}`;
        image.width = 64;
        image.height = 64;
        image.decoding = "async";
        image.addEventListener("error", () => {
          image.remove();
          portrait.classList.remove("dream-team-player-photo");
        });
        portrait.append(image);
      });
  }

  function enhancePrimaryNavigationIcons() {
    if (document.getElementById("site-modern-nav-icons")) return;

    const style = document.createElement("style");
    style.id = "site-modern-nav-icons";
    style.textContent = `
      button[data-nav-order] svg {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: content-box;
        padding: 0.4rem;
        border-radius: 9999px;
        background:
          radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.26), transparent 42%),
          linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(7, 17, 31, 0.9));
        border: 1px solid rgba(148, 163, 184, 0.2);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.16),
          inset 0 -10px 18px rgba(56, 189, 248, 0.08),
          0 10px 22px rgba(2, 6, 23, 0.36);
        filter: drop-shadow(0 2px 2px rgba(2, 6, 23, 0.34));
        transition:
          transform 0.18s ease,
          box-shadow 0.18s ease,
          border-color 0.18s ease,
          background 0.18s ease;
      }

      button[data-nav-order]:hover svg {
        transform: translateY(-1px) scale(1.05);
        border-color: rgba(251, 191, 36, 0.34);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -10px 18px rgba(251, 191, 36, 0.1),
          0 14px 28px rgba(2, 6, 23, 0.42);
      }

      button[data-nav-order][class*="text-amber-300"] svg,
      button[data-nav-order][class*="border-amber-400"] svg,
      button[data-nav-order][class*="bg-amber-400"] svg {
        background:
          radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.34), transparent 40%),
          linear-gradient(145deg, rgba(251, 191, 36, 0.98), rgba(180, 83, 9, 0.96));
        border-color: rgba(251, 191, 36, 0.45);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.28),
          inset 0 -12px 18px rgba(120, 53, 15, 0.14),
          0 14px 30px rgba(245, 158, 11, 0.28);
      }

      .hidden.sm\\:flex button[data-nav-order] {
        gap: 0.55rem;
      }

      .hidden.sm\\:flex button[data-nav-order] svg {
        width: 1.15rem;
        height: 1.15rem;
        padding: 0.34rem;
        margin-right: 0.05rem;
      }

      .sm\\:hidden button[data-nav-order] svg {
        width: 1.75rem;
        height: 1.75rem;
        padding: 0.45rem;
      }

      button[data-nav-order] span {
        text-shadow: 0 1px 0 rgba(2, 6, 23, 0.5);
      }
    `;
    document.head.appendChild(style);
  }

  function ensureCollapsibleMobileNavigationStyles() {
    if (document.getElementById("site-mobile-nav-collapse-styles")) return;

    const style = document.createElement("style");
    style.id = "site-mobile-nav-collapse-styles";
    style.textContent = `
      .site-mobile-nav-toggle {
        display: none;
      }

      @media (max-width: 639px) {
        .site-mobile-nav-toggle {
          align-items: center;
          background:
            radial-gradient(circle at top left, rgba(251, 191, 36, 0.12), transparent 48%),
            linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(6, 78, 59, 0.4));
          border: 1px solid rgba(52, 211, 153, 0.26);
          border-radius: 0.9rem;
          box-shadow: 0 10px 28px rgba(2, 6, 23, 0.22);
          color: #e2e8f0;
          display: flex;
          gap: 0.7rem;
          justify-content: space-between;
          margin: 0 auto 0.55rem;
          padding: 0.7rem 0.85rem;
          width: calc(100% - 1rem);
        }

        .site-mobile-nav-toggle-main {
          align-items: center;
          display: flex;
          gap: 0.65rem;
          min-width: 0;
        }

        .site-mobile-nav-toggle-lines {
          display: grid;
          gap: 0.18rem;
          width: 1.05rem;
        }

        .site-mobile-nav-toggle-lines span {
          background: #fbbf24;
          border-radius: 999px;
          display: block;
          height: 0.12rem;
        }

        .site-mobile-nav-toggle-text {
          display: grid;
          min-width: 0;
          text-align: left;
        }

        .site-mobile-nav-toggle-text small {
          color: #86efac;
          font-size: 0.58rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .site-mobile-nav-current {
          color: #f8fafc;
          font-size: 0.92rem;
          font-weight: 950;
          line-height: 1.1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .site-mobile-nav-chevron {
          color: #fbbf24;
          font-size: 1rem;
          font-weight: 900;
          transition: transform 0.18s ease;
        }

        .site-mobile-nav-toggle[aria-expanded="true"] .site-mobile-nav-chevron {
          transform: rotate(180deg);
        }

        .site-mobile-nav-panel {
          display: none !important;
        }

        .site-mobile-nav-toggle[aria-expanded="true"] + .site-mobile-nav-panel {
          background: rgba(2, 6, 23, 0.72);
          border: 1px solid rgba(51, 65, 85, 0.72);
          border-radius: 1rem;
          display: grid !important;
          gap: 0.45rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin: -0.2rem auto 0.65rem;
          max-height: min(62vh, 30rem);
          overflow-y: auto;
          padding: 0.5rem;
          width: calc(100% - 1rem);
        }

        .site-mobile-nav-panel button[data-nav-order] {
          border: 1px solid rgba(51, 65, 85, 0.58);
          min-height: 4.15rem;
          padding-left: 0.35rem;
          padding-right: 0.35rem;
        }

        .site-mobile-account-button {
          align-items: center;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border: 1px solid #fde68a;
          border-radius: 0.75rem;
          color: #07111f;
          display: grid;
          font-size: 0.82rem;
          font-weight: 950;
          gap: 0.55rem;
          grid-column: 1 / -1;
          grid-template-columns: auto 1fr;
          justify-content: start;
          min-height: 3.15rem;
          padding: 0.55rem 0.75rem;
          text-align: left;
        }

        .site-mobile-account-button.is-signed-in {
          background: linear-gradient(135deg, #34d399, #10b981);
          border-color: #a7f3d0;
        }

        .site-mobile-account-icon {
          align-items: center;
          background: rgba(7, 17, 31, 0.12);
          border-radius: 999px;
          display: inline-flex;
          font-size: 1rem;
          height: 2rem;
          justify-content: center;
          width: 2rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function accountLauncherText() {
    const launcher = document.querySelector("[data-account-launcher]");
    return launcher?.textContent.trim() || "Zaloguj się";
  }

  function ensureMobileAccountMenuButton(navigation) {
    const launcher = document.querySelector("[data-account-launcher]");
    if (!launcher) return;

    let button = navigation.querySelector("[data-mobile-account-button]");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "site-mobile-account-button";
      button.dataset.mobileAccountButton = "true";
      button.addEventListener("click", () => {
        launcher.click();
      });
      navigation.append(button);
    }

    const label = accountLauncherText();
    button.classList.toggle("is-signed-in", launcher.classList.contains("is-signed-in"));
    button.innerHTML = `
      <span class="site-mobile-account-icon" aria-hidden="true">${
        launcher.classList.contains("is-signed-in") ? "✓" : "♙"
      }</span>
      <span>${escapeHtml(label)}</span>
    `;
  }

  function updateMobileNavigationToggle(toggle, navigation) {
    const activeButton =
      [...navigation.querySelectorAll("button[data-nav-order]")].find((button) =>
        /text-amber-300|bg-amber-400|ring-amber|border-amber/.test(button.className),
      ) || navigation.querySelector("button[data-nav-order]");

    const label = activeButton?.textContent.trim() || "Mecze";
    const current = toggle.querySelector(".site-mobile-nav-current");
    if (current && current.textContent !== label) {
      current.textContent = label;
    }
  }

  function enhanceCollapsibleMobileNavigation() {
    ensureCollapsibleMobileNavigationStyles();

    const navigations = [...document.querySelectorAll(".sm\\:hidden")].filter(
      (navigation) =>
        navigation.querySelectorAll("button[data-nav-order]").length >= 8,
    );

    navigations.forEach((navigation) => {
      navigation.classList.add("site-mobile-nav-panel");
      ensureMobileAccountMenuButton(navigation);

      let toggle =
        navigation.previousElementSibling?.dataset?.mobileNavToggle === "true"
          ? navigation.previousElementSibling
          : null;

      if (!toggle) {
        toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "site-mobile-nav-toggle";
        toggle.dataset.mobileNavToggle = "true";
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = `
          <span class="site-mobile-nav-toggle-main">
            <span class="site-mobile-nav-toggle-lines" aria-hidden="true"><span></span><span></span><span></span></span>
            <span class="site-mobile-nav-toggle-text">
              <small>Menu strony</small>
              <span class="site-mobile-nav-current">Mecze</span>
            </span>
          </span>
          <span class="site-mobile-nav-chevron" aria-hidden="true">⌄</span>
        `;

        toggle.addEventListener("click", () => {
          const isOpen = toggle.getAttribute("aria-expanded") === "true";
          toggle.setAttribute("aria-expanded", String(!isOpen));
        });

        navigation.addEventListener("click", (event) => {
          if (event.target.closest("button[data-nav-order]")) {
            window.setTimeout(() => {
              toggle.setAttribute("aria-expanded", "false");
              updateMobileNavigationToggle(toggle, navigation);
              ensureMobileAccountMenuButton(navigation);
            }, 80);
          }
        });

        navigation.insertAdjacentElement("beforebegin", toggle);
      }

      updateMobileNavigationToggle(toggle, navigation);
      ensureMobileAccountMenuButton(navigation);
    });
  }

  const upcomingMatchColors = [
    "#fbbf24",
    "#38bdf8",
    "#34d399",
    "#a78bfa",
    "#fb7185",
    "#22d3ee",
  ];
  const polishMonths = [
    "STYCZNIA",
    "LUTEGO",
    "MARCA",
    "KWIETNIA",
    "MAJA",
    "CZERWCA",
    "LIPCA",
    "SIERPNIA",
    "WRZEŚNIA",
    "PAŹDZIERNIKA",
    "LISTOPADA",
    "GRUDNIA",
  ];
  const polishWeekdays = ["NDZ", "PN", "WT", "ŚR", "CZW", "PT", "SOB"];

  function matchKickoff(match) {
    return new Date(`${match.date}T${match.time}:00+02:00`);
  }

  function kickoffElapsed(match) {
    const kickoff = matchKickoff(match);
    const now = Date.now();
    if (now < kickoff.getTime() || now > kickoff.getTime() + 180 * 60 * 1000) {
      return null;
    }
    return Math.max(1, Math.floor((now - kickoff.getTime()) / 60000));
  }

  function scoreFromEvents(fixture) {
    const totals = { home: 0, away: 0 };
    const homeName = fixture?.teams?.home?.name || "";
    const awayName = fixture?.teams?.away?.name || "";
    (fixture?.events || []).forEach((event) => {
      if (event.type !== "Goal") return;
      if (event.team === homeName) totals.home += 1;
      if (event.team === awayName) totals.away += 1;
    });
    return totals;
  }

  function nearestMatches() {
    const matches = window.WC2026_MATCHES?.matches || [];
    const fixtures = new Map(
      (window.WC2026_MATCH_CENTER?.fixtures || []).map((fixture) => [
        Number(fixture.appMatchId),
        fixture,
      ]),
    );
    const now = Date.now();

    const candidates = matches
      .map((match) => ({
        match,
        fixture: fixtures.get(Number(match.id)),
        kickoff: matchKickoff(match),
      }))
      .filter(({ kickoff }) => kickoff.getTime() > now)
      .sort((first, second) => first.kickoff - second.kickoff);

    const nextDates = [...new Set(candidates.map(({ match }) => match.date))].slice(0, 2);
    return candidates.filter(({ match }) => nextDates.includes(match.date));
  }

  function nearestMatchSignature(matches) {
    return matches
      .map(
        ({ match, fixture }) =>
          `${match.id}:${fixture?.status?.short || "NS"}:${fixture?.goals?.home ?? "-"}:${fixture?.goals?.away ?? "-"}`,
      )
      .join("|");
  }

  function allMatchesForToday() {
    const today = warsawDateKey();
    const fixtures = new Map(
      (window.WC2026_MATCH_CENTER?.fixtures || []).map((fixture) => [
        Number(fixture.appMatchId),
        fixture,
      ]),
    );

    return (window.WC2026_MATCHES?.matches || [])
      .map((match) => ({
        match,
        fixture: fixtures.get(Number(match.id)),
        kickoff: matchKickoff(match),
      }))
      .filter(({ match }) => match.date === today)
      .sort((first, second) => first.kickoff - second.kickoff);
  }

  function upcomingDateRange(matches) {
    if (!matches.length) return "TERMINARZ MUNDIALU";

    const [firstYear, firstMonth, firstDay] = matches[0].match.date
      .split("-")
      .map(Number);
    const [lastYear, lastMonth, lastDay] = matches[
      matches.length - 1
    ].match.date
      .split("-")
      .map(Number);
    if (
      firstYear === lastYear &&
      firstMonth === lastMonth &&
      firstDay === lastDay
    ) {
      return `${firstDay} ${polishMonths[firstMonth - 1]}`;
    }
    if (firstYear === lastYear && firstMonth === lastMonth) {
      return `${firstDay}–${lastDay} ${polishMonths[firstMonth - 1]}`;
    }
    return `${firstDay} ${polishMonths[firstMonth - 1]} – ${lastDay} ${polishMonths[lastMonth - 1]}`;
  }

  function upcomingMatchStatus(fixture, match) {
    const status = fixture?.status?.short;
    const liveElapsed = kickoffElapsed(match);
    if (["FT", "AET", "PEN"].includes(status)) {
      const hasScore =
        Number.isInteger(fixture.goals?.home) &&
        Number.isInteger(fixture.goals?.away);
      return {
        main: hasScore
          ? `${fixture.goals.home}:${fixture.goals.away}`
          : "KONIEC",
        detail:
          status === "PEN"
            ? "PO KARNYCH"
            : status === "AET"
              ? "PO DOGRYWCE"
              : "KONIEC",
        live: false,
        finished: true,
      };
    }
    if (["1H", "HT", "2H", "ET", "BT", "P", "LIVE"].includes(status)) {
      const eventScore = scoreFromEvents(fixture);
      const hasScore =
        Number.isInteger(fixture.goals?.home) &&
        Number.isInteger(fixture.goals?.away);
      return {
        main: hasScore
          ? `${fixture.goals.home}:${fixture.goals.away}`
          : Number.isInteger(eventScore.home) && Number.isInteger(eventScore.away)
            ? `${eventScore.home}:${eventScore.away}`
            : "NA ŻYWO",
        detail: fixture.status?.elapsed
          ? `NA ŻYWO · ${fixture.status.elapsed}'`
          : liveElapsed
            ? `NA ŻYWO · ${liveElapsed}'`
            : "NA ŻYWO",
        live: true,
        finished: false,
      };
    }
    if (liveElapsed) {
      const eventScore = scoreFromEvents(fixture);
      const hasScore =
        Number.isInteger(fixture.goals?.home) &&
        Number.isInteger(fixture.goals?.away);
      return {
        main: hasScore
          ? `${fixture.goals.home}:${fixture.goals.away}`
          : Number.isInteger(eventScore.home) && Number.isInteger(eventScore.away)
            ? `${eventScore.home}:${eventScore.away}`
            : "NA ŻYWO",
        detail: `NA ŻYWO · ${liveElapsed}'`,
        live: true,
        finished: false,
      };
    }
    return {
      main: match.time,
      detail: "START",
      live: false,
      finished: false,
    };
  }

  function createUpcomingMatchCard(item, index) {
    const { match, fixture } = item;
    const [, month, day] = match.date.split("-").map(Number);
    const weekday = new Date(`${match.date}T12:00:00Z`).getUTCDay();
    const card = document.createElement("a");
    card.className = "upcoming-match-card";
    card.href = `match.html?id=${match.id}`;
    card.style.setProperty(
      "--upcoming-accent",
      upcomingMatchColors[index % upcomingMatchColors.length],
    );
    card.setAttribute(
      "aria-label",
      `${match.homeName} - ${match.awayName}, ${match.time}`,
    );

    const meta = document.createElement("div");
    meta.className = "upcoming-match-meta";

    const date = document.createElement("span");
    date.textContent = `${polishWeekdays[weekday]}, ${day} ${polishMonths[month - 1].slice(0, 3)}`;

    const phase = document.createElement("span");
    phase.className = "upcoming-match-phase";
    phase.textContent = match.group
      ? `GRUPA ${match.group}`
      : match.round || "FAZA PUCHAROWA";
    meta.append(date, phase);

    const matchup = document.createElement("div");
    matchup.className = "upcoming-match-matchup";

    const createTeam = (flagText, nameText) => {
      const team = document.createElement("div");
      team.className = "upcoming-match-team";

      const flag = document.createElement("span");
      flag.className = "upcoming-match-flag";
      flag.textContent = flagText;
      flag.setAttribute("aria-hidden", "true");

      const name = document.createElement("strong");
      name.textContent = nameText;
      team.append(flag, name);
      return team;
    };

    const status = upcomingMatchStatus(fixture, match);
    const center = document.createElement("div");
    center.className = `upcoming-match-time${status.live ? " is-live" : ""}${status.finished ? " is-finished" : ""}`;

    const mainStatus = document.createElement("strong");
    mainStatus.textContent = status.main;
    const detail = document.createElement("small");
    detail.textContent = status.detail;
    center.append(mainStatus, detail);

    matchup.append(
      createTeam(match.homeFlag, match.homeName),
      center,
      createTeam(match.awayFlag, match.awayName),
    );

    const venue = document.createElement("p");
    venue.className = "upcoming-match-venue";
    venue.textContent = `${match.stadium} · ${match.city}`;

    card.append(meta, matchup, venue);
    return card;
  }

  function createUpcomingMatchesPanel(matches) {
    const panel = document.createElement("section");
    panel.className = "upcoming-matches";
    panel.dataset.upcomingMatches = nearestMatchSignature(matches);
    panel.setAttribute("aria-label", "Najbliższe mecze mundialu");

    const header = document.createElement("header");
    header.className = "upcoming-matches-header";

    const titleGroup = document.createElement("div");
    const kicker = document.createElement("span");
    kicker.className = "upcoming-matches-kicker";
    kicker.textContent = "MUNDIAL 26'";

    const title = document.createElement("h2");
    title.textContent = "NAJBLIŻSZE MECZE";
    titleGroup.append(kicker, title);

    const dateRange = document.createElement("strong");
    dateRange.className = "upcoming-matches-range";
    dateRange.textContent = upcomingDateRange(matches);
    header.append(titleGroup, dateRange);

    const grid = document.createElement("div");
    grid.className = "upcoming-matches-grid";
    matches.forEach((match, index) =>
      grid.append(createUpcomingMatchCard(match, index)),
    );

    panel.append(header, grid);
    return panel;
  }

  function enhanceUpcomingMatches() {
    const countdown = [...document.querySelectorAll(".mb-6.rounded-2xl")].find(
      (element) =>
        element.textContent.includes("Do meczu otwarcia") ||
        element.textContent.includes("Do wielkiego finału") ||
        element.textContent.includes("Mundial zakończony"),
    );
    if (!countdown) return;

    const legacyHeading = [...countdown.querySelectorAll("div")].find(
      (element) => element.textContent.trim() === "⚽ DZIŚ GRAJĄ",
    );
    const legacyPanel = legacyHeading?.parentElement;
    if (legacyPanel) {
      legacyPanel.dataset.legacyTodayMatches = "true";
      legacyPanel.hidden = true;
    }

    if (!isMatchesTabActive()) {
      document
        .querySelectorAll("[data-upcoming-matches]")
        .forEach((panel) => panel.remove());
      return;
    }

    const matches = nearestMatches();
    if (!matches.length) return;

    const signature = nearestMatchSignature(matches);
    const currentPanel = countdown.querySelector("[data-upcoming-matches]");
    if (currentPanel?.dataset.upcomingMatches === signature) {
      return;
    }

    currentPanel?.remove();
    countdown.append(createUpcomingMatchesPanel(matches));
  }

  const matchBrowserFinishedStatuses = new Set(["FT", "AET", "PEN"]);
  const matchBrowserLiveStatuses = new Set([
    "1H",
    "HT",
    "2H",
    "ET",
    "BT",
    "P",
    "LIVE",
  ]);
  const matchBrowserModeLabels = {
    results: "Wyniki",
    day: "Dzisiaj",
    upcoming: "Nadchodzące",
    all: "Wszystkie",
  };
  let matchBrowserMode = "day";
  let matchBrowserDate = "";
  let matchBrowserLimit = 12;
  let matchBrowserInitialized = false;

  function warsawDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Warsaw",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(
      parts
        .filter(({ type }) => type !== "literal")
        .map(({ type, value }) => [type, value]),
    );
    return `${values.year}-${values.month}-${values.day}`;
  }

  function matchBrowserDates() {
    return [
      ...new Set(
        (window.WC2026_MATCHES?.matches || [])
          .map((match) => match.date)
          .filter(Boolean),
      ),
    ].sort();
  }

  function closestMatchDate() {
    const dates = matchBrowserDates();
    const today = warsawDateKey();
    return (
      dates.find((date) => date >= today) ||
      dates[dates.length - 1] ||
      today
    );
  }

  function formatMatchBrowserDate(date, options = {}) {
    const value = new Date(`${date}T12:00:00+02:00`);
    return new Intl.DateTimeFormat("pl-PL", {
      timeZone: "Europe/Warsaw",
      weekday: options.short ? undefined : "long",
      day: "numeric",
      month: options.short ? "short" : "long",
    }).format(value);
  }

  function setNativeDateFilter(value) {
    const select = document.querySelector('select[aria-label="Filtr dnia"]');
    if (!select || select.value === value) return;

    const setter = Object.getOwnPropertyDescriptor(
      HTMLSelectElement.prototype,
      "value",
    )?.set;
    if (setter) setter.call(select, value);
    else select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function matchBrowserFixtureMap() {
    const fixtures = new Map(
      (window.WC2026_MATCH_CENTER?.fixtures || [])
        .filter((fixture) => fixture.appMatchId)
        .map((fixture) => [Number(fixture.appMatchId), fixture]),
    );

    try {
      const saved = JSON.parse(localStorage.getItem("wc2026:v1") || "{}");
      Object.entries(saved.results || {}).forEach(([matchId, result]) => {
        const id = Number(matchId);
        if (
          fixtures.has(id) ||
          !Number.isInteger(result?.hg) ||
          !Number.isInteger(result?.ag)
        ) {
          return;
        }
        fixtures.set(id, {
          appMatchId: id,
          status: { short: "FT", long: "Match Finished" },
          goals: { home: result.hg, away: result.ag },
        });
      });
    } catch {
      // Static match-center data remains the source if local storage is blocked.
    }

    return fixtures;
  }

  function matchBrowserFilters() {
    const group =
      document.querySelector('select[aria-label="Filtr grupy"]')?.value ||
      "all";
    const team =
      document.querySelector('select[aria-label="Filtr drużyny"]')?.value ||
      "all";
    return { group, team };
  }

  function matchesBrowserFilters(match, filters) {
    const groupMatches =
      filters.group === "all" || match.group === filters.group;
    const teamMatches =
      filters.team === "all" ||
      match.homeCode === filters.team ||
      match.awayCode === filters.team;
    return groupMatches && teamMatches;
  }

  function matchBrowserItems(mode) {
    const fixtures = matchBrowserFixtureMap();
    const filters = matchBrowserFilters();
    const now = Date.now();
    const recentThreshold = now - 3 * 60 * 60 * 1000;

    const items = (window.WC2026_MATCHES?.matches || [])
      .filter((match) => matchesBrowserFilters(match, filters))
      .map((match) => ({
        match,
        fixture: fixtures.get(Number(match.id)),
        kickoff: matchKickoff(match),
      }));

    if (mode === "day") {
      return items
        .filter(({ match }) => match.date === matchBrowserDate)
        .sort((first, second) => first.kickoff - second.kickoff);
    }

    if (mode === "results") {
      return items
        .filter(({ fixture }) =>
          matchBrowserFinishedStatuses.has(fixture?.status?.short),
        )
        .sort((first, second) => second.kickoff - first.kickoff);
    }

    if (mode === "all") {
      return items.sort((first, second) => first.kickoff - second.kickoff);
    }

    return items
      .filter(({ fixture, kickoff }) => {
        const status = fixture?.status?.short;
        return (
          !matchBrowserFinishedStatuses.has(status) &&
          (matchBrowserLiveStatuses.has(status) ||
            kickoff.getTime() >= recentThreshold)
        );
      })
      .sort((first, second) => first.kickoff - second.kickoff);
  }

  function createMatchBrowserEmpty(mode) {
    const empty = document.createElement("div");
    empty.className = "match-browser-empty";
    empty.textContent =
      mode === "results"
        ? "Brak zakończonych meczów dla wybranych filtrów."
        : mode === "day"
          ? "Brak meczów dla wybranego dnia i filtrów."
        : "Brak nadchodzących meczów dla wybranych filtrów.";
    return empty;
  }

  function matchBrowserGroupRound(match) {
    if (match.phase !== "group") return null;

    const groupKey = match.group || match.round || "";
    if (!groupKey) return null;

    const groupMatches = (window.WC2026_MATCHES?.matches || [])
      .filter(
        (candidate) =>
          candidate.phase === "group" &&
          (candidate.group || candidate.round || "") === groupKey,
      )
      .slice()
      .sort((first, second) => matchKickoff(first) - matchKickoff(second));

    const index = groupMatches.findIndex(
      (candidate) => Number(candidate.id) === Number(match.id),
    );
    if (index < 0) return null;

    return Math.floor(index / 2) + 1;
  }

  function matchBrowserAllSections(items) {
    const roundBuckets = new Map();
    const otherBuckets = new Map();

    items.forEach((item) => {
      const roundNumber = matchBrowserGroupRound(item.match);
      if (roundNumber) {
        const key = `group-${roundNumber}`;
        const bucket = roundBuckets.get(key) || {
          kind: "group",
          order: roundNumber,
          label: `${roundNumber}. KOLEJKA`,
          items: [],
        };
        bucket.items.push(item);
        roundBuckets.set(key, bucket);
        return;
      }

      const label = item.match.round || item.match.phase || "Inne mecze";
      const key = `other-${label}`;
      const bucket = otherBuckets.get(key) || {
        kind: "other",
        order: item.kickoff.getTime(),
        label,
        items: [],
      };
      bucket.items.push(item);
      bucket.order = Math.min(bucket.order, item.kickoff.getTime());
      otherBuckets.set(key, bucket);
    });

    return [
      ...[1, 2, 3]
        .map((roundNumber) => roundBuckets.get(`group-${roundNumber}`))
        .filter(Boolean)
        .sort((first, second) => first.order - second.order),
      ...[...otherBuckets.values()].sort((first, second) => first.order - second.order),
    ];
  }

  function createMatchBrowserList(mode) {
    const panel = document.createElement("section");
    panel.className = "match-browser-list";
    panel.dataset.matchBrowserList = mode;
    panel.setAttribute(
      "aria-label",
      mode === "results"
        ? "Ostatnie wyniki"
        : mode === "day"
          ? "Mecze wybranego dnia"
          : "Nadchodzące mecze",
    );

    const allItems = matchBrowserItems(mode);
    const items = mode === "all" ? allItems : allItems.slice(0, matchBrowserLimit);
    const filters = matchBrowserFilters();
    panel.dataset.matchBrowserSignature = [
      mode,
      matchBrowserLimit,
      filters.group,
      filters.team,
      ...items.map(
        ({ match, fixture }) =>
          `${match.id}:${fixture?.status?.short || "NS"}:${fixture?.goals?.home ?? "-"}:${fixture?.goals?.away ?? "-"}`,
      ),
    ].join("|");
    if (!items.length) {
      panel.append(createMatchBrowserEmpty(mode));
      return panel;
    }

    const sections =
      mode === "all"
        ? matchBrowserAllSections(items)
        : [...new Set(items.map((item) => item.match.date))].map((date) => ({
            label: formatMatchBrowserDate(date).toUpperCase(),
            items: items.filter((item) => item.match.date === date),
          }));

    sections.forEach((sectionData) => {
      const section = document.createElement("section");
      section.className = "match-browser-date-section";

      const heading = document.createElement("h3");
      heading.textContent = sectionData.label;

      const grid = document.createElement("div");
      grid.className = "match-browser-grid";
      sectionData.items.forEach((item, index) => {
        const card = createUpcomingMatchCard(item, index);
        card.classList.add("match-browser-card");
        grid.append(card);
      });

      section.append(heading, grid);
      panel.append(section);
    });

    if (allItems.length > items.length) {
      const more = document.createElement("button");
      more.type = "button";
      more.className = "match-browser-more";
      more.textContent =
        mode === "results"
          ? "Pokaż starsze wyniki"
          : mode === "day"
            ? "Pokaż więcej meczów tego dnia"
            : "Pokaż kolejne mecze";
      more.addEventListener("click", () => {
        matchBrowserLimit += 12;
        renderMatchBrowser();
      });
      panel.append(more);
    }

    return panel;
  }

  function createMatchBrowser() {
    const browser = document.createElement("section");
    browser.className = "match-browser";
    browser.dataset.matchBrowser = "true";
    browser.setAttribute("aria-label", "Nawigacja terminarza i wyników");

    const header = document.createElement("div");
    header.className = "match-browser-header";

    const titleGroup = document.createElement("div");
    const kicker = document.createElement("span");
    kicker.className = "match-browser-kicker";
    kicker.textContent = "CENTRUM MECZÓW";
    const title = document.createElement("h2");
    title.textContent = "Terminarz i wyniki";
    titleGroup.append(kicker, title);

    const summary = document.createElement("p");
    summary.className = "match-browser-summary";
    summary.dataset.matchBrowserSummary = "true";
    header.append(titleGroup, summary);

    const tabs = document.createElement("div");
    tabs.className = "match-browser-tabs";
    tabs.setAttribute("role", "tablist");
    Object.entries(matchBrowserModeLabels).forEach(([mode, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.matchBrowserMode = mode;
      button.setAttribute("role", "tab");
      button.textContent = label;
      button.addEventListener("click", () => {
        matchBrowserMode = mode;
        matchBrowserLimit = 12;
        if (mode === "day") {
          matchBrowserDate = closestMatchDate();
          setNativeDateFilter(matchBrowserDate);
        } else if (mode === "all") {
          setNativeDateFilter("all");
        }
        renderMatchBrowser();
      });
      tabs.append(button);
    });

    const dateNavigation = document.createElement("div");
    dateNavigation.className = "match-browser-date-navigation";
    dateNavigation.dataset.matchBrowserDates = "true";

    browser.append(header, tabs, dateNavigation);
    return browser;
  }

  function updateMatchBrowserDates(browser) {
    const navigation = browser.querySelector("[data-match-browser-dates]");
    if (!navigation) return;

    if (matchBrowserMode !== "day") {
      navigation.hidden = true;
      if (navigation.childElementCount) navigation.replaceChildren();
      navigation.dataset.matchBrowserDateSignature = matchBrowserMode;
      return;
    }

    navigation.hidden = false;
    const dates = matchBrowserDates();
    const selectedIndex = Math.max(0, dates.indexOf(matchBrowserDate));
    const signature = `${matchBrowserMode}:${matchBrowserDate}:${dates.length}`;
    if (navigation.dataset.matchBrowserDateSignature === signature) return;
    navigation.dataset.matchBrowserDateSignature = signature;

    const createArrow = (direction, label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "match-browser-date-arrow";
      button.textContent = direction < 0 ? "‹" : "›";
      button.setAttribute("aria-label", label);
      const targetIndex = selectedIndex + direction;
      button.disabled = targetIndex < 0 || targetIndex >= dates.length;
      button.addEventListener("click", () => {
        matchBrowserDate = dates[targetIndex];
        setNativeDateFilter(matchBrowserDate);
        renderMatchBrowser();
      });
      return button;
    };

    const dateList = document.createElement("div");
    dateList.className = "match-browser-date-list";
    dates
      .slice(Math.max(0, selectedIndex - 1), selectedIndex + 2)
      .forEach((date) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "match-browser-date-button";
        button.dataset.active = String(date === matchBrowserDate);
        button.setAttribute(
          "aria-pressed",
          String(date === matchBrowserDate),
        );

        const label = document.createElement("span");
        label.textContent =
          date === warsawDateKey() ? "DZISIAJ" : formatMatchBrowserDate(date, { short: true });
        const detail = document.createElement("strong");
        detail.textContent = formatMatchBrowserDate(date);
        button.append(label, detail);
        button.addEventListener("click", () => {
          matchBrowserDate = date;
          setNativeDateFilter(matchBrowserDate);
          renderMatchBrowser();
        });
        dateList.append(button);
      });

    navigation.replaceChildren(
      createArrow(-1, "Poprzedni dzień meczowy"),
      dateList,
      createArrow(1, "Następny dzień meczowy"),
    );
  }

  function markNativeMatchGroups(container, filterPanel) {
    [...container.children].forEach((child) => {
      if (
        child === filterPanel ||
        child.matches("[data-match-browser]") ||
        child.matches("[data-match-browser-list]")
      ) {
        return;
      }
      if (child.querySelector(".rounded-2xl.p-3")) {
        child.dataset.nativeMatchGroup = "true";
      }
    });
  }

  function enhanceMatchBrowserFilterToggle(filterPanel) {
    if (!filterPanel || filterPanel.dataset.matchBrowserFilterToggle === "true") {
      return;
    }

    filterPanel.dataset.matchBrowserFilterToggle = "true";
    filterPanel.classList.add("match-browser-filter-collapsible");
    filterPanel.classList.add("is-filter-open");

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "match-browser-filter-toggle";
    toggle.dataset.matchBrowserFilterToggleButton = "true";
    toggle.setAttribute("aria-expanded", "true");
    toggle.innerHTML = `
      <span>Filtry terminarza</span>
      <strong>Ukryj</strong>
    `;
    toggle.addEventListener("click", () => {
      const isOpen = filterPanel.classList.toggle("is-filter-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.querySelector("strong").textContent = isOpen ? "Ukryj" : "Pokaż";
    });

    filterPanel.insertAdjacentElement("beforebegin", toggle);
  }

  function renderMatchBrowser() {
    const dateSelect = document.querySelector(
      'select[aria-label="Filtr dnia"]',
    );
    const filterPanel = dateSelect?.closest(".rounded-2xl");
    const container = filterPanel?.parentElement;
    if (!dateSelect || !filterPanel || !container || !isMatchesTabActive()) {
      return;
    }

    let browser = container.querySelector("[data-match-browser]");
    if (!browser) {
      browser = createMatchBrowser();
      container.insertBefore(browser, filterPanel);
    }

    filterPanel.dataset.matchBrowserFilter = "true";
    filterPanel.dataset.matchBrowserMode = matchBrowserMode;
    dateSelect.parentElement?.classList.add("match-browser-filter-grid");
    enhanceMatchBrowserFilterToggle(filterPanel);

    markNativeMatchGroups(container, filterPanel);
    container
      .querySelectorAll("[data-native-match-group]")
      .forEach((group) => {
        group.hidden = true;
      });

    browser.querySelectorAll("[data-match-browser-mode]").forEach((button) => {
      const active = button.dataset.matchBrowserMode === matchBrowserMode;
      button.dataset.active = String(active);
      button.setAttribute("aria-selected", String(active));
    });

    const summary = browser.querySelector("[data-match-browser-summary]");
    if (summary) {
      const summaries = {
        results: "Najnowsze zakończone spotkania",
        upcoming: "Najbliższe zaplanowane spotkania",
        all: "Pełny terminarz turnieju",
        day: `Mecze: ${formatMatchBrowserDate(matchBrowserDate)}`,
      };
      if (summary.textContent !== summaries[matchBrowserMode]) {
        summary.textContent = summaries[matchBrowserMode];
      }
    }

    updateMatchBrowserDates(browser);

    const currentList = container.querySelector("[data-match-browser-list]");
    if (["day", "results", "upcoming", "all"].includes(matchBrowserMode)) {
      const nextList = createMatchBrowserList(matchBrowserMode);
      if (
        currentList?.dataset.matchBrowserSignature !==
        nextList.dataset.matchBrowserSignature
      ) {
        currentList?.remove();
        filterPanel.insertAdjacentElement("afterend", nextList);
      }
    } else {
      currentList?.remove();
    }
  }

  function enhanceMatchBrowser() {
    if (!isMatchesTabActive()) return;
    labelControls();

    const dateSelect = document.querySelector(
      'select[aria-label="Filtr dnia"]',
    );
    if (!dateSelect) return;

    if (!matchBrowserInitialized) {
      matchBrowserInitialized = true;
      matchBrowserDate = closestMatchDate();
      setNativeDateFilter(matchBrowserDate);
    }

    if (dateSelect.dataset.matchBrowserListener !== "true") {
      dateSelect.dataset.matchBrowserListener = "true";
      dateSelect.addEventListener("change", () => {
        if (dateSelect.value === "all") {
          matchBrowserMode = "all";
        } else {
          matchBrowserMode = "day";
          matchBrowserDate = dateSelect.value;
        }
        matchBrowserLimit = 12;
        renderMatchBrowser();
      });
    }

    ["Filtr grupy", "Filtr drużyny"].forEach((label) => {
      const select = document.querySelector(`select[aria-label="${label}"]`);
      if (!select || select.dataset.matchBrowserListener === "true") return;
      select.dataset.matchBrowserListener = "true";
      select.addEventListener("change", renderMatchBrowser);
    });

    renderMatchBrowser();
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
          <rect class="ad-slot-goal-shadow" x="158" y="58" width="188" height="92" rx="3" />
          <g class="ad-slot-goal-net">
            <path d="M182 58 V148 M206 58 V148 M230 58 V148 M254 58 V148 M278 58 V148 M302 58 V148 M326 58 V148" />
            <path d="M160 76 H344 M160 94 H344 M160 112 H344 M160 130 H344" />
          </g>
          <path class="ad-slot-goal-frame" d="M158 149 V56 H346 V149 M158 56 H346" />
          <path class="ad-slot-goal-base" d="M148 151 H354" />
          <circle class="ad-slot-goal-impact" cx="278" cy="101" r="25" />
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

    const partnerLabel = document.createElement("span");
    partnerLabel.className = "ad-slot-partner-label";
    partnerLabel.textContent = "MIEJSCE DLA PARTNERA";

    const labelRow = document.createElement("div");
    labelRow.className = "ad-slot-label-row";
    labelRow.append(badge, partnerLabel);

    const title = document.createElement("h2");
    title.className = "ad-slot-title";
    title.textContent = "Mistrzostwa Świata 2026";

    const contact = document.createElement("p");
    contact.className = "ad-slot-contact";
    contact.append("Napisz: ");
    contact.append(createContactLink("ad-slot-email"));

    const content = document.createElement("div");
    content.className = "ad-slot-content";
    content.append(labelRow, title, contact);

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

  function isMatchesTabActive() {
    return [...document.querySelectorAll("button")].some(
      (button) =>
        button.textContent.trim() === "Mecze" &&
        (button.classList.contains("border-amber-400") ||
          button.classList.contains("bg-amber-400/15")),
    );
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

  function reorderNavigation() {
    const buttons = [...document.querySelectorAll("button")];
    const navigationOrder = new Map([
      ["Mecze", 1],
      ["Tabele grup", 2],
      ["Tabele", 2],
      ["Statystyki", 3],
      ["Staty", 3],
      ["Gwiazdy Mundialu", 4],
      ["Gwiazdy", 4],
      ["Grupa śmierci", 4],
      ["Śmierci", 4],
      ["Reprezentacje", 5],
      ["Drużyny", 5],
      ["Faza pucharowa", 6],
      ["Puchar", 6],
      ["Symulator", 7],
      ["Mój typ", 8],
      ["Dream Team", 9],
      ["Dream XI", 9],
      ["Stadiony", 10],
      ["Ciekawostki", 11],
      ["Ciekawe", 11],
      ["Historia MŚ", 12],
      ["Historia", 12],
    ]);

    const navigationGroups = new Map();
    buttons.forEach((button) => {
      const label = button.textContent.trim();
      const order = navigationOrder.get(label);
      if (!order || !button.parentElement) return;

      button.dataset.navOrder = String(order);
      const group = navigationGroups.get(button.parentElement) || [];
      group.push(button);
      navigationGroups.set(button.parentElement, group);
    });

    navigationGroups.forEach((navigationButtons) => {
      const navigation = navigationButtons[0].parentElement;
      if (
        navigationButtons.length >= 8 &&
        navigation.classList.contains("sm:flex")
      ) {
        navigation.classList.add("site-primary-nav-desktop");
      }

      const groupTables = navigationButtons.find((button) =>
        ["Tabele grup", "Tabele"].includes(button.textContent.trim()),
      );
      const statistics = navigationButtons.find((button) =>
        ["Statystyki", "Staty"].includes(button.textContent.trim()),
      );

      if (groupTables && statistics && groupTables.nextElementSibling !== statistics) {
        groupTables.insertAdjacentElement("afterend", statistics);
      }
    });
  }

  function replaceButtonText(button, label) {
    const textNodes = [...button.childNodes].filter(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
    );

    if (textNodes.length) {
      textNodes[textNodes.length - 1].textContent = label;
      return;
    }

    const labelNode = [...button.querySelectorAll("span, div")].find(
      (node) =>
        ["Grupa śmierci", "Śmierci", "Gwiazdy Mundialu", "Gwiazdy"].includes(
          node.textContent.trim(),
        ),
    );

    if (labelNode) {
      labelNode.textContent = label;
      return;
    }

    button.textContent = label;
  }

  function enhanceWorldStarsNavigation() {
    const buttons = [...document.querySelectorAll("button")].filter((button) =>
      ["Grupa śmierci", "Śmierci", "Gwiazdy Mundialu", "Gwiazdy"].includes(
        button.textContent.trim(),
      ),
    );

    buttons.forEach((button) => {
      replaceButtonText(button, "Gwiazdy");
      button.dataset.worldStarsNav = "true";
      button.setAttribute("aria-label", "Przejdź do sekcji Gwiazdy");
      button.setAttribute("title", "Gwiazdy");

      if (button.dataset.worldStarsBound === "true") return;
      button.dataset.worldStarsBound = "true";
      button.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          window.location.href =
            window.location.protocol === "file:"
              ? "gwiazdy-mundialu/index.html"
              : "/gwiazdy-mundialu/";
        },
        true,
      );
    });
  }

  function normalizeScorerText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function scorerNameDistance(left, right) {
    const a = normalizeScorerText(left).replace(/\s+/g, "");
    const b = normalizeScorerText(right).replace(/\s+/g, "");

    if (!a || !b) return Number.POSITIVE_INFINITY;
    if (a === b) return 0;

    const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      let diagonal = previous[0];
      previous[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const upper = previous[j];
        const substitution = diagonal + (a[i - 1] === b[j - 1] ? 0 : 1);
        const insertion = previous[j - 1] + 1;
        const deletion = upper + 1;
        diagonal = upper;
        previous[j] = Math.min(substitution, insertion, deletion);
      }
    }

    return previous[b.length];
  }

  function findScorerTeam(providerName) {
    const teams = window.WC2026_MATCHES?.teams || {};
    const aliases = {
      "bosnia and herzegovina": "BIH",
      "czech republic": "CZE",
    };
    const normalizedName = normalizeScorerText(providerName);
    const aliasCode = aliases[normalizedName];

    if (aliasCode && teams[aliasCode]) return teams[aliasCode];

    return Object.values(teams).find((team) =>
      [team.code, team.name, team.providerName]
        .map(normalizeScorerText)
        .includes(normalizedName),
    );
  }

  function findScorerProfile(teamCode, playerName) {
    const players =
      window.WC2026_PLAYER_PROFILES?.[teamCode]?.players || [];
    const normalizedName = normalizeScorerText(playerName);
    let bestMatch = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const player of players) {
      const candidate = normalizeScorerText(player.name);
      if (candidate === normalizedName) return player;

      const distance = scorerNameDistance(normalizedName, candidate);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = player;
      }
    }

    if (bestMatch) {
      const threshold = Math.max(
        3,
        Math.ceil(normalizeScorerText(bestMatch.name).length * 0.35),
      );
      if (bestDistance <= threshold) return bestMatch;
    }

    return players.find(
      (player) => normalizeScorerText(player.name) === normalizedName,
    );
  }

  function canonicalScorerName(teamCode, playerName) {
    const profile = findScorerProfile(teamCode, playerName);
    return profile?.name || String(playerName || "").trim();
  }

  function canonicalizeStoredScorers() {
    try {
      const saved = JSON.parse(localStorage.getItem("wc2026:v1") || "{}");
      const scorers = Array.isArray(saved.scorers) ? saved.scorers : [];
      let changed = false;

      saved.scorers = scorers.map((scorer) => {
        const name = canonicalScorerName(scorer.team, scorer.name);
        if (name !== scorer.name) changed = true;
        return { ...scorer, name };
      });

      if (changed) {
        localStorage.setItem("wc2026:v1", JSON.stringify(saved));
      }
    } catch {
      // If local storage is blocked, the live DOM fallback below still works.
    }
  }

  function canonicalizeRenderedScorers() {
    const manualHeading = [...document.querySelectorAll("h3")].find(
      (heading) => heading.textContent.trim() === "KRÓL STRZELCÓW TURNIEJU",
    );
    if (!manualHeading) return;

    const manualPanel =
      manualHeading.closest(".rounded-2xl") || manualHeading.parentElement;
    if (!manualPanel) return;

    const nameNodes = [
      ...manualPanel.querySelectorAll(".font-semibold.text-sm.truncate"),
    ];

    nameNodes.forEach((nameNode) => {
      const row = nameNode.closest(".rounded-xl");
      const teamNode = row?.querySelector(".text-\\[10px\\].text-slate-500");
      const teamCode = findScorerTeam(teamNode?.textContent || "")?.code || "";
      const normalizedName = canonicalScorerName(teamCode, nameNode.textContent);
      if (normalizedName && normalizedName !== nameNode.textContent) {
        nameNode.textContent = normalizedName;
      }
    });
  }

  function collectAutomaticScorers() {
    const scorers = new Map();

    (window.WC2026_MATCH_CENTER?.fixtures || []).forEach((fixture) => {
      (fixture.events || [])
        .filter(
          (event) =>
            event.type === "Goal" &&
            event.detail !== "Own Goal" &&
            event.player?.trim(),
        )
        .forEach((event) => {
          const team = findScorerTeam(event.team);
          const playerName = canonicalScorerName(team?.code || "", event.player);
          const key = `${normalizeScorerText(playerName)}:${team?.code || normalizeScorerText(event.team)}`;
          const scorer = scorers.get(key) || {
            player: playerName.trim(),
            teamCode: team?.code || "",
            teamName: team?.name || event.team || "",
            flag: team?.flag || "⚽",
            goals: 0,
            minutes: [],
          };

          scorer.goals += 1;
          scorer.minutes.push({
            elapsed: Number(event.elapsed) || 0,
            extra: Number(event.extra) || 0,
          });
          scorers.set(key, scorer);
        });
    });

    return [...scorers.values()].sort(
      (first, second) =>
        second.goals - first.goals ||
        first.player.localeCompare(second.player, "pl"),
    );
  }

  function formatScorerMinutes(minutes) {
    return minutes
      .sort(
        (first, second) =>
          first.elapsed - second.elapsed || first.extra - second.extra,
      )
      .map(
        ({ elapsed, extra }) =>
          `${elapsed}${extra ? `+${extra}` : ""}'`,
      )
      .join(", ");
  }

  function createScorerRow(scorer, index) {
    const row = document.createElement("li");
    row.className = "automatic-scorers-row";

    const rank = document.createElement("span");
    rank.className = "automatic-scorers-rank";
    rank.textContent = String(index + 1);
    rank.setAttribute("aria-label", `Miejsce ${index + 1}`);

    const identity = document.createElement("div");
    identity.className = "automatic-scorers-identity";

    const flag = document.createElement("span");
    flag.className = "automatic-scorers-flag";
    flag.textContent = scorer.flag;
    flag.setAttribute("aria-hidden", "true");

    const player = document.createElement("div");
    player.className = "automatic-scorers-player";
    const profile = findScorerProfile(scorer.teamCode, scorer.player);
    const playerName = profile ? document.createElement("a") : document.createElement("strong");
    playerName.textContent = profile?.name || scorer.player;

    if (profile) {
      playerName.href = `player.html?team=${encodeURIComponent(scorer.teamCode)}&id=${encodeURIComponent(profile.slug)}`;
    }

    const team = document.createElement("span");
    team.textContent = scorer.teamName;
    player.append(playerName, team);
    identity.append(flag, player);

    const minutes = document.createElement("span");
    minutes.className = "automatic-scorers-minutes";
    minutes.textContent = formatScorerMinutes(scorer.minutes);
    minutes.setAttribute("aria-label", `Minuty goli: ${minutes.textContent}`);

    const goals = document.createElement("strong");
    goals.className = "automatic-scorers-goals";
    goals.textContent = String(scorer.goals);
    goals.setAttribute(
      "aria-label",
      `${scorer.goals} ${scorer.goals === 1 ? "gol" : "gole"}`,
    );

    row.append(rank, identity, minutes, goals);
    return row;
  }

  function createAutomaticScorers() {
    const section = document.createElement("section");
    section.className = "automatic-scorers";
    section.dataset.automaticScorers = "true";

    const header = document.createElement("header");
    header.className = "automatic-scorers-header";

    const headingGroup = document.createElement("div");
    const kicker = document.createElement("p");
    kicker.className = "automatic-scorers-kicker";
    kicker.textContent = "TURNIEJ 2026";

    const heading = document.createElement("h3");
    heading.textContent = "KLASYFIKACJA STRZELCÓW";

    const description = document.createElement("p");
    description.className = "automatic-scorers-description";
    description.textContent =
      "Ranking aktualizuje się automatycznie po zakończonych meczach.";
    headingGroup.append(kicker, heading, description);

    const badge = document.createElement("span");
    badge.className = "automatic-scorers-badge";
    badge.textContent = "AKTUALIZACJA AUTOMATYCZNA";
    header.append(headingGroup, badge);

    const columns = document.createElement("div");
    columns.className = "automatic-scorers-columns";
    columns.setAttribute("aria-hidden", "true");
    columns.innerHTML = `
      <span>LP.</span>
      <span>ZAWODNIK</span>
      <span>MINUTY</span>
      <span>GOLE</span>
    `;

    const list = document.createElement("ol");
    list.className = "automatic-scorers-list";
    const scorers = collectAutomaticScorers();

    if (scorers.length) {
      scorers
        .slice(0, 15)
        .forEach((scorer, index) => list.append(createScorerRow(scorer, index)));
    } else {
      const empty = document.createElement("li");
      empty.className = "automatic-scorers-empty";
      empty.textContent =
        "Klasyfikacja pojawi się po pierwszych golach turnieju.";
      list.append(empty);
    }

    const note = document.createElement("p");
    note.className = "automatic-scorers-note";
    note.textContent =
      "Gole samobójcze nie są zaliczane do klasyfikacji zawodników.";

    section.append(header, columns, list, note);
    return section;
  }

  function enhanceStatistics() {
    const manualHeading = [...document.querySelectorAll("h3")].find(
      (heading) => heading.textContent.trim() === "KRÓL STRZELCÓW TURNIEJU",
    );
    if (!manualHeading) return;

    const manualPanel =
      manualHeading.closest(".rounded-2xl") || manualHeading.parentElement;
    if (!manualPanel) return;

    manualPanel.dataset.manualScorersPanel = "true";
    manualPanel.hidden = true;

    if (!document.querySelector("[data-automatic-scorers]")) {
      manualPanel.insertAdjacentElement("afterend", createAutomaticScorers());
    }
  }

  const knockoutFinishedStatuses = new Set(["FT", "AET", "PEN"]);
  const knockoutRoundOrder = [
    "1/16",
    "1/8",
    "Ćwierćfinał",
    "Półfinał",
    "O 3. miejsce",
    "FINAŁ",
  ];

  function readStoredTournamentResults() {
    const groupResults = {};
    const knockoutResults = {};

    (window.WC2026_MATCH_CENTER?.fixtures || []).forEach((fixture) => {
      if (
        !fixture.appMatchId ||
        !knockoutFinishedStatuses.has(fixture.status?.short) ||
        !Number.isInteger(fixture.goals?.home) ||
        !Number.isInteger(fixture.goals?.away)
      ) {
        return;
      }

      const result = {
        hg: fixture.goals.home,
        ag: fixture.goals.away,
      };
      const homePenalties = fixture.score?.penalty?.home;
      const awayPenalties = fixture.score?.penalty?.away;
      if (
        Number.isInteger(homePenalties) &&
        Number.isInteger(awayPenalties) &&
        homePenalties !== awayPenalties
      ) {
        result.pen = homePenalties > awayPenalties ? "home" : "away";
      }

      if (Number(fixture.appMatchId) <= 72) {
        groupResults[fixture.appMatchId] = result;
      } else {
        knockoutResults[fixture.appMatchId] = result;
      }
    });

    try {
      const saved = JSON.parse(localStorage.getItem("wc2026:v1") || "{}");
      Object.assign(groupResults, saved.results || {});
      Object.assign(knockoutResults, saved.koResults || {});
    } catch {
      // Match-center data is enough if local storage is unavailable.
    }

    return { groupResults, knockoutResults };
  }

  function teamInfo(code) {
    const team = window.WC2026_MATCHES?.teams?.[code] || {};
    return {
      code,
      name: team.name || code,
      flag: team.flag || "",
    };
  }

  function resultIsComplete(result) {
    return Number.isInteger(result?.hg) && Number.isInteger(result?.ag);
  }

  function createEmptyStanding(code, group) {
    return {
      ...teamInfo(code),
      group,
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

  function calculateLiveStandings(results) {
    const groupMatches = (window.WC2026_MATCHES?.matches || []).filter(
      (match) => match.phase === "group",
    );
    const groups = {};

    groupMatches.forEach((match) => {
      groups[match.group] ||= {};
      groups[match.group][match.homeCode] ||= createEmptyStanding(
        match.homeCode,
        match.group,
      );
      groups[match.group][match.awayCode] ||= createEmptyStanding(
        match.awayCode,
        match.group,
      );

      const result = results[match.id];
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
          .every((match) => resultIsComplete(results[match.id]));
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

  function knockoutWinner(homeCode, awayCode, result) {
    if (!homeCode || !awayCode || !resultIsComplete(result)) return null;
    if (result.hg > result.ag) return { winner: homeCode, loser: awayCode };
    if (result.ag > result.hg) return { winner: awayCode, loser: homeCode };
    if (result.pen === "home") return { winner: homeCode, loser: awayCode };
    if (result.pen === "away") return { winner: awayCode, loser: homeCode };
    return null;
  }

  function resolveGroupLabel(label, standings, usedThirds) {
    const groupWinner = label?.match(/^Zwycięzca grupy ([A-L])$/);
    if (groupWinner) {
      const group = groupWinner[1];
      const team = standings.groups[group]?.[0];
      return team
        ? {
            code: team.code,
            label: null,
            projected: !standings.completedGroups.has(group),
          }
        : { code: null, label };
    }

    const groupRunnerUp = label?.match(/^2\. miejsce grupy ([A-L])$/);
    if (groupRunnerUp) {
      const group = groupRunnerUp[1];
      const team = standings.groups[group]?.[1];
      return team
        ? {
            code: team.code,
            label: null,
            projected: !standings.completedGroups.has(group),
          }
        : { code: null, label };
    }

    const thirdPlace = label?.match(/^3\. miejsce \(([^)]+)\)$/);
    if (thirdPlace) {
      const allowed = new Set(thirdPlace[1].split("/"));
      const team = standings.thirdTeams
        .slice(0, 8)
        .find((candidate) => allowed.has(candidate.group) && !usedThirds.has(candidate.code));
      if (!team) return { code: null, label };
      usedThirds.add(team.code);
      return {
        code: team.code,
        label: null,
        projected: !standings.completedGroups.has(team.group),
      };
    }

    return { code: null, label: label || "Do ustalenia" };
  }

  function resolveBracket(standings, knockoutResults) {
    const matches = (window.WC2026_MATCHES?.matches || [])
      .filter((match) => match.phase === "knockout")
      .sort((first, second) => Number(first.id) - Number(second.id));
    const bracket = {};
    const usedThirds = new Set();

    const resolveSlot = (label) => {
      const matchWinner = label?.match(/^Zwycięzca meczu (\d+)$/);
      if (matchWinner) {
        const source = bracket[Number(matchWinner[1])];
        return source?.winner
          ? { code: source.winner, label: null }
          : { code: null, label };
      }

      const matchLoser = label?.match(/^Przegrany meczu (\d+)$/);
      if (matchLoser) {
        const source = bracket[Number(matchLoser[1])];
        return source?.loser
          ? { code: source.loser, label: null }
          : { code: null, label };
      }

      return resolveGroupLabel(label, standings, usedThirds);
    };

    matches.forEach((match) => {
      const home = resolveSlot(match.homeLabel);
      const away = resolveSlot(match.awayLabel);
      const result = knockoutResults[match.id];
      const decision = knockoutWinner(home.code, away.code, result) || {};
      bracket[match.id] = {
        match,
        home,
        away,
        result,
        winner: decision.winner || null,
        loser: decision.loser || null,
      };
    });

    return bracket;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderBracketTeam(slot) {
    if (!slot?.code) {
      return `<span class="live-bracket-placeholder">${escapeHtml(slot?.label || "Do ustalenia")}</span>`;
    }
    const team = teamInfo(slot.code);
    return `<span class="live-bracket-team"><span>${escapeHtml(team.flag)}</span><span class="live-bracket-team-name"><strong>${escapeHtml(team.name)}</strong></span></span>`;
  }

  function renderLiveKnockoutPanel(data) {
    const section = document.createElement("section");
    section.className = "live-knockout-panel";
    section.dataset.liveKnockoutPanel = data.signature;

    const champion = data.bracket[104]?.winner
      ? teamInfo(data.bracket[104].winner)
      : null;

    const rounds = knockoutRoundOrder
      .map((round) => {
        const items = Object.values(data.bracket).filter(
          (item) => item.match.round === round,
        );
        if (!items.length) return "";

        const cards = items
          .map((item) => {
            const result = resultIsComplete(item.result)
              ? `${item.result.hg}:${item.result.ag}${item.result.pen ? " k." : ""}`
              : "vs";
            return `
              <article class="live-bracket-card${item.winner ? " is-decided" : ""}${item.home.code && item.away.code ? " is-ready" : ""}">
                <div class="live-bracket-meta">
                  <span>#${item.match.id}</span>
                  <span>${escapeHtml(item.match.time)}</span>
                </div>
                <div class="live-bracket-match">
                  ${renderBracketTeam(item.home)}
                  <strong class="live-bracket-score">${escapeHtml(result)}</strong>
                  ${renderBracketTeam(item.away)}
                </div>
                <p>${escapeHtml(item.match.stadium)} · ${escapeHtml(item.match.city)}</p>
              </article>
            `;
          })
          .join("");

        return `
          <section class="live-bracket-round">
            <h3>${escapeHtml(round)}</h3>
            <div class="live-bracket-round-grid">${cards}</div>
          </section>
        `;
      })
      .join("");

    section.innerHTML = `
      <header class="live-bracket-header">
        <div>
          <p class="live-bracket-kicker">DRABINKA NA ŻYWO</p>
        </div>
      </header>
      ${
        champion
          ? `<div class="live-bracket-champion"><span>${escapeHtml(champion.flag)}</span><strong>${escapeHtml(champion.name)}</strong><small>Mistrz świata 2026</small></div>`
          : ""
      }
      <div class="live-bracket-scroll">${rounds}</div>
    `;

    return section;
  }

  function enhanceLiveKnockoutBracket() {
    const anchor = [...document.querySelectorAll(".rounded-2xl")].find(
      (element) =>
        element.textContent.includes("Auto-drabinka") &&
        element.textContent.includes("Pary układają się"),
    );

    if (!anchor) {
      document
        .querySelectorAll("[data-live-knockout-panel]")
        .forEach((panel) => panel.remove());
      return;
    }

    const { groupResults, knockoutResults } = readStoredTournamentResults();
    const standings = calculateLiveStandings(groupResults);
    const bracket = resolveBracket(standings, knockoutResults);
    const signature = JSON.stringify({
      groupResults,
      knockoutResults,
      completedGroups: [...standings.completedGroups],
    });

    const existing = document.querySelector("[data-live-knockout-panel]");
    if (existing?.dataset.liveKnockoutPanel === signature) return;

    const panel = renderLiveKnockoutPanel({
      groupResults,
      knockoutResults,
      standings,
      bracket,
      signature,
    });
    existing?.remove();
    anchor.insertAdjacentElement("beforebegin", panel);
  }

  const mobileQuickNavItems = [
    { labels: ["Mecze"], short: "Mecze", icon: "📅" },
    { labels: ["Tabele grup", "Tabele"], short: "Tabele", icon: "📊" },
    { labels: ["Statystyki", "Staty"], short: "Staty", icon: "📈" },
    {
      labels: ["Gwiazdy Mundialu", "Gwiazdy", "Grupa śmierci", "Śmierci"],
      short: "Gwiazdy",
      icon: "🔥",
    },
    { labels: ["Faza pucharowa", "Puchar"], short: "Puchar", icon: "🏆" },
  ];

  function matchStatusShort(fixture, match) {
    const status = upcomingMatchStatus(fixture, match);
    if (status.live) return "NA ŻYWO";
    if (status.finished) return "KONIEC";
    return "START";
  }

  function bestMobileHeroMatch() {
    const fixtures = new Map(
      (window.WC2026_MATCH_CENTER?.fixtures || []).map((fixture) => [
        Number(fixture.appMatchId),
        fixture,
      ]),
    );
    const now = Date.now();
    const items = (window.WC2026_MATCHES?.matches || [])
      .map((match) => ({
        match,
        fixture: fixtures.get(Number(match.id)),
        kickoff: matchKickoff(match),
      }))
      .sort((first, second) => first.kickoff - second.kickoff);

    return (
      items.find(({ fixture, match, kickoff }) => {
        const status = fixture?.status?.short;
        return (
          matchBrowserLiveStatuses.has(status) ||
          (kickoff.getTime() <= now && now <= kickoff.getTime() + 180 * 60 * 1000)
        );
      }) ||
      items.find(({ kickoff, fixture }) => {
        const status = fixture?.status?.short;
        return (
          kickoff.getTime() > now &&
          !matchBrowserFinishedStatuses.has(status)
        );
      }) ||
      items.find(({ fixture }) =>
        matchBrowserFinishedStatuses.has(fixture?.status?.short),
      )
    );
  }

  function createMobileMatchHero(item) {
    const { match, fixture } = item;
    const status = upcomingMatchStatus(fixture, match);
    const hero = document.createElement("section");
    hero.className = `mobile-match-hero${status.live ? " is-live" : ""}`;
    hero.dataset.mobileMatchHero = `${match.id}:${status.main}:${status.detail}`;

    hero.innerHTML = `
      <a class="mobile-match-hero-link" href="match.html?id=${match.id}">
        <span class="mobile-match-hero-kicker">${status.live ? "TERAZ GRANE" : status.finished ? "OSTATNI WYNIK" : "NAJBLIŻSZY MECZ"}</span>
        <div class="mobile-match-hero-score">
          <span><b>${escapeHtml(match.homeFlag)}</b><strong>${escapeHtml(match.homeName)}</strong></span>
          <em>
            <strong>${escapeHtml(status.main)}</strong>
            <small>${escapeHtml(status.detail)}</small>
          </em>
          <span><b>${escapeHtml(match.awayFlag)}</b><strong>${escapeHtml(match.awayName)}</strong></span>
        </div>
        <p>${escapeHtml(match.stadium)} · ${escapeHtml(match.city)}</p>
      </a>
    `;
    return hero;
  }

  function enhanceMobileMatchHero() {
    if (!isMatchesTabActive()) {
      document.querySelector("[data-mobile-match-hero]")?.remove();
      return;
    }
    const browser = document.querySelector("[data-match-browser]");
    const container = browser?.parentElement;
    if (!browser || !container) return;

    const item = bestMobileHeroMatch();
    if (!item) return;
    const hero = createMobileMatchHero(item);
    const existing = container.querySelector("[data-mobile-match-hero]");
    if (existing?.dataset.mobileMatchHero === hero.dataset.mobileMatchHero) return;
    existing?.remove();
    browser.insertAdjacentElement("beforebegin", hero);
  }

  function activeMobileNavLabel() {
    const active =
      [...document.querySelectorAll("button[data-nav-order]")].find((button) =>
        button.className.includes("amber"),
      ) || [...document.querySelectorAll("button[data-nav-order]")][0];
    return active?.textContent.trim() || "Mecze";
  }

  function findNavigationButton(labels) {
    const accepted = new Set(labels);
    const buttons = [...document.querySelectorAll("button[data-nav-order]")];
    return (
      buttons.find((button) => accepted.has(button.textContent.trim())) ||
      buttons.find((button) =>
        labels.some((label) => button.textContent.trim().includes(label)),
      ) ||
      null
    );
  }

  function enhanceMobileBottomNavigation() {
    let nav = document.querySelector("[data-mobile-bottom-nav]");
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "mobile-bottom-nav";
      nav.dataset.mobileBottomNav = "true";
      nav.setAttribute("aria-label", "Szybka nawigacja mobilna");
      document.body.append(nav);
    }

    const activeLabel = activeMobileNavLabel();
    const signature = `${activeLabel}:${mobileQuickNavItems.map((item) => item.short).join("|")}`;
    if (nav.dataset.signature === signature) return;
    nav.dataset.signature = signature;
    nav.replaceChildren();

    mobileQuickNavItems.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mobile-bottom-nav-button";
      button.dataset.active = String(item.labels.includes(activeLabel));
      button.innerHTML = `<span aria-hidden="true">${item.icon}</span><strong>${escapeHtml(item.short)}</strong>`;
      button.addEventListener("click", () => {
        const source = findNavigationButton(item.labels);
        if (!source) return;
        source.click();
      });
      nav.append(button);
    });
  }

  function favoriteTeamCodes() {
    try {
      return new Set(JSON.parse(localStorage.getItem("wc2026:fav-teams") || "[]"));
    } catch {
      return new Set();
    }
  }

  function saveFavoriteTeamCodes(codes) {
    try {
      localStorage.setItem("wc2026:fav-teams", JSON.stringify([...codes]));
    } catch {
      // Favorites are an optional mobile convenience.
    }
  }

  function toggleFavoriteTeam(code) {
    if (!code) return;
    const codes = favoriteTeamCodes();
    if (codes.has(code)) codes.delete(code);
    else codes.add(code);
    saveFavoriteTeamCodes(codes);
  }

  function setFavoriteMatchTeams(match, active) {
    const codes = favoriteTeamCodes();
    [match.homeCode, match.awayCode].filter(Boolean).forEach((code) => {
      if (active) codes.add(code);
      else codes.delete(code);
    });
    saveFavoriteTeamCodes(codes);
  }

  function createCalendarHref(match) {
    const start = matchKickoff(match);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const format = (date) =>
      date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const title = encodeURIComponent(`${match.homeName} - ${match.awayName}`);
    const location = encodeURIComponent(`${match.stadium}, ${match.city}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${format(start)}/${format(end)}&location=${location}`;
  }

  function enhanceMatchActionButtons() {
    const favorites = favoriteTeamCodes();
    document.querySelectorAll(".upcoming-match-card").forEach((card) => {
      if (card.dataset.matchActions === "true") return;
      card.querySelector(".upcoming-match-actions")?.remove();
      const href = card.getAttribute("href") || "";
      const id = Number(new URL(href, window.location.href).searchParams.get("id"));
      const match = (window.WC2026_MATCHES?.matches || []).find(
        (candidate) => Number(candidate.id) === id,
      );
      if (!match) return;

      card.dataset.matchActions = "true";
      if (favorites.has(match.homeCode) || favorites.has(match.awayCode)) {
        card.classList.add("is-favorite-match");
      } else {
        card.classList.remove("is-favorite-match");
      }

      const actions = document.createElement("div");
      actions.className = "upcoming-match-actions";
      const isFavorite = favorites.has(match.homeCode) || favorites.has(match.awayCode);

      const favorite = document.createElement("button");
      favorite.type = "button";
      favorite.className = "upcoming-match-action";
      favorite.textContent = isFavorite ? "★ Mój mecz" : "☆ Obserwuj";
      favorite.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setFavoriteMatchTeams(match, !isFavorite);
        document.querySelectorAll("[data-match-actions='true']").forEach((node) => {
          node.dataset.matchActions = "false";
        });
        enhanceMatchActionButtons();
      });

      const calendar = document.createElement("a");
      calendar.className = "upcoming-match-action";
      calendar.href = createCalendarHref(match);
      calendar.target = "_blank";
      calendar.textContent = "＋ Kalendarz";
      calendar.addEventListener("click", (event) => event.stopPropagation());

      actions.append(favorite, calendar);
      card.append(actions);
    });
  }

  function enhanceFavoriteMatchesHint() {
    if (!isMatchesTabActive()) return;
    const codes = favoriteTeamCodes();
    const browser = document.querySelector("[data-match-browser]");
    if (!browser || !codes.size) return;
    if (browser.querySelector("[data-favorite-matches-hint]")) return;
    const hint = document.createElement("button");
    hint.type = "button";
    hint.className = "favorite-matches-hint";
    hint.dataset.favoriteMatchesHint = "true";
    hint.textContent = "⭐ Pokaż moje drużyny";
    hint.addEventListener("click", () => {
      const select = document.querySelector('select[aria-label="Filtr drużyny"]');
      const firstCode = [...codes].find((code) =>
        [...(select?.options || [])].some((option) => option.value === code),
      );
      if (select && firstCode) {
        select.value = firstCode;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    browser.append(hint);
  }

  function enhanceScoreChangeToast() {
    const fixtures = window.WC2026_MATCH_CENTER?.fixtures || [];
    if (!fixtures.length) return;
    const scores = fixtures
      .filter((fixture) =>
        Number.isInteger(fixture.goals?.home) &&
        Number.isInteger(fixture.goals?.away),
      )
      .map((fixture) => `${fixture.appMatchId}:${fixture.goals.home}:${fixture.goals.away}`)
      .join("|");
    if (!scores) return;

    let previous = "";
    try {
      previous = localStorage.getItem("wc2026:last-score-signature") || "";
      localStorage.setItem("wc2026:last-score-signature", scores);
    } catch {
      return;
    }
    if (!previous || previous === scores || document.querySelector("[data-goal-toast]")) return;

    const changed = scores
      .split("|")
      .find((entry) => !previous.split("|").includes(entry));
    const matchId = Number(changed?.split(":")[0]);
    const match = (window.WC2026_MATCHES?.matches || []).find(
      (candidate) => Number(candidate.id) === matchId,
    );
    if (!match) return;

    const toast = document.createElement("a");
    toast.className = "goal-update-toast";
    toast.dataset.goalToast = "true";
    toast.href = `match.html?id=${match.id}`;
    toast.innerHTML = `<span>GOL / AKTUALIZACJA</span><strong>${escapeHtml(match.homeName)} - ${escapeHtml(match.awayName)}</strong>`;
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 5200);
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
    makeHeaderTrophyInteractive();
    enhancePrimaryNavigationIcons();
    enhanceStadiumMap();
    enhancePlayerSquad();
    enhanceTeamBackButton();
    enhanceDreamTeamPhotos();
    enhanceUpcomingMatches();
    enhanceMatchBrowser();
    addAdSlots();
    enhanceWorldStarsNavigation();
    reorderNavigation();
    enhanceCollapsibleMobileNavigation();
    canonicalizeStoredScorers();
    canonicalizeRenderedScorers();
    enhanceStatistics();
    enhanceLiveKnockoutBracket();
    enhanceMobileMatchHero();
    enhanceMobileBottomNavigation();
    document.querySelector("[data-sticky-live-ticker]")?.remove();
    enhanceMatchActionButtons();
    enhanceFavoriteMatchesHint();
    enhanceScoreChangeToast();
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
