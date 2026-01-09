const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH_CUSTOM || path.join(__dirname, 'grade_manager.db');
console.log('📂 Usando base de datos en:', dbPath);
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
            password TEXT,
            phone TEXT,
            year INTEGER NOT NULL,
            enrollmentDate TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabla de períodos académicos
    db.exec(`
        CREATE TABLE IF NOT EXISTS academic_periods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            startDate TEXT,
            endDate TEXT,
            year INTEGER,
            quarter INTEGER,
            isActive INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Registrar períodos por defecto si no hay ninguno
    const periodsCount = db.prepare('SELECT COUNT(*) as count FROM academic_periods').get().count;
    if (periodsCount === 0) {
        db.prepare(`
            INSERT INTO academic_periods (name, code, startDate, endDate, year, quarter, isActive)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run('Semestre 2-2025', '2025-2', '2025-08-01', '2025-12-20', 2025, 2, 1);
    }

    // Tabla de registro histórico de estudiantes por período
    db.exec(`
        CREATE TABLE IF NOT EXISTS student_period_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId INTEGER NOT NULL,
            periodId INTEGER NOT NULL,
            studentName TEXT,
            matricula TEXT,
            email TEXT,
            phone TEXT,
            enrollmentDate TEXT,
            status TEXT, -- active, completed, withdrawn, suspended
            completionDate TEXT,
            averageGrade REAL,
            totalCredits INTEGER,
            notes TEXT,
            updatedAt TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (periodId) REFERENCES academic_periods(id) ON DELETE CASCADE
        )
    `);

    // Tabla de inscripciones históricas por período
    db.exec(`
        CREATE TABLE IF NOT EXISTS period_enrollments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId INTEGER NOT NULL,
            periodId INTEGER NOT NULL,
            subjectId INTEGER NOT NULL,
            studentName TEXT,
            subjectName TEXT,
            subjectCode TEXT,
            teacher TEXT,
            enrollmentDate TEXT,
            status TEXT, -- in_progress, passed, failed, withdrawn
            finalGrade REAL,
            completionDate TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (periodId) REFERENCES academic_periods(id) ON DELETE CASCADE,
            FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
        )
    `);

    // Tabla de configuraciones globales
    db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    `);

    // Inicializar configuraciones por defecto
    const defaultSettings = [
        { key: 'grading_ranges', value: JSON.stringify([
            { letter: 'A', min: 90, max: 100, description: 'Excelente' },
            { letter: 'B', min: 80, max: 89.9, description: 'Muy Bueno' },
            { letter: 'C', min: 70, max: 79.9, description: 'Bueno' },
            { letter: 'D', min: 60, max: 69.9, description: 'Suficiente' },
            { letter: 'F', min: 0, max: 59.9, description: 'Insuficiente' }
        ])},
        { key: 'alerts_enabled', value: 'true' },
        { key: 'low_score_threshold', value: '70' }
    ];

    const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
    defaultSettings.forEach(setting => {
        insertSetting.run(setting.key, setting.value);
    });

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

    // Tabla de asistencia
    db.exec(`
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId INTEGER NOT NULL,
            subjectId INTEGER NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL,
            notes TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
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
