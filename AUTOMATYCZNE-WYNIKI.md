# Automatyczne wyniki meczów

Strona pobiera bezpłatne dane z OpenFootball (licencja CC0) oraz WorldCup26.
Nie jest potrzebny klucz API ani płatna subskrypcja.

## Zakres danych

- wynik meczu i wynik do przerwy,
- strzelcy dostępni w OpenFootball,
- status meczu udostępniany przez WorldCup26,
- automatyczna aktualizacja tabel, postępu turnieju i wyników.

GitHub sprawdza źródła co 5 minut. Po zgłoszeniu przerwy bieżący rezultat
zostaje zapisany jako wynik pierwszej połowy. Po zakończeniu spotkania
zapisywany jest wynik końcowy. Nowy commit powstaje tylko wtedy, gdy wynik
lub status spotkania faktycznie się zmieni.

Są to źródła społecznościowe, dlatego dane mogą pojawić się z opóźnieniem.
Bezpłatny wariant nie gwarantuje posiadania piłki, liczby strzałów, kartek,
pełnych składów ani innych zaawansowanych statystyk.
