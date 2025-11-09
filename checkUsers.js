const Database = require("better-sqlite3");
const db = new Database("studentgig.db");

const rows = db.prepare("SELECT * FROM users").all();
console.log(rows);
