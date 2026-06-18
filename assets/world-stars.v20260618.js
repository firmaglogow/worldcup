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
      thumbnailImage: "../assets/players/france/kylian-mbappe-profile.jpg",
      profileImage: "../assets/players/france/kylian-mbappe.jpg",
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
      image: "../assets/players/norway/erling-haaland.jpg",
      thumbnailImage: "../assets/players/norway/erling-haaland-thumbnail.jpg",
      profileImage: "../assets/players/norway/erling-haaland.jpg",
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
      thumbnailImage: "../assets/players/portugal/cristiano-ronaldo-thumbnail.jpg",
      profileImage: "../assets/players/portugal/cristiano-ronaldo.jpg",
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
    {
      id: "lamine-yamal",
      rating: 93,
      name: "Lamine Yamal",
      shortName: "Yamal",
      country: "Hiszpania",
      flag: "🇪🇸",
      position: "Napastnik",
      club: "FC Barcelona",
      age: 18,
      image: "../assets/players/spain/lamine-yamal.jpg",
      accent: "#facc15",
      accentStrong: "#60a5fa",
      keyStat: {
        label: "Key stat",
        value: "19",
        detail: "numer i symbol bezczelności na wielkiej scenie",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 97,
      route:
        "Yamal to futbolowa odwaga w najczystszej postaci. Jego drybling i lekkość w grze sprawiają, że Hiszpania zyskuje zawodnika, który potrafi rozrywać nawet najlepiej ustawione obrony.",
      curiosity:
        "W tak młodym wieku już gra jak ktoś, kto nie boi się żadnej sceny ani żadnego rywala.",
      whyWatch:
        "Warto go obserwować, bo potrafi w jednej akcji zrobić coś, co zmienia rytm całego meczu. Przy piłce wygląda tak, jakby największe stadiony były dla niego naturalnym placem zabaw.",
    },
    {
      id: "vinicius-junior",
      rating: 95,
      name: "Vinícius Júnior",
      shortName: "Vinícius",
      country: "Brazylia",
      flag: "🇧🇷",
      position: "Napastnik",
      club: "Real Madrid C. F.",
      age: 25,
      image: "../assets/players/brazil/vinicius-junior.jpg",
      thumbnailImage: "../assets/players/brazil/vinicius-junior-thumbnail.jpg",
      profileImage: "../assets/players/brazil/vinicius-junior.jpg",
      accent: "#22c55e",
      accentStrong: "#facc15",
      keyStat: {
        label: "Key stat",
        value: "7",
        detail: "numer skrzydłowego, który ciągnie grę Canarinhos",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 96,
      route:
        "Vinícius wnosi do Brazylii tempo, odwagę i brazylijską lekkość w grze. Gdy rozpędza się na lewej stronie, rywale często muszą bronić nie tylko piłki, ale i całego rytmu spotkania.",
      curiosity:
        "To jeden z tych zawodników, którzy potrafią zamienić zwykłe wejście w mecz w widowisko.",
      whyWatch:
        "Warto go obserwować, bo łączy szybkość, drybling i dużą odporność na presję. Jeśli Brazylia ma wrócić na sam szczyt, jego rola będzie absolutnie centralna.",
    },
    {
      id: "neymar-jr",
      rating: 94,
      name: "Neymar Jr",
      shortName: "Neymar",
      country: "Brazylia",
      flag: "🇧🇷",
      position: "Napastnik",
      club: "Santos FC",
      age: 34,
      image: "../assets/players/brazil/neymar-jr.jpg",
      accent: "#facc15",
      accentStrong: "#22c55e",
      keyStat: {
        label: "Key stat",
        value: "10",
        detail: "numer magii, wolnych i kreatywności",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 91,
      route:
        "Neymar nadal pozostaje jednym z najbardziej rozpoznawalnych nazwisk brazylijskiego futbolu. Jego technika, improwizacja i doświadczenie dają Brazylii profil piłkarza, który potrafi rozkręcić mecz jednym ruchem.",
      curiosity:
        "To nazwisko samo w sobie przyciąga uwagę kibiców, mediów i sponsorów.",
      whyWatch:
        "Warto go obserwować, bo Neymar nadal ma w sobie kreatora, który potrafi odwrócić przebieg akcji. Nawet jeśli nie dominuje fizycznie, jego jakość przy piłce zawsze przyciąga wzrok.",
    },
    {
      id: "raphinha",
      rating: 92,
      name: "Raphinha",
      shortName: "Raphinha",
      country: "Brazylia",
      flag: "🇧🇷",
      position: "Napastnik",
      club: "FC Barcelona",
      age: 29,
      image: "../assets/players/brazil/raphinha.jpg",
      accent: "#16a34a",
      accentStrong: "#facc15",
      keyStat: {
        label: "Key stat",
        value: "11",
        detail: "numer skrzydła i stałego zagrożenia",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 93,
      route:
        "Raphinha wnosi do Brazylii intensywność, pressing i bardzo mocny element zaskoczenia z prawej strony. To zawodnik, który potrafi zrobić przewagę nie tylko dryblingiem, ale też pracą bez piłki.",
      curiosity:
        "Na poziomie wielkiego turnieju często wygrywa nie tylko technika, ale też intensywność - a to jest jego duży atut.",
      whyWatch:
        "Warto go obserwować, bo jest jednym z tych skrzydłowych, którzy potrafią zmienić tempo całego meczu. Przy dobrej formie może być dla Brazylii równie ważny jak bardziej oczywiste gwiazdy.",
    },
    {
      id: "jude-bellingham",
      rating: 95,
      name: "Jude Bellingham",
      shortName: "Bellingham",
      country: "Anglia",
      flag: "🇬🇧",
      position: "Pomocnik",
      club: "Real Madrid C. F.",
      age: 22,
      image: "../assets/players/england/jude-bellingham.jpg",
      thumbnailImage: "../assets/players/england/jude-bellingham-thumbnail.jpg",
      profileImage: "../assets/players/england/jude-bellingham.jpg",
      accent: "#60a5fa",
      accentStrong: "#f8fafc",
      keyStat: {
        label: "Key stat",
        value: "22",
        detail: "numer i symbol pełnej kontroli środka pola",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 95,
      route:
        "Bellingham daje Anglii połączenie elegancji, energii i skuteczności. To zawodnik, który potrafi zdominować środek pola, a jednocześnie pojawić się tam, gdzie trzeba zamknąć akcję golem.",
      curiosity:
        "Już teraz jest dla Anglików kimś więcej niż tylko młodą gwiazdą - to piłkarz od wielkich momentów.",
      whyWatch:
        "Warto go obserwować, bo ma rzadką umiejętność łączenia kontroli meczu z konkretem pod bramką. W decydujących fazach turnieju może być dla Anglii najważniejszym punktem odniesienia.",
    },
    {
      id: "pedri",
      rating: 94,
      name: "Pedri",
      shortName: "Pedri",
      country: "Hiszpania",
      flag: "🇪🇸",
      position: "Pomocnik",
      club: "FC Barcelona",
      age: 23,
      image: "../assets/players/spain/pedri.jpg",
      accent: "#38bdf8",
      accentStrong: "#facc15",
      keyStat: {
        label: "Key stat",
        value: "8",
        detail: "klasyczny numer mózgu drużyny",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 94,
      route:
        "Pedri widzi grę szybciej niż większość rywali i potrafi zamieniać małe przestrzenie w duże okazje. To właśnie tacy pomocnicy budują dominację drużyny bez zbędnego hałasu.",
      curiosity:
        "Jest jednym z tych piłkarzy, którzy grają spokojnie, a jednocześnie całkowicie kontrolują chaos wokół siebie.",
      whyWatch:
        "Warto go obserwować, bo jego decyzje przy piłce często ustawiają cały atak. Jeśli Hiszpania będzie miała przewagę w posiadaniu, Pedri najpewniej będzie jej najczystszą formą.",
    },
    {
      id: "jamal-musiala",
      rating: 94,
      name: "Jamal Musiala",
      shortName: "Musiala",
      country: "Niemcy",
      flag: "🇩🇪",
      position: "Pomocnik",
      club: "FC Bayern München",
      age: 23,
      image: "../assets/players/germany/jamal-musiala.jpg",
      thumbnailImage: "../assets/players/germany/jamal-musiala-thumbnail.jpg",
      profileImage: "../assets/players/germany/jamal-musiala.jpg",
      accent: "#f59e0b",
      accentStrong: "#ef4444",
      keyStat: {
        label: "Key stat",
        value: "10",
        detail: "numer kreatora, który potrafi skręcić mecz w jedną stronę",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 95,
      route:
        "Musiala to drybling, lekkość i nieprzewidywalność w jednym. Niemcy bardzo liczą na to, że to właśnie on będzie ich głównym źródłem nieszablonowych rozwiązań w ofensywie.",
      curiosity:
        "W ciasnych przestrzeniach robi rzeczy, które wyglądają jak mała sztuczka, a kończą się dużym problemem dla obrońcy.",
      whyWatch:
        "Warto go obserwować, bo potrafi sam wyczarować przewagę tam, gdzie nie ma żadnej oczywistej drogi. To zawodnik, który może odpalić w każdej chwili.",
    },
    {
      id: "harry-kane",
      rating: 95,
      name: "Harry Kane",
      shortName: "Kane",
      country: "Anglia",
      flag: "🇬🇧",
      position: "Napastnik",
      club: "FC Bayern München",
      age: 32,
      image: "../assets/players/england/harry-kane.jpg",
      thumbnailImage: "../assets/players/england/harry-kane-thumbnail.jpg",
      profileImage: "../assets/players/england/harry-kane.jpg",
      accent: "#94a3b8",
      accentStrong: "#facc15",
      keyStat: {
        label: "Key stat",
        value: "9",
        detail: "klasyczna dziewiątka i gwarancja bramek",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 94,
      route:
        "Kane to napastnik, który nie potrzebuje wielu okazji, by być groźnym. Anglia dostaje od niego spokój, jakość wykończenia i doświadczenie w meczach o najwyższą stawkę.",
      curiosity:
        "Jest jednym z najlepszych przykładów nowoczesnego snajpera, który potrafi też świetnie grać dla zespołu.",
      whyWatch:
        "Warto go obserwować, bo przy rzutach karnych i w polu karnym jest niemal bezlitosny. Jeśli Anglia dojdzie do meczu na styku, Kane będzie jedną z najważniejszych odpowiedzi.",
    },
    {
      id: "mohamed-salah",
      rating: 94,
      name: "Mohamed Salah",
      shortName: "Salah",
      country: "Egipt",
      flag: "🇪🇬",
      position: "Napastnik",
      club: "Liverpool FC",
      age: 34,
      image: "../assets/players/egypt/mohamed-salah.jpg",
      accent: "#f59e0b",
      accentStrong: "#ef4444",
      keyStat: {
        label: "Key stat",
        value: "10",
        detail: "numer lidera i symbol globalnego zasięgu",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 93,
      route:
        "Salah jest twarzą egipskiej piłki i zawodnikiem, który od lat przyciąga uwagę całego świata. Jego obecność podnosi rangę każdego meczu i daje Egiptowi realną siłę w ataku.",
      curiosity:
        "To piłkarz, którego rozpoznawalność wykracza daleko poza sam turniej i samą reprezentację.",
      whyWatch:
        "Warto go obserwować, bo potrafi łączyć konkret z widowiskowością. Gdy Egipt potrzebuje impulsu, Salah nadal jest jednym z najbardziej oczywistych źródeł zagrożenia.",
    },
    {
      id: "son-heung-min",
      rating: 94,
      name: "Son Heung-min",
      shortName: "Son",
      country: "Korea Płd.",
      flag: "🇰🇷",
      position: "Napastnik",
      club: "LAFC",
      age: 33,
      image: "../assets/players/korea/heungmin-son.jpg",
      accent: "#a855f7",
      accentStrong: "#f8fafc",
      keyStat: {
        label: "Key stat",
        value: "7",
        detail: "numer zawodnika, który daje Korei spokój w ataku",
      },
      tournamentStats: {
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      formImpact: 92,
      route:
        "Son to nie tylko lider sportowy, ale też ogromna postać dla kibiców w Azji. Jego jakość techniczna i spokój w wykończeniu potrafią zamieniać przeciętną akcję w bramkową.",
      curiosity:
        "Na boisku jest błyskawiczny, a poza nim ma status jednego z najbardziej lubianych piłkarzy świata.",
      whyWatch:
        "Warto go obserwować, bo łączy precyzję, doświadczenie i świetne czytanie gry. Dla Korei Południowej to nadal zawodnik, wokół którego kręci się najwięcej nadziei.",
    },
  ];

  const frontCardStats = {
    "lionel-messi": { PAC: 88, DRI: 95, SHO: 99 },
    "kylian-mbappe": { PAC: 99, DRI: 98, SHO: 91 },
    "erling-haaland": { PAC: 96, DRI: 90, SHO: 99 },
    "cristiano-ronaldo": { PAC: 92, DRI: 93, SHO: 97 },
    "lamine-yamal": { PAC: 92, DRI: 97, SHO: 90 },
    "vinicius-junior": { PAC: 98, DRI: 96, SHO: 91 },
    "neymar-jr": { PAC: 90, DRI: 97, SHO: 95 },
    raphinha: { PAC: 93, DRI: 94, SHO: 89 },
    "jude-bellingham": { PAC: 91, DRI: 95, SHO: 99 },
    pedri: { PAC: 86, DRI: 98, SHO: 98 },
    "jamal-musiala": { PAC: 90, DRI: 95, SHO: 97 },
    "harry-kane": { PAC: 91, DRI: 95, SHO: 99 },
    "mohamed-salah": { PAC: 93, DRI: 95, SHO: 94 },
    "son-heung-min": { PAC: 92, DRI: 95, SHO: 95 },
  };

  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name, "pl"));

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

  function setPageAccent(player) {
    document.body.style.setProperty("--active-star-accent", player?.accent || "#74c0fc");
    document.body.style.setProperty("--active-star-strong", player?.accentStrong || "#facc15");
  }

  function getFrontStats(player) {
    return frontCardStats[player.id] || {
      PAC: player.rating,
      DRI: player.rating,
      SHO: player.rating,
    };
  }

  function detailTone(player) {
    if (player.id === "lionel-messi") return "world-star-detail--spotlight";
    return "";
  }

  function featuredTag(player) {
    if (player.id === "lionel-messi") return "Legenda i luksus";
    return "";
  }

  function animateCountUp(node, target, duration = 1100) {
    const safeTarget = Number(target);
    if (!Number.isFinite(safeTarget)) {
      node.textContent = String(target);
      return;
    }

    const start = performance.now();
    const startValue = 0;
    const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const current = Math.round(startValue + (safeTarget - startValue) * easeOutCubic(progress));
      node.textContent = String(current);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  function getPlayerImage(player, variant) {
    if (variant === "profile") {
      return player.profileImage || player.thumbnailImage || player.image || null;
    }

    return player.thumbnailImage || player.image || player.profileImage || null;
  }

  function createVisual(player, className, variant = "thumbnail") {
    const wrap = createElement("div", className);
    wrap.style.setProperty("--accent", player.accent);
    const imageSrc = getPlayerImage(player, variant);

    if (imageSrc) {
      const image = document.createElement("img");
      image.src = imageSrc;
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

  function createFifaCard(player) {
    const card = document.createElement("button");
    card.className = "world-star-card world-star-card--hero world-star-card--fifa";
    if (player.rating >= 95) card.classList.add("world-star-card--elite");
    card.type = "button";
    card.dataset.starId = player.id;
    card.dataset.cardTone = "world-star-card--hero";
    card.style.setProperty("--accent", player.accent);
    card.style.setProperty("--accent-strong", player.accentStrong);
    card.setAttribute("aria-label", `Otwórz profil: ${player.name}`);

    const frame = createElement("div", "world-star-fifa-card");
    const top = createElement("div", "world-star-fifa-top");
    const ratingBlock = createElement("div", "world-star-fifa-rating-block");
    ratingBlock.append(
      createElement("div", "world-star-fifa-rating", String(player.rating)),
      createElement("span", "world-star-fifa-position", positionLabels[player.position] || player.position),
    );
    const meta = createElement("div", "world-star-fifa-meta");
    meta.append(
      createElement("span", "", player.flag),
      createElement("span", "", player.country),
      createElement("span", "", player.position),
    );
    top.append(ratingBlock, meta);

    const visual = createElement("div", "world-star-fifa-visual");
    visual.append(
      createElement("div", "world-star-hero-visual-orbit"),
      createElement("div", "world-star-fifa-shine"),
      createVisual(player, "world-star-image world-star-image--hero", "thumbnail"),
    );

    const footer = createElement("div", "world-star-fifa-footer");
    const nameBlock = createElement("div", "world-star-fifa-name");
    nameBlock.append(
      createElement("p", "", player.shortName),
      createElement("span", "", `${player.flag} ${player.country}`),
    );

    const stats = createElement("div", "world-star-fifa-stats");
    const frontStats = getFrontStats(player);
    const statList = [
      ["PAC", frontStats.PAC],
      ["DRI", frontStats.DRI],
      ["SHO", frontStats.SHO],
    ];
    statList.forEach(([label, value]) => {
      const stat = createElement("div", "world-star-fifa-stat");
      stat.append(createElement("strong", "", value), createElement("span", "", label));
      stats.append(stat);
    });

    footer.append(nameBlock, stats);
    frame.append(top, visual, footer);
    card.append(frame);
    card.addEventListener("click", () => openDialog(player));
    card.addEventListener("pointerenter", () => setPageAccent(player));
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
    return card;
  }

  function createCard(player, options = {}) {
    return createFifaCard(player);
  }

  function renderDialogContent(player) {
    const content = createElement("article", "world-star-detail");

    const media = createVisual(player, "world-star-detail-media", "profile");

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
    const statItems = [
      fact("Gole", String(player.tournamentStats.goals), "world-star-stat"),
      fact("Asysty", String(player.tournamentStats.assists), "world-star-stat"),
      fact("Minuty", String(player.tournamentStats.minutes), "world-star-stat"),
    ];
    stats.append(...statItems);

    const animatingStats = statItems.map((item) => {
      const valueNode = item.querySelector("strong");
      const numeric = Number(valueNode?.textContent);
      return Number.isFinite(numeric) ? { node: valueNode, value: numeric } : null;
    }).filter(Boolean);

    const impact = createElement("section", "world-star-impact");
    const impactTop = createElement("div", "world-star-impact-top");
    impactTop.append(
      createElement("span", "", "Forma / wpływ na drużynę"),
      createElement("strong", "", `${player.formImpact}%`),
    );
    const impactTrack = createElement("div", "world-star-impact-track");
    const impactFill = createElement("span", "world-star-impact-fill");
    impactFill.style.width = "0%";
    impactTrack.append(impactFill);
    impact.append(impactTop, impactTrack);

    const curiosity = createElement("section", "world-star-copy-block");
    curiosity.append(createElement("h3", "", "Ciekawostka"), createElement("p", "", player.curiosity));

    const whyWatch = createElement("section", "world-star-copy-block");
    whyWatch.append(
      createElement("h3", "", "Dlaczego warto go obserwować"),
      createElement("p", "", player.whyWatch),
    );

    const specialTone = detailTone(player);
    if (specialTone) {
      content.classList.add(specialTone);
      const heroTag = createElement("span", "world-star-detail-badge", featuredTag(player));
      details.prepend(heroTag);
    }

    details.append(title, facts, route, stats, impact, curiosity, whyWatch);
    content.append(media, details);

    requestAnimationFrame(() => {
      animatingStats.forEach(({ node, value }) => animateCountUp(node, value));
      impactFill.style.width = `${player.formImpact}%`;
    });

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
  sortedPlayers.forEach((player) => grid?.append(createCard(player)));

  document.querySelector("[data-star-close]")?.addEventListener("click", closeDialog);
  document.querySelector("[data-star-dialog]")?.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeDialog();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDialog();
  });
})();
