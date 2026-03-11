const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
require('dotenv').config();

class Database {
    constructor() {
        if (!Database.instance) {
            this.dbPromise = open({
                filename: process.env.DB_NAME ? process.env.DB_NAME + '.sqlite' : path.join(__dirname, '..', '..', 'central_db.sqlite'),
                driver: sqlite3.Database
            }).then(async (db) => {
                console.log('Conexão com o banco de dados SQLite instanciada');
                await db.run('PRAGMA foreign_keys = ON');
                return db;
            });
            Database.instance = this;
        }

        return Database.instance;
    }

    async query(text, params = []) {
        const db = await this.dbPromise;
        const upperText = text.trim().toUpperCase();

        if (upperText.startsWith('SELECT') || upperText.startsWith('PRAGMA')) {
            const rows = await db.all(text, params);
            return { rows };
        } else {
            const result = await db.run(text, params);
            return {
                changes: result.changes,
                lastInsertRowid: result.lastID,
                rows: []
            };
        }
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;
