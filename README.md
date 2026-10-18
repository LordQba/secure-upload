# Secure Upload

Projekt P6: bezpieczne przesyłanie plików. Jedna aplikacja, dwie wersje uploadu: `vulnerable` (celowo podatna) i `secure` (zabezpieczona). Szczegóły w [docs/](docs/).

## Wymagania

- Node.js 20+ (testowane na 25)
- MySQL 8

## Uruchomienie krok po kroku

### 1. Baza danych (MySQL)

Potrzebujesz działającego lokalnie serwera MySQL i użytkownika z prawem tworzenia baz (najprościej: `root`).

Zaimportuj strukturę — polecenie samo tworzy bazę `secure_upload` i tabelę `files`:
```
mysql -u root -p < schema.sql
```
Zostaniesz zapytany o hasło roota. Jeśli root nie ma hasła, pomiń `-p`.

Sprawdzenie, że baza istnieje:
```
mysql -u root -p -e "USE secure_upload; SHOW TABLES;"
```
Powinna pokazać się tabela `files`.

### 2. Backend (`http://127.0.0.1:3000`)

```
cd backend
cp .env.example .env
npm install
```
Otwórz `backend/.env` i uzupełnij dane dostępowe do bazy (`DB_USER`, `DB_PASSWORD`) — reszta wartości domyślnych zwykle nie wymaga zmiany:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<twoje hasło roota>
DB_NAME=secure_upload
MAX_FILE_SIZE_MB=5
```

Uruchomienie (najpierw odpala pełny zestaw testów z coverage — `predev` w `package.json` — dopiero potem startuje serwer; patrz [Testy i lint](#testy-i-lint)):
```
npm run dev
```

Sprawdzenie, że backend żyje i widzi bazę:
```
curl http://127.0.0.1:3000/api/health
```
Powinno zwrócić `{"status":"ok","db":"ok"}`. Jeśli `db` to `"error"` — sprawdź dane w `.env` i czy MySQL w ogóle działa.

### 3. Frontend (`http://localhost:5173`)

```
cd frontend
npm install
npm run dev
```
Otwórz w przeglądarce adres, który wypisze Vite (domyślnie `http://localhost:5173`).

## Testy i lint

Wymaga działającej bazy (testy czyszczą tabelę `files` i foldery uploadu przed każdym testem).
```
cd backend
npm test          # Jest + Supertest, obie wersje API, z coverage
npm run lint       # ESLint + eslint-plugin-security
```

## Konta testowe

Bez prawdziwego logowania. Użytkownika wybiera nagłówek `X-User` (`user1` lub `user2`, domyślnie `user1`):
```
curl -H "X-User: user2" http://127.0.0.1:3000/api/secure/ping
```

## Uwaga

Serwer nasłuchuje tylko na `127.0.0.1`, bo wersja `vulnerable` jest naprawdę dziurawa. Nie zmieniaj na `0.0.0.0`.
