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

  function createContactLink(className) {
    const link = document.createElement("a");
    link.href = "mailto:emistrzostwaswiata2026@gmail.com";
    link.className = className;
    link.textContent = "emistrzostwaswiata2026@gmail.com";
    return link;
  }

  function createAdVisual() {
    const visual = document.createElement("div");
    visual.className = "ad-slot-visual";
    visual.setAttribute("aria-hidden", "true");
    visual.innerHTML = `
      <svg class="ad-slot-scene" viewBox="0 0 360 180" role="presentation">
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

        <path class="ad-slot-flight-path" d="M40 132 C112 18 215 18 292 74" />
        <path class="ad-slot-field-line" d="M18 152 H342" />
        <ellipse class="ad-slot-field-mark" cx="183" cy="152" rx="58" ry="13" />

        <g class="ad-slot-goal">
          <path d="M258 62 H332 V151 H258 Z" />
          <path d="M258 62 242 78 V151 H258" />
          <path d="M275 62 V151 M294 62 V151 M313 62 V151" />
          <path d="M242 91 H332 M242 112 H332 M242 132 H332" />
        </g>

        <g class="ad-slot-brand-board">
          <rect x="221" y="92" width="101" height="36" rx="8" />
          <text x="271.5" y="106">TWOJA MARKA</text>
          <text x="271.5" y="119">TUTAJ</text>
        </g>

        <circle class="ad-slot-ball-glow" cx="0" cy="0" r="28" />
        <g class="ad-slot-ball">
          <circle cx="0" cy="0" r="13" />
          <path d="m0-6 5 4-2 6h-6l-2-6 5-4Zm-9 5 4 5-3 5m17-10-4 5 3 5M-3 4l-3 7M3 4l3 7" />
        </g>

        <circle class="ad-slot-spark ad-slot-spark-one" cx="121" cy="54" r="2.5" />
        <circle class="ad-slot-spark ad-slot-spark-two" cx="183" cy="34" r="2" />
        <circle class="ad-slot-spark ad-slot-spark-three" cx="235" cy="47" r="1.8" />
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
    badge.textContent = "REKLAMA / WSPÓŁPRACA";

    const title = document.createElement("h2");
    title.className = "ad-slot-title";
    title.textContent =
      "Chcesz promować swoją markę przy Mistrzostwach Świata 2026?";

    const description = document.createElement("p");
    description.className = "ad-slot-description";
    description.textContent =
      "Twoja reklama może być widoczna przy terminarzu, wynikach i tabelach.";

    const contact = document.createElement("p");
    contact.className = "ad-slot-contact";
    contact.append("Napisz: ");
    contact.append(createContactLink("ad-slot-email"));

    const content = document.createElement("div");
    content.className = "ad-slot-content";
    content.append(badge, title, description, contact);

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
