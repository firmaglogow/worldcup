(() => {
  "use strict";

  const positionLabels = {
    GK: "Bramkarz",
    DF: "Obrońca",
    MF: "Pomocnik",
    FW: "Napastnik",
  };

  function calculateAge(birthDate, today = new Date()) {
    const [day, month, year] = birthDate.split("/").map(Number);
    let age = today.getFullYear() - year;
    const birthdayThisYear = new Date(today.getFullYear(), month - 1, day);
    if (today < birthdayThisYear) age -= 1;
    return age;
  }

  function formatAge(age) {
    if (age === 1) return "1 rok";
    const lastTwo = age % 100;
    const last = age % 10;
    return `${age} ${last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14) ? "lata" : "lat"}`;
  }

  function initials(name) {
    return name
      .split(/[\s-]+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function metric(label, value) {
    const item = document.createElement("div");
    item.className = "player-profile-metric";

    const metricLabel = document.createElement("span");
    metricLabel.textContent = label;

    const metricValue = document.createElement("strong");
    metricValue.textContent = value;
    item.append(metricLabel, metricValue);
    return item;
  }

  function renderNotFound(container) {
    container.classList.add("player-profile-card-error");
    const title = document.createElement("h1");
    title.textContent = "Nie znaleziono zawodnika";
    const description = document.createElement("p");
    description.textContent =
      "Wróć do strony głównej i wybierz zawodnika z kadry Francji.";
    const link = document.createElement("a");
    link.href = "index.html";
    link.textContent = "Przejdź do strony głównej";
    container.replaceChildren(title, description, link);
  }

  function renderProfile(container, player, team) {
    document.title = `${player.name} – Francja – Mistrzostwa Świata 2026`;

    const hero = document.createElement("div");
    hero.className = "player-profile-hero";

    const portrait = document.createElement("div");
    portrait.className = "player-profile-portrait";
    const fallback = document.createElement("span");
    fallback.textContent = initials(player.name);
    portrait.append(fallback);

    if (player.image) {
      const image = document.createElement("img");
      image.src = player.image;
      image.alt = `Zdjęcie: ${player.name}`;
      image.width = 560;
      image.height = 680;
      image.decoding = "async";
      image.addEventListener("load", () =>
        portrait.classList.add("has-player-image"),
      );
      image.addEventListener("error", () => image.remove());
      portrait.prepend(image);
    }

    const summary = document.createElement("div");
    summary.className = "player-profile-summary";

    const teamLabel = document.createElement("p");
    teamLabel.className = "player-profile-team";
    teamLabel.textContent = `${team.flag} REPREZENTACJA FRANCJI`;

    const title = document.createElement("h1");
    title.textContent = player.name;

    const role = document.createElement("p");
    role.className = "player-profile-role";
    role.textContent = `${positionLabels[player.position]} · numer ${player.number}`;

    const club = document.createElement("p");
    club.className = "player-profile-club";
    club.textContent = player.club;

    const quickMetrics = document.createElement("div");
    quickMetrics.className = "player-profile-quick-metrics";
    quickMetrics.append(
      metric("Wiek", formatAge(calculateAge(player.birthDate))),
      metric("Wzrost", `${player.heightCm} cm`),
      metric("Numer", String(player.number)),
    );

    summary.append(teamLabel, title, role, club, quickMetrics);
    hero.append(portrait, summary);

    const details = document.createElement("section");
    details.className = "player-profile-details";
    const detailsTitle = document.createElement("h2");
    detailsTitle.textContent = "Metryka zawodnika";
    const detailsGrid = document.createElement("div");
    detailsGrid.className = "player-profile-details-grid";
    detailsGrid.append(
      metric("Pełne imiona", player.firstNames),
      metric("Nazwisko", player.lastNames),
      metric("Napis na koszulce", player.shirtName),
      metric("Data urodzenia", player.birthDate),
      metric("Aktualny wiek", formatAge(calculateAge(player.birthDate))),
      metric("Pozycja", positionLabels[player.position]),
      metric("Klub", player.club),
      metric("Wzrost", `${player.heightCm} cm`),
    );
    details.append(detailsTitle, detailsGrid);

    const sources = document.createElement("footer");
    sources.className = "player-profile-sources";
    const dataSource = document.createElement("p");
    dataSource.textContent =
      "Dane zawodnika: oficjalna lista FIFA, wersja z 9 czerwca 2026.";
    sources.append(dataSource);

    if (player.photo) {
      const photoSource = document.createElement("p");
      photoSource.append("Zdjęcie: ", player.photo.author, " · ");

      const license = document.createElement("a");
      license.href = player.photo.licenseUrl;
      license.target = "_blank";
      license.rel = "noopener noreferrer";
      license.textContent = player.photo.license;

      const source = document.createElement("a");
      source.href = player.photo.sourceUrl;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = "Wikimedia Commons";

      photoSource.append(license, " · ", source);
      sources.append(photoSource);
    }

    container.replaceChildren(hero, details, sources);
  }

  const backButton = document.querySelector("[data-player-back]");
  backButton?.addEventListener("click", () => {
    if (document.referrer) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  });

  const container = document.querySelector("[data-player-profile]");
  const slug = new URLSearchParams(window.location.search).get("id");
  const team = window.WC2026_PLAYER_PROFILES?.FRA;
  const player = team?.players?.find((candidate) => candidate.slug === slug);

  if (!container || !player) {
    if (container) renderNotFound(container);
    return;
  }

  renderProfile(container, player, team);
})();
