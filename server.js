const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const db = new Database('osu_users.db');

// ── Setup DB ──────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const JWT_SECRET = process.env.JWT_SECRET || 'osu-dev-secret-change-in-production';

// ── Auth Middleware ───────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Kein Token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token ungültig' });
  }
}

// ── REGISTER ─────────────────────────────────────────────────────────────
// POST /api/register
// Body: { username, email, password }
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: 'Alle Felder ausfüllen' });

  if (password.length < 6)
    return res.status(400).json({ error: 'Passwort mind. 6 Zeichen' });

  if (username.length < 3 || username.length > 20)
    return res.status(400).json({ error: 'Username 3–20 Zeichen' });

  const hash = await bcrypt.hash(password, 10);

  try {
    const stmt = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    );
    const result = stmt.run(username, email, hash);
    const token = jwt.sign({ id: result.lastInsertRowid, username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: result.lastInsertRowid, username, email }
    });
  } catch (err) {
    if (err.message.includes('UNIQUE'))
      return res.status(409).json({ error: 'Username oder E-Mail bereits vergeben' });
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────
// POST /api/login
// Body: { username, password }
// Returns: { token, user } — token im C# Client verwenden!
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Alle Felder ausfüllen' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Falscher Username oder Passwort' });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    token,
    user: { id: user.id, username: user.username, email: user.email }
  });
});

// ── VERIFY TOKEN (für C# Client) ──────────────────────────────────────────
// GET /api/me  — Header: Authorization: Bearer <token>
app.get('/api/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User nicht gefunden' });
  res.json({ success: true, user });
});

// ── HEALTH CHECK ──────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// ── Frontend: alle anderen Routen → index.html ────────────────────────────
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`osu!dev Server läuft auf Port ${PORT}`));
