const Database = require("better-sqlite3");
const path = require("path");

// Create or open database file
const db = new Database(path.join(__dirname, "studentgig.db"));

// Create tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  skills TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gigs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  posted_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  gig_id INTEGER NOT NULL,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, gig_id)
);

CREATE TABLE IF NOT EXISTS saved_gigs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  gig_id INTEGER NOT NULL,
  UNIQUE(user_id, gig_id)
);
`);

console.log("✅ SQLite database initialized!");
module.exports = db;
