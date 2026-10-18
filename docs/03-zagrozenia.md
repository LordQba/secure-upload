# 3. Zagrożenia

Przegląd ataków na upload plików, które projekt pokrywa (wersja podatna ma je umożliwiać, zabezpieczona blokować). Szczegóły implementacji w [04-wersja-podatna.md](04-wersja-podatna.md) i [05-wersja-zabezpieczona.md](05-wersja-zabezpieczona.md).

| Atak | Na czym polega | Ryzyko |
|---|---|---|
| Unrestricted file upload | Serwer nie sprawdza typu/zawartości pliku — da się wgrać skrypt pod niewinnym rozszerzeniem (`shell.php.jpg`) | wykonanie kodu po stronie serwera, jeśli plik trafi w wykonywalne miejsce |
| Path traversal | Nazwa pliku zawiera `../`, serwer zapisuje go poza przeznaczonym katalogiem | nadpisanie dowolnego pliku na dysku serwera |
| Zbyt duży plik | Brak limitu rozmiaru | zapchanie dysku, spowolnienie serwera (poza scope są pełne testy DoS, ale sam limit sprawdzamy) |
| XSS przez SVG/HTML | SVG i HTML mogą zawierać JavaScript; otwarte w przeglądarce (np. jako podgląd) wykonują się jako kod strony | kradzież sesji/danych, jeśli plik jest potem serwowany bez właściwego `Content-Type` |
| IDOR / Broken Access Control | Serwer nie sprawdza, czy pobierający plik jest jego właścicielem, pliki da się zgadnąć po kolejnym ID | odczyt cudzych plików |
| SQL injection | Dane od użytkownika (np. nazwa pliku) trafiają do zapytania SQL bez parametryzacji | odczyt/modyfikacja bazy, obejście logiki aplikacji |

## Odniesienia

- OWASP ASVS 5.0.0 — wymagania dot. walidacji danych wejściowych (rozdz. 5), kontroli dostępu (rozdz. 4), obsługi plików (rozdz. 12).
- OWASP WSTG 4.2 — testowanie uploadu plików (WSTG-BUSL-09), path traversal (WSTG-ATHZ-01), SQL injection (WSTG-INPV-05).
- OWASP Top 10: A01 Broken Access Control, A03 Injection.
