import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  const db = await open({
    filename: path.join(__dirname, '..', 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS personnel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        first_name TEXT,
        last_name TEXT,
        position TEXT,
        department TEXT,
        email TEXT,
        phone TEXT,
        summary TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS personnel_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        proficiency INTEGER NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS personnel_experience (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER,
        position TEXT NOT NULL,
        organization TEXT,
        start_date TEXT,
        end_date TEXT,
        description TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS personnel_education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER,
        degree TEXT NOT NULL,
        major TEXT,
        institution TEXT,
        year TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS personnel_certifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER,
        name TEXT NOT NULL,
        issuer TEXT,
        year TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
    );
  `);

  console.log('SQLite Database initialized successfully.');
}

initDb().catch(console.error);
