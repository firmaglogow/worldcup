# Automatyczne wyniki i statystyki meczów

Strona jest przygotowana do automatycznego pobierania danych z API-Football.
Do uruchomienia potrzebny jest jednorazowo klucz API.

## Włączenie aktualizacji

1. Załóż konto na https://dashboard.api-football.com/register.
2. Skopiuj swój klucz API-Football.
3. Otwórz repozytorium `firmaglogow/worldcup` w GitHubie.
4. Wejdź w `Settings` → `Secrets and variables` → `Actions`.
5. Kliknij `New repository secret`.
6. W polu nazwy wpisz dokładnie `API_FOOTBALL_KEY`.
7. W polu wartości wklej klucz i zapisz.
8. Otwórz zakładkę `Actions`, wybierz workflow
   `Automatyczna aktualizacja wyników` i kliknij `Run workflow`.

Od tego momentu GitHub będzie sprawdzał dane co 30 minut. Gdy pojawi się
nowy wynik, strona zaktualizuje wynik meczu, tabele grupowe, postęp turnieju
oraz centrum meczu ze strzelcami, statystykami i składami.

Klucz pozostaje zapisany jako sekret GitHuba i nie trafia do kodu strony.
