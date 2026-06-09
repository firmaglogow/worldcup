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

    slot.append(badge, title, description, contact);
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
