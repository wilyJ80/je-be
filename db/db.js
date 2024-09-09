const Database = require('better-sqlite3');
const db = new Database('./db/database.db', {verbose: console.log });

db.exec(`
	PRAGMA foreign_keys=ON;
	PRAGMA synchronous=ON;
	PRAGMA journal_mode=WAL;
`);

module.exports = db;
