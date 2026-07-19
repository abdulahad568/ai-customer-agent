import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// database.sqlite is created in the project root
const db = new Database(path.join(__dirname, "../../../database.sqlite"));

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    ticket      TEXT NOT NULL,
    sentiment   TEXT NOT NULL,
    intent      TEXT NOT NULL,
    priority    TEXT NOT NULL,
    resolution  TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
