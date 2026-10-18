# 7. Formularz (frontend)

Backend (`vulnerable` i `secure`) jest gotowy i przetestowany. Ten rozdział opisuje, co formularz we frontendzie musi zrobić, żeby się z nim poprawnie łączyć. Uruchomienie całości — [README.md](../README.md).

## Autoryzacja

Bez prawdziwego logowania. Każde żądanie do `/api/vulnerable/...` i `/api/secure/...` niesie nagłówek `X-User` z wartością `user1` lub `user2` (domyślnie `user1`, inna wartość → `401`). W UI wystarczy prosty przełącznik/select "zalogowany jako: user1 / user2", bez hasła.

## Endpointy (identyczne dla obu wersji, inny prefiks)

Prefiks: `/api/vulnerable` albo `/api/secure`.

| Metoda | Ścieżka | Opis |
|---|---|---|
| POST | `/upload` | multipart/form-data, pole pliku: `file` |
| GET | `/files` | lista plików (w `secure` tylko własnych) |
| GET | `/download/:id` | pobranie pliku |
| GET | `/ping` | `{ "version": "vulnerable" \| "secure" }` — do sprawdzenia połączenia |

### Upload — przykład

```js
const form = new FormData();
form.append('file', fileInput.files[0]);

const res = await fetch('http://127.0.0.1:3000/api/secure/upload', {
  method: 'POST',
  headers: { 'X-User': currentUser }, // 'user1' | 'user2'
  body: form,
});
const data = await res.json();
// 201: { id, name, size, type }  (secure nie zwraca "path")
// 201: { id, name, path, size, type }  (vulnerable zwraca "path")
```

Kody błędów, które formularz powinien obsłużyć (głównie w wersji `secure` — w `vulnerable` celowo prawie nic nie jest blokowane):

| Kod | Kiedy | Wersja |
|---|---|---|
| 400 | brak pliku w żądaniu | obie |
| 401 | nieznany `X-User` | obie |
| 413 | plik większy niż limit (domyślnie 5 MB, `MAX_FILE_SIZE_MB` w `.env`) | secure |
| 415 | typ pliku nierozpoznany/niezgodny z zawartością (dozwolone: jpg, jpeg, png, gif, pdf, txt) | secure |

### Lista plików

```js
const res = await fetch('http://127.0.0.1:3000/api/secure/files', {
  headers: { 'X-User': currentUser },
});
const files = await res.json();
// [{ id, original_name, mime_type, size, created_at }, ...]
// (vulnerable zwraca dodatkowo "owner" i pliki WSZYSTKICH użytkowników — to celowa dziura)
```

### Download

Zwykły link/`<a href>` wystarczy, to nie jest JSON tylko plik:
```html
<a href="http://127.0.0.1:3000/api/secure/download/3">Pobierz</a>
```
Uwaga: `fetch`/link nie wysyła nagłówka `X-User` z poziomu zwykłego `<a>` — jeśli trzeba go ustawić, pobieranie musi iść przez `fetch` + `Blob` + link tymczasowy, albo backend trzeba by rozszerzyć o inny sposób identyfikacji (poza obecnym zakresem). W testach i Burp/curl nagłówek ustawiamy ręcznie.

## Sugerowany układ UI

Jeden ekran, przełącznik u góry: **wersja podatna / zabezpieczona** (czyli po prostu zmiana prefiksu `/api/vulnerable` ↔ `/api/secure` w żądaniach) — to pozwala w sprawozdaniu pokazać na żywo różnicę w zachowaniu tego samego formularza. Pod spodem: wybór użytkownika (`user1`/`user2`), pole uploadu, lista plików z linkami do pobrania, miejsce na komunikat błędu (treść z `res.json().error`).

Walidacji po stronie przeglądarki (typ/rozmiar pliku) robić nie trzeba — i tak nic nie znaczy, bo serwer sam weryfikuje wszystko ponownie. Jeśli chcesz dodać coś dla wygody (np. podpowiedź limitu 5 MB), to wyłącznie kosmetyka UX, nie zabezpieczenie.
