# 5. Wersja zabezpieczona

Endpointy pod `/api/secure/...` w [backend/src/routes/secure.ts](../backend/src/routes/secure.ts): `POST /upload`, `GET /files` (lista), `GET /download/:id`. Ten sam kształt API co w wersji podatnej, ale z ochronami — każda oznaczona komentarzem `// SECURE:`.

## Ochrony (atak → mechanizm)

| Atak z [03-zagrozenia.md](03-zagrozenia.md) | Ochrona |
|---|---|
| Unrestricted file upload / podmiana rozszerzenia | Typ pliku rozpoznawany po realnej zawartości (magic bytes), nie po rozszerzeniu ani nagłówku `Content-Type` od klienta. Dozwolona wąska lista: jpg, jpeg, png, gif, pdf, txt. Plik `.txt` dodatkowo odrzucany, jeśli zaczyna się od `<` (HTML/SVG podszywający się pod tekst) |
| Path traversal | Plik zapisywany pod losową nazwą (`crypto.randomUUID()`), oryginalna nazwa z żądania nigdy nie trafia do ścieżki na dysku |
| Za duży plik | Limit rozmiaru w Multerze, wartość z `.env` (`MAX_FILE_SIZE_MB`, domyślnie 5 MB). Przekroczenie zwraca czysty `413 { error }`, nie `500` ze stack trace'em |
| XSS przez SVG/HTML | SVG i HTML nie są na liście dozwolonych typów — odrzucone niezależnie od deklarowanego rozszerzenia czy MIME |
| SQL injection | Zapytania przez `pool.query(sql, [parametry])` — dane od użytkownika nigdy nie są sklejane do treści SQL |
| IDOR / Broken Access Control | `GET /files` zwraca tylko pliki właściciela (`WHERE owner = ?`). `GET /download/:id` dokłada `AND owner = ?` do zapytania i zwraca `404` (nie `403`) dla cudzego pliku, żeby nie zdradzać, czy plik w ogóle istnieje |

## Testy ręczne

Te same scenariusze co w wersji podatnej, sprawdzone ręcznie (curl, konta `user1`/`user2`):

- `shell.php.jpg` z fałszywą zawartością → `415`, odrzucony. Prawdziwy `.jpg` (zgodne magic bytes) → `201`, przyjęty.
- Nazwa pliku z `../../` → plik zapisany pod UUID, żadnej ścieżki poza `uploads/secure/`.
- Plik 6 MB przy limicie 5 MB → `413` z czytelnym komunikatem, bez wycieku stack trace'u.
- SVG z `onload=alert(1)` oraz HTML ze `<script>` pod rozszerzeniem `.txt` → `415` w obu przypadkach.
- Nazwa pliku z wstrzykniętym SQL-em (`a','x','x','x',1,'x');-- .txt`) → zapisana w bazie jako zwykły tekst, zero wpływu na zapytanie (w wersji podatnej ten sam string przerywał zapytanie błędem składni).
- `user2` nie widzi plików `user1` w `GET /files`; próba pobrania pliku `user1` po ID zwraca `404`.

Odniesienie do OWASP: ASVS 5.0.0 rozdz. 5 (walidacja wejścia), rozdz. 12 (pliki), rozdz. 4 (kontrola dostępu); WSTG-BUSL-09 (upload), WSTG-ATHZ-01 (traversal), WSTG-INPV-05 (SQLi) — jak w [03-zagrozenia.md](03-zagrozenia.md), tu już zablokowane.

> **[ZRZUT EKRANU DO DODANIA: te same ataki co w 04, teraz z odpowiedzią 415/404/413 w wersji secure]**
