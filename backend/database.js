const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'grade_manager.db');
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Crear tablas
function initDatabase() {
    // Tabla de usuarios
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            fullName TEXT,
            isActive INTEGER DEFAULT 1,
            resetToken TEXT,
            resetTokenExpiry TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            lastLogin TEXT
        )
    `);

    // Tabla de estudiantes
    db.exec(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            matricula TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            year INTEGER NOT NULL,
            enrollmentDate TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabla de materias
    db.exec(`
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            credits TEXT,
            schedule TEXT,
            teacher TEXT,
            cycle TEXT DEFAULT 'First cycle',
            color TEXT,
            enrolled INTEGER DEFAULT 0,
            components TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabla de inscripciones
    db.exec(`
        CREATE TABLE IF NOT EXISTS enrollments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId INTEGER NOT NULL,
            studentName TEXT,
            subjectId INTEGER NOT NULL,
            subjectName TEXT,
            subjectCode TEXT,
            teacher TEXT,
            color TEXT,
            enrollmentDate TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
        )
    `);

    // Tabla de calificaciones
    db.exec(`
        CREATE TABLE IF NOT EXISTS grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            enrollmentId INTEGER NOT NULL,
            studentId INTEGER NOT NULL,
            componentId INTEGER,
            componentName TEXT,
            type TEXT,
            name TEXT,
            score REAL,
            maxScore REAL DEFAULT 100,
            date TEXT,
            notes TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (enrollmentId) REFERENCES enrollments(id) ON DELETE CASCADE,
            FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
        )
    `);

    // Crear usuario admin por defecto
    const adminExists = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');
    if (!adminExists) {
        db.prepare(`
            INSERT INTO users (username, password, email, role, fullName)
            VALUES (?, ?, ?, ?, ?)
        `).run('admin', 'admin123', 'admin@gradeapp.com', 'admin', 'Administrador');
        console.log('✅ Usuario admin creado');
    }

    console.log('✅ Base de datos inicializada');
}

module.exports = { db, initDatabase };
