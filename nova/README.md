# NOVA — makieta nowego interfejsu

Poglądowa makieta (mockup) nowego systemu wizualnego serwisu
**mistrzostwaswiata2026.pl**. Strona jest samodzielna: nie modyfikuje aplikacji
produkcyjnej, nie jest podlinkowana z `index.html` i ma `noindex,nofollow`.

## Pliki

| Plik | Rola |
| --- | --- |
| `index.html` | wszystkie ekrany makiety na jednej stronie |
| `nova.css` | tokeny (kolory, typografia, promienie, cienie) + komponenty |
| `nova.js` | motyw dzień/noc, przełączniki segmentowe, stepper typera, podświetlenie nawigacji |

## Co pokazuje makieta

1. **Centrum kibica** — karta meczu na żywo (wynik, zdarzenia, statystyki), licznik, kafle liczbowe, skrót typera.
2. **Mecze** — lista meczów o stałej siatce (godzina / drużyny z wynikiem / kontekst) oraz wariant karty „przed meczem”.
3. **Tabele grup** — awans oznaczony tłem numeru pozycji + legenda, kolumna formy.
4. **Faza pucharowa** — drabinka od ćwierćfinałów do finału, przewijana poziomo na telefonie.
5. **Gwiazdy** — klasyfikacja strzelców z paskami proporcji i karta zawodnika.
6. **Mój typ** — typowanie stepperem, ranking z podświetloną własną pozycją.
7. **Stadiony** — siatka kafli z miejscem na zdjęcie i metadane.
8. **Widok mobilny** — dwa ekrany 360 px z dolnym paskiem nawigacji.
9. **System projektowy** — paleta, skala typograficzna, komponenty, zasady i lista kontrolna dostępności.

## Założenia projektowe

- **Ciemny motyw pozostaje domyślny**, ale wszystkie kolory są tokenami, więc
  tryb dzienny (`data-theme="day"`) wymaga podmiany kilkunastu zmiennych.
- **Złoto zmienia rolę** — z koloru interfejsu na sygnał trofeum (finał, król
  strzelców, lider rankingu). Codzienny akcent to gradient fiolet → cyjan → limonka.
- **Stan „na żywo”** komunikowany zawsze trzema sygnałami: kolor + pulsująca
  kropka + tekst (nigdy sam kolor).
- **Wynik meczu jest największym elementem karty** — reszta informacji układa się wokół.
- Promienie 10 / 16 / 24 / 32 px, odstępy z siatki 4 px, kontrast tekstu ≥ 4.5:1
  w obu motywach, widoczny focus, respektowane `prefers-reduced-motion`.

## Dane

Wyniki, tabela grupy A, drabinka i klasyfikacja strzelców pochodzą z
`data/match-center.json` oraz `data/matches.json` w tym repozytorium.
Statystyki meczu (posiadanie, xG), liczby typerów i pojemności stadionów są
poglądowe — służą wyłącznie prezentacji układu.

## Podgląd lokalny

```sh
npx http-server -p 8080 .
# następnie: http://127.0.0.1:8080/nova/
```

Po scaleniu do `main` makieta będzie dostępna pod `/nova/` na GitHub Pages.

## Ścieżka wdrożenia

1. Przeniesienie tokenów NOVA do `src/styles.css` obok warstwy Tailwind (bez zmian w komponentach React).
2. Nowa karta meczu i lista w zakładce „Mecze”, na danych z `match-center.json`.
3. Tabele, drabinka, typer i stadiony na wspólnych komponentach; stary arkusz wycofany.
