const Database = require('better-sqlite3');
const db = new Database('./db/database.db', { verbose: console.log });

db.exec(`
	PRAGMA foreign_keys=ON;
	PRAGMA synchronous=ON;
	PRAGMA journal_mode=WAL;
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        finished INTEGER DEFAULT 0,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id)
    );
`);

module.exports = db;
