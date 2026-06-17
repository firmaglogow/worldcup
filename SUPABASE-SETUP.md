# Konta typerów - uruchomienie Supabase

Kod strony jest już przygotowany. Do uruchomienia logowania potrzebny jest
darmowy projekt Supabase.

## 1. Utwórz projekt

1. Wejdź na https://supabase.com/dashboard.
2. Wybierz `New project`.
3. Ustaw nazwę, np. `mistrzostwaswiata2026`.
4. Zapisz hasło do bazy i wybierz region w Europie.
5. Poczekaj na utworzenie projektu.

## 2. Utwórz tabele i zabezpieczenia

1. W Supabase otwórz `SQL Editor`.
2. Wybierz `New query`.
3. Wklej całą zawartość pliku `supabase/schema.sql`.
4. Kliknij `Run`.

Ten skrypt tworzy:

- profile i pseudonimy,
- typy 1/X/2,
- blokadę zmian po rozpoczęciu meczu,
- tabelę oficjalnych wyników,
- bezpieczny ranking,
- możliwość usunięcia konta.

## 3. Włącz kod e-mail

1. Otwórz `Authentication` -> `Email Templates`.
2. Wybierz szablon `Magic Link`.
3. W treści wiadomości umieść kod:

```html
<h2>Kod logowania do Mistrzostwa Świata 2026</h2>
<p>Twój kod logowania:</p>
<p style="font-size:32px;font-weight:700;letter-spacing:6px">{{ .Token }}</p>
<p>Kod jest jednorazowy. Nie przekazuj go innym osobom.</p>
```

4. Zapisz szablon.
5. W `Authentication` -> `URL Configuration` ustaw:
   - Site URL: `https://mistrzostwaswiata2026.pl`
   - Redirect URL: `https://mistrzostwaswiata2026.pl/**`

Uwaga: w niektórych darmowych projektach Supabase edycja szablonów e-mail może być zablokowana przez plan lub brak własnego SMTP. Jeśli panel zgłasza, że zmiana szablonu nie jest dostępna, trzeba najpierw podłączyć własny serwer SMTP albo zmienić plan projektu.

## 4. Podłącz stronę

1. Otwórz `Project Settings` -> `API`.
2. Skopiuj:
   - `Project URL`,
   - `Publishable key` albo starszy `anon public`.
3. W pliku `assets/supabase-config.js` uzupełnij:

```js
window.WC2026_SUPABASE = Object.freeze({
  url: "https://TWOJ-PROJEKT.supabase.co",
  publishableKey: "TWOJ_PUBLICZNY_KLUCZ",
});
```

Klucz publikowalny jest przeznaczony do użycia na stronie. Nigdy nie wpisuj do
tego pliku klucza `service_role`.

## 5. Podłącz automatyczne wyniki do rankingu

W repozytorium GitHub otwórz:

`Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

Dodaj dwa sekrety:

- `SUPABASE_URL` - ten sam Project URL,
- `SUPABASE_SERVICE_ROLE_KEY` - klucz `service_role` z ustawień API Supabase.

Klucz `service_role` pozostaje wyłącznie w sekretach GitHuba. Nie wolno
umieszczać go w kodzie strony.

W pliku `.github/workflows/update-match-center.yml`, bezpośrednio po kroku
`Pobierz bezpłatne wyniki`, dodaj:

```yaml
      - name: Zaktualizuj wyniki rankingu typerów
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: node scripts/sync-supabase-results.mjs
```

Następnie uruchom ręcznie workflow:

`Actions` -> `Automatyczna aktualizacja wyników` -> `Run workflow`

Po pierwszym uruchomieniu tabela meczów zostanie zasilona i logowanie będzie
gotowe do użycia.
