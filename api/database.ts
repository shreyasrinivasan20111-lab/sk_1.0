import sqlite3 from 'sqlite3';
import path from 'path';

const DB_PATH = '/tmp/course_management.db';

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Classes table
    db.run(`
      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User-Class relationships
    db.run(`
      CREATE TABLE IF NOT EXISTS user_classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        class_id INTEGER,
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (class_id) REFERENCES classes (id)
      )
    `);

    // Materials table
    db.run(`
      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id INTEGER,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        file_path TEXT,
        uploaded_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (class_id) REFERENCES classes (id),
        FOREIGN KEY (uploaded_by) REFERENCES users (id)
      )
    `);

    // Practice sessions table
    db.run(`
      CREATE TABLE IF NOT EXISTS practice_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        class_id INTEGER,
        duration INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (class_id) REFERENCES classes (id)
      )
    `);

    // Insert default classes
    db.get("SELECT COUNT(*) as count FROM classes", [], (err, row: any) => {
      if (!err && row && row.count === 0) {
        const classes = [
          ['Kirtanam', 'Devotional singing and chanting practice'],
          ['Smaranam', 'Remembrance and contemplation exercises'],
          ['Pada Sevanam', 'Service at the feet of the divine'],
          ['Archanam', 'Worship and ritual practices'],
          ['Vandanam', 'Prayer and salutation techniques']
        ];

        const stmt = db.prepare("INSERT INTO classes (name, description) VALUES (?, ?)");
        classes.forEach(([name, description]) => {
          stmt.run(name, description);
        });
        stmt.finalize();
        console.log('Default classes inserted successfully');
      }
    });
  });
}
