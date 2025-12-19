const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'grade_manager.db');
const db = new Database(dbPath);

console.log('🔄 Agregando tablas de registro histórico...\n');

try {
    // Tabla de cuatrimestres/períodos académicos
    db.exec(`
        CREATE TABLE IF NOT EXISTS academic_periods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            startDate TEXT NOT NULL,
            endDate TEXT NOT NULL,
            year INTEGER NOT NULL,
            quarter INTEGER NOT NULL,
            isActive INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✅ Tabla academic_periods creada');

    // Tabla de registro histórico de estudiantes por período
    db.exec(`
        CREATE TABLE IF NOT EXISTS student_period_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId INTEGER NOT NULL,
            periodId INTEGER NOT NULL,
            studentName TEXT NOT NULL,
            matricula TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            status TEXT DEFAULT 'active',
            enrollmentDate TEXT,
            completionDate TEXT,
            averageGrade REAL,
            totalCredits INTEGER DEFAULT 0,
            notes TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (periodId) REFERENCES academic_periods(id) ON DELETE CASCADE,
            UNIQUE(studentId, periodId)
        )
    `);
    console.log('✅ Tabla student_period_records creada');

    // Tabla de inscripciones por período (histórico)
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
            finalGrade REAL,
            status TEXT DEFAULT 'in_progress',
            enrollmentDate TEXT,
            completionDate TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (periodId) REFERENCES academic_periods(id) ON DELETE CASCADE,
            FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
        )
    `);
    console.log('✅ Tabla period_enrollments creada');

    // Agregar columna periodId a enrollments si no existe
    const enrollmentsInfo = db.prepare("PRAGMA table_info(enrollments)").all();
    const hasPeriodId = enrollmentsInfo.some(col => col.name === 'periodId');
    
    if (!hasPeriodId) {
        db.exec(`ALTER TABLE enrollments ADD COLUMN periodId INTEGER`);
        console.log('✅ Columna periodId agregada a enrollments');
    } else {
        console.log('✅ La columna periodId ya existe en enrollments');
    }

    // Agregar columna status a students si no existe
    const studentsInfo = db.prepare("PRAGMA table_info(students)").all();
    const hasStatus = studentsInfo.some(col => col.name === 'status');
    
    if (!hasStatus) {
        db.exec(`ALTER TABLE students ADD COLUMN status TEXT DEFAULT 'active'`);
        console.log('✅ Columna status agregada a students');
    } else {
        console.log('✅ La columna status ya existe en students');
    }

    // Agregar columna graduationDate a students si no existe
    const hasGraduationDate = studentsInfo.some(col => col.name === 'graduationDate');
    
    if (!hasGraduationDate) {
        db.exec(`ALTER TABLE students ADD COLUMN graduationDate TEXT`);
        console.log('✅ Columna graduationDate agregada a students');
    } else {
        console.log('✅ La columna graduationDate ya existe en students');
    }

    // Crear período académico actual si no existe
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentQuarter = Math.ceil(currentMonth / 3);
    
    const periodCode = `${currentYear}-Q${currentQuarter}`;
    const existingPeriod = db.prepare('SELECT * FROM academic_periods WHERE code = ?').get(periodCode);
    
    if (!existingPeriod) {
        const quarterStartMonth = (currentQuarter - 1) * 3 + 1;
        const quarterEndMonth = currentQuarter * 3;
        
        const startDate = new Date(currentYear, quarterStartMonth - 1, 1).toISOString();
        const endDate = new Date(currentYear, quarterEndMonth, 0).toISOString();
        
        db.prepare(`
            INSERT INTO academic_periods (name, code, startDate, endDate, year, quarter, isActive)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            `Cuatrimestre ${currentQuarter} - ${currentYear}`,
            periodCode,
            startDate,
            endDate,
            currentYear,
            currentQuarter,
            1
        );
        console.log(`✅ Período académico actual creado: ${periodCode}`);
    } else {
        console.log(`✅ Período académico actual ya existe: ${periodCode}`);
    }

    console.log('\n✅ Migración de registro histórico completada exitosamente');
    console.log('\n📊 Nuevas tablas creadas:');
    console.log('   - academic_periods: Gestión de cuatrimestres');
    console.log('   - student_period_records: Registro histórico de estudiantes');
    console.log('   - period_enrollments: Inscripciones por período');
    
} catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
} finally {
    db.close();
}
