/* NOVA — interakcje makiety (motyw, przełączniki, typer, nawigacja). */
(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "nova:theme";

  /* --- Motyw dzień / noc ------------------------------------------------ */
  var toggle = document.getElementById("themeToggle");
  var icon = document.getElementById("themeIcon");

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (icon) icon.textContent = theme === "day" ? "☀" : "☾";
    if (toggle) toggle.setAttribute("aria-pressed", String(theme === "day"));
  }

  var saved;
  try { saved = localStorage.getItem(THEME_KEY); } catch (err) { saved = null; }
  applyTheme(saved === "day" ? "day" : "night");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "day" ? "night" : "day";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* tryb prywatny */ }
    });
  }

  /* --- Przełączniki segmentowe ----------------------------------------- */
  document.querySelectorAll(".segmented").forEach(function (group) {
    group.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button || !group.contains(button)) return;
      group.querySelectorAll("button").forEach(function (item) {
        item.setAttribute("aria-selected", String(item === button));
      });
    });
  });

  /* --- Typer: stepper wyniku ------------------------------------------- */
  document.querySelectorAll(".stepper button[data-step]").forEach(function (button) {
    button.addEventListener("click", function () {
      var output = document.getElementById(button.dataset.target);
      if (!output) return;
      var value = parseInt(output.textContent, 10);
      if (isNaN(value)) value = 0;
      value = Math.min(19, Math.max(0, value + parseInt(button.dataset.step, 10)));
      output.textContent = String(value);
    });
  });

  /* --- Podświetlenie aktywnej sekcji w nawigacji ------------------------ */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) { observer.observe(section); });
  }
})();
