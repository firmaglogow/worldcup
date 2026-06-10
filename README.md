# World Cup 2026

Interaktywna strona turniejowa publikowana przez GitHub Pages:
https://firmaglogow.github.io/worldcup/

## Najważniejsze pliki

- `index.html` - metadane strony i ładowanie aplikacji.
- `assets/app.js` - skompilowana aplikacja React.
- `data/squads.json` - kompletne dane 48 oficjalnych kadr.
- `assets/squads.js` - dane kadr ładowane bezpośrednio przez stronę.
- `assets/player-profiles.js` - szczegółowe profile i zdjęcia obsługiwanych kadr.
- `player.html` - podstrona pełnego profilu zawodnika.
- `assets/enhancements.js` - dostępność, źródła danych i drobne ulepszenia.
- `src/styles.css` - źródło stylów.
- `assets/styles.css` - gotowe style używane przez stronę.

## Aktualizacja

```sh
node scripts/update-bundle.mjs
sh scripts/build-css.sh
node scripts/check.mjs
```

Import nowego oficjalnego pliku ze składami:

```sh
python3 scripts/import-squads.py /ścieżka/do/składy.pdf
```

Odświeżenie legalnych zdjęć i metadanych zawodników z Wikimedia Commons:

```sh
node scripts/fetch-player-profiles.mjs
```

Po zatwierdzeniu i wysłaniu zmian do gałęzi `main` GitHub Pages automatycznie
opublikuje nową wersję strony.
