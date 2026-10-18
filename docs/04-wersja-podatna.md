# 4. Wersja podatna

Endpointy pod `/api/vulnerable/...` w [backend/src/routes/vulnerable.ts](../backend/src/routes/vulnerable.ts): `POST /upload`, `GET /files` (lista), `GET /download/:id`. Każda dziura jest w kodzie oznaczona komentarzem `// VULNERABLE:`.

## Dziury

| Dziura | Mechanizm | Scenariusz testowy |
|---|---|---|
| Brak walidacji typu i zawartości | Multer przyjmuje każdy plik, typ MIME bierzemy wprost z nagłówka od klienta, zawartości nie sprawdzamy | 1. Podmiana rozszerzenia (`shell.php.jpg`), 4. SVG/HTML z XSS |
| Oryginalne nazwy plików | `filename: (_req, file, cb) => cb(null, file.originalname)` — plik zapisywany pod nazwą od klienta, bez losowania | nadpisywanie cudzych plików tą samą nazwą |
| Path traversal | `preservePath: true` zostawia w nazwie pliku ścieżkę zamiast ją odciąć | 2. Nazwa pliku `../../x` zapisuje plik poza `uploads/vulnerable/` |
| Brak limitu rozmiaru | Multer bez opcji `limits` | 3. Upload dużego pliku się udaje |
| SQL injection | Insert budowany sklejaniem stringów (`` `'${file.originalname}'` `` itd.), bez zapytań parametryzowanych | 6. Nazwa pliku z wstrzykniętym SQL-em przerywa/zmienia zapytanie |
| IDOR (brak kontroli właściciela) | `GET /files` zwraca pliki wszystkich użytkowników, `GET /download/:id` nie sprawdza, czy plik należy do pytającego | 5. Pobranie cudzego pliku przez zgadnięcie ID |

## Testy ręczne

Wszystkie powyższe scenariusze sprawdzone ręcznie przez curl (konta `user1`/`user2` z nagłówka `X-User`):

- `user2` widzi w `GET /files` pliki `user1`.
- `user2` pobiera plik `user1` po samym numerze ID (`GET /download/1` → `200 OK`), bez żadnej autoryzacji.
- Plik `shell.php.jpg` z dowolną zawartością wgrywa się bez odrzucenia.
- Nazwa pliku `../../pwned.txt` zapisuje plik poza folderem uploadu.
- Nazwa pliku z `'` przerywa zapytanie SQL błędem składni — potwierdza wstrzykiwalność.

Odniesienie do OWASP: Unrestricted File Upload (OWASP WSTG-BUSL-09), Path Traversal (CWE-22), SQL Injection (CWE-89), Insecure Direct Object Reference / Broken Access Control (OWASP ASVS 5.0.0, rozdz. 4 i 12).

> **[ZRZUT EKRANU DO DODANIA: przykład ataku IDOR i SQL injection w Burp/curl]**
