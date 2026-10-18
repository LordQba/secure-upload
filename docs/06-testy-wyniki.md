# 6. Testy i wyniki

Testy automatyczne: Jest + Supertest, w [backend/tests/](../backend/tests/). Jeden zestaw testów (`describe.each(['vulnerable', 'secure'])`) odpalany na obu wersjach API, bez mockowania bazy — testy biją w prawdziwy Express (przez Supertest, bez nasłuchiwania na porcie) i prawdziwy lokalny MySQL. Przed każdym testem tabela `files` i foldery uploadu są czyszczone ([backend/tests/helpers.ts](../backend/tests/helpers.ts)), żeby testy nie wpływały na siebie nawzajem.

Uruchomienie: `cd backend && npm test` (lint: `npm run lint`).

## Wyniki ataków (przed / po)

| # | Scenariusz | Wersja podatna | Wersja zabezpieczona |
|---|---|---|---|
| 1 | Podmiana rozszerzenia (`shell.php.jpg`) | przyjęty (`201`) | odrzucony (`415`) |
| 2 | Path traversal w nazwie pliku | plik zapisany poza folderem uploadu | plik pod losowym UUID, traversal bez efektu |
| 3 | Za duży plik (6 MB) | przyjęty, brak limitu | odrzucony (`413`), limit z `.env` |
| 4 | SVG/HTML z XSS | przyjęty | odrzucony (`415`) |
| 5 | Pobranie cudzego pliku przez zgadnięcie ID (IDOR) | pobranie się udaje (`200`) | `404`, właściciel sprawdzany w zapytaniu |
| 6 | SQL injection w nazwie pliku | zapytanie się wysypuje (`500`) | zapisane bezpiecznie jako zwykły tekst (`201`) |
| 7 | Testy automatyczne dla obu wersji | 29 testów, wszystkie przechodzą (patrz niżej) | |

Scenariusze 1–6 pokrywają też przypadki brzegowe: brak pliku (`400`), nieznany użytkownik (`401`), nieistniejące/nieprawidłowe ID (`404`/`400`), poprawne pliki PNG/GIF/PDF w wersji secure (przyjęte).

## Pokrycie kodu (coverage)

| Metryka | Wynik | Cel |
|---|---|---|
| Statements | 97,6% | 80% |
| Branches | 87,9% | 80% |
| Functions | 100% | 80% |
| Lines | 97,5% | 80% |

Nieobjęte testami fragmenty to głównie gałąź błędu połączenia z bazą w `/api/health` (wymagałaby celowego zerwania połączenia z MySQL w trakcie testu) oraz domyślne wartości zmiennych środowiskowych w `db.ts` — oba przypadki pominięte świadomie jako nieopłacalne do testowania w tym zakresie.

## Lint

ESLint (`typescript-eslint` + `eslint-plugin-security`) na backendzie: `npm run lint` — zero błędów i ostrzeżeń. Dwa miejsca z wyjątkiem od reguły `security/detect-non-literal-fs-filename` są udokumentowane inline w kodzie (ścieżka zapisu pliku w wersji secure jest w całości generowana przez serwer, nie pochodzi od klienta).

> **[ZRZUT EKRANU DO DODANIA: wynik `npm test` z coverage i `npm run lint`]**
