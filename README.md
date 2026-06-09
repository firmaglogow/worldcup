# World Cup 2026

Interaktywna strona turniejowa publikowana przez GitHub Pages:
https://firmaglogow.github.io/worldcup/

## Najważniejsze pliki

- `index.html` - metadane strony i ładowanie aplikacji.
- `assets/app.js` - skompilowana aplikacja React.
- `assets/enhancements.js` - dostępność, źródła danych i drobne ulepszenia.
- `src/styles.css` - źródło stylów.
- `assets/styles.css` - gotowe style używane przez stronę.

## Aktualizacja

```sh
node scripts/update-bundle.mjs
sh scripts/build-css.sh
node scripts/check.mjs
```

Po zatwierdzeniu i wysłaniu zmian do gałęzi `main` GitHub Pages automatycznie
opublikuje nową wersję strony.
