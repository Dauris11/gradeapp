const Database = require('better-sqlite3');
const path = require('path');

let db;

function init(dbPath) {
  if (db) return db; // already initialized
  
  // If no path provided (e.g. dev fallback if not passed), handle it? 
  // But main should pass it.
  
  console.log('Initializing DB at:', dbPath);
  db = new Database(dbPath, { verbose: console.log });
  db.pragma('journal_mode = WAL');
  
  initSchema();
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call init(path) first.');
  }
  return db;
}

function initSchema() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user', -- 'admin', 'teacher'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      enrollment_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      teacher_name TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      term TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enrollment_id INTEGER NOT NULL,
      type TEXT NOT NULL, -- 'exam', 'homework', 'project', 'participation'
      score REAL NOT NULL,
      max_score REAL DEFAULT 100,
      date DATE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      start_date DATETIME NOT NULL,
      end_date DATETIME,
      type TEXT, -- 'exam', 'holiday', 'class'
      description TEXT
    );
  `;
  db.exec(schema);
  console.log('Database initialized successfully');
}

module.exports = { init, getDb };
