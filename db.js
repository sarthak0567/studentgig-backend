const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// ✅ Use project directory (works safely on Render)
const dataDir = path.join(process.cwd(), "data");

// Make sure folder exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "studentgig.db");
console.log("✅ Database path:", dbPath);

const db = new Database(dbPath);

// === TABLES ===
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS gigs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  category TEXT,
  price TEXT,
  duration TEXT,
  description TEXT,
  posted_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`).run();

console.log("✅ Database initialized successfully");
module.exports = db;
