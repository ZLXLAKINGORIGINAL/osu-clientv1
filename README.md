# osu!dev Auth Server

Eigener Login/Register Server für deinen osu! Custom Client.

---

## Was du bekommst

- `POST /api/register` — Account erstellen
- `POST /api/login` — Einloggen, bekommt JWT Token zurück
- `GET  /api/me` — Token verifizieren (für C# Client)
- `GET  /api/health` — Health Check
- SQLite Datenbank (alle User werden gespeichert)
- Fertige Login/Register Website unter `/`

---

## Schritt-für-Schritt Deploy auf Railway (kostenlos)

### 1. GitHub Repo erstellen
1. Geh zu https://github.com/new
2. Name z.B. `osu-auth-server`
3. **Public** oder Private — egal
4. Erstellen klicken

### 2. Code hochladen
```bash
# Im osu-auth Ordner:
git init
git add .
git commit -m "osu auth server"
git remote add origin https://github.com/DEIN-NAME/osu-auth-server.git
git push -u origin main
```

### 3. Railway Setup
1. Geh zu https://railway.app
2. "Login with GitHub" klicken
3. "New Project" → "Deploy from GitHub repo"
4. Dein `osu-auth-server` Repo auswählen
5. Railway deployt automatisch!

### 4. Deine URL herausfinden
1. In Railway auf dein Projekt klicken
2. "Settings" → "Domains"
3. "Generate Domain" klicken
4. Du bekommst eine URL wie: `osu-auth-server-production.up.railway.app`

### 5. DevelopmentEndpointConfiguration.cs anpassen
```csharp
private const string CustomServerUrl = "https://osu-auth-server-production.up.railway.app";
```
Ersetze `osu-auth-server-production.up.railway.app` mit deiner echten Railway URL!

### 6. Fertig!
- Website: `https://deine-url.up.railway.app`
- Register/Login auf der Website
- C# Client verbindet sich mit deinem Server

---

## Lokaler Test (ohne Deploy)

```bash
npm install
node server.js
# → öffne http://localhost:3000
```

---

## API Endpoints

### Register
```
POST /api/register
Content-Type: application/json

{ "username": "dein_name", "email": "du@mail.com", "password": "geheim" }
```

### Login
```
POST /api/login
Content-Type: application/json

{ "username": "dein_name", "password": "geheim" }

→ gibt zurück: { "token": "JWT...", "user": { "id": 1, "username": "..." } }
```

### Token verifizieren
```
GET /api/me
Authorization: Bearer <dein_jwt_token>
```
