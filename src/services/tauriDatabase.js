import Database from '@tauri-apps/plugin-sql';

let db = null;

// Inicializar base de datos
export async function initDatabase() {
    if (db) return db;
    
    try {
        db = await Database.load('sqlite:grade_manager.db');
        
        // Crear tablas
        await createTables();
        
        console.log('✅ Base de datos SQLite inicializada');
        return db;
    } catch (error) {
        console.error('Error inicializando base de datos:', error);
        throw error;
    }
}

async function createTables() {
    // Tabla de usuarios
    await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            fullName TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            lastLogin TEXT
        )
    `);
    
    // Tabla de estudiantes
    await db.execute(`
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
    await db.execute(`
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
    await db.execute(`
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
    await db.execute(`
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
    const users = await db.select('SELECT * FROM users WHERE role = $1', ['admin']);
    if (users.length === 0) {
        await db.execute(
            `INSERT INTO users (username, password, email, role, fullName) 
             VALUES ($1, $2, $3, $4, $5)`,
            ['admin', 'admin123', 'admin@gradeapp.com', 'admin', 'Administrador']
        );
        console.log('✅ Usuario admin creado');
    }
}

// API de Estudiantes
export const studentsAPI = {
    getAll: async () => {
        const db = await initDatabase();
        return await db.select('SELECT * FROM students ORDER BY name');
    },
    
    getById: async (id) => {
        const db = await initDatabase();
        const result = await db.select('SELECT * FROM students WHERE id = $1', [id]);
        return result[0] || null;
    },
    
    create: async (student) => {
        const db = await initDatabase();
        
        // Generar matrícula
        const year = new Date().getFullYear();
        const result = await db.select(
            'SELECT MAX(CAST(SUBSTR(matricula, 7) AS INTEGER)) as maxSeq FROM students WHERE matricula LIKE $1',
            [`GE${year}%`]
        );
        const sequential = (result[0]?.maxSeq || 0) + 1;
        const matricula = `GE${year}${String(sequential).padStart(4, '0')}`;
        
        await db.execute(
            `INSERT INTO students (matricula, name, email, phone, year, enrollmentDate) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [matricula, student.name, student.email, student.phone || '', year, student.enrollmentDate || new Date().toISOString()]
        );
        
        const newStudent = await db.select('SELECT * FROM students WHERE matricula = $1', [matricula]);
        return newStudent[0];
    },
    
    update: async (id, updates) => {
        const db = await initDatabase();
        const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
        const values = [...Object.values(updates), id];
        
        await db.execute(
            `UPDATE students SET ${fields} WHERE id = $${values.length}`,
            values
        );
        
        return await studentsAPI.getById(id);
    },
    
    delete: async (id) => {
        const db = await initDatabase();
        await db.execute('DELETE FROM students WHERE id = $1', [id]);
        return true;
    }
};

// API de Materias
export const subjectsAPI = {
    getAll: async () => {
        const db = await initDatabase();
        const subjects = await db.select('SELECT * FROM subjects ORDER BY name');
        
        return subjects.map(s => ({
            ...s,
            components: s.components ? JSON.parse(s.components) : []
        }));
    },
    
    getById: async (id) => {
        const db = await initDatabase();
        const result = await db.select('SELECT * FROM subjects WHERE id = $1', [id]);
        if (!result[0]) return null;
        
        return {
            ...result[0],
            components: result[0].components ? JSON.parse(result[0].components) : []
        };
    },
    
    create: async (subject) => {
        const db = await initDatabase();
        const colors = [
            '#3B82F6, #2563EB',
            '#22C55E, #16A34A',
            '#A855F7, #9333EA',
            '#F97316, #EA580C',
            '#EC4899, #DB2777',
            '#6366F1, #4F46E5'
        ];
        
        const count = await db.select('SELECT COUNT(*) as count FROM subjects');
        const color = colors[count[0].count % colors.length];
        
        const components = subject.components || [
            { id: 1, name: 'Tareas', type: 'numeric', weight: 40, maxScore: 100 },
            { id: 2, name: 'Exámenes', type: 'numeric', weight: 60, maxScore: 100 }
        ];
        
        await db.execute(
            `INSERT INTO subjects (name, code, credits, schedule, teacher, cycle, color, components) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                subject.name,
                subject.code,
                subject.credits || '',
                subject.schedule || '',
                subject.teacher || '',
                subject.cycle || 'First cycle',
                color,
                JSON.stringify(components)
            ]
        );
        
        const newSubject = await db.select('SELECT * FROM subjects WHERE code = $1', [subject.code]);
        return {
            ...newSubject[0],
            components: JSON.parse(newSubject[0].components)
        };
    },
    
    update: async (id, updates) => {
        const db = await initDatabase();
        
        if (updates.components) {
            updates.components = JSON.stringify(updates.components);
        }
        
        const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
        const values = [...Object.values(updates), id];
        
        await db.execute(
            `UPDATE subjects SET ${fields} WHERE id = $${values.length}`,
            values
        );
        
        return await subjectsAPI.getById(id);
    },
    
    delete: async (id) => {
        const db = await initDatabase();
        await db.execute('DELETE FROM subjects WHERE id = $1', [id]);
        return true;
    }
};

// API de Inscripciones
export const enrollmentsAPI = {
    getAll: async () => {
        const db = await initDatabase();
        return await db.select('SELECT * FROM enrollments ORDER BY id');
    },
    
    create: async (enrollment) => {
        const db = await initDatabase();
        
        await db.execute(
            `INSERT INTO enrollments (studentId, studentName, subjectId, subjectName, subjectCode, teacher, color, enrollmentDate) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                enrollment.studentId,
                enrollment.studentName,
                enrollment.subjectId,
                enrollment.subjectName,
                enrollment.subjectCode,
                enrollment.teacher || '',
                enrollment.color || '',
                enrollment.enrollmentDate || new Date().toISOString()
            ]
        );
        
        const result = await db.select('SELECT * FROM enrollments ORDER BY id DESC LIMIT 1');
        return result[0];
    },
    
    delete: async (id) => {
        const db = await initDatabase();
        await db.execute('DELETE FROM enrollments WHERE id = $1', [id]);
        return true;
    }
};

// API de Calificaciones
export const gradesAPI = {
    getAll: async () => {
        const db = await initDatabase();
        return await db.select('SELECT * FROM grades ORDER BY date DESC');
    },
    
    getByEnrollment: async (enrollmentId) => {
        const db = await initDatabase();
        return await db.select('SELECT * FROM grades WHERE enrollmentId = $1 ORDER BY date', [enrollmentId]);
    },
    
    create: async (grade) => {
        const db = await initDatabase();
        
        await db.execute(
            `INSERT INTO grades (enrollmentId, studentId, componentId, componentName, type, name, score, maxScore, date, notes) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                grade.enrollmentId,
                grade.studentId || 0,
                grade.componentId || null,
                grade.componentName || '',
                grade.type || 'assignment',
                grade.name,
                grade.score,
                grade.maxScore || 100,
                grade.date || new Date().toISOString(),
                grade.notes || ''
            ]
        );
        
        const result = await db.select('SELECT * FROM grades ORDER BY id DESC LIMIT 1');
        return result[0];
    },
    
    update: async (id, updates) => {
        const db = await initDatabase();
        const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
        const values = [...Object.values(updates), id];
        
        await db.execute(
            `UPDATE grades SET ${fields} WHERE id = $${values.length}`,
            values
        );
        
        const result = await db.select('SELECT * FROM grades WHERE id = $1', [id]);
        return result[0];
    },
    
    delete: async (id) => {
        const db = await initDatabase();
        await db.execute('DELETE FROM grades WHERE id = $1', [id]);
        return true;
    },
    
    calculateAccumulated: (enrollmentId) => {
        return {
            assignmentAvg: 0,
            examAvg: 0,
            accumulated: 0,
            totalAssignments: 0,
            totalExams: 0
        };
    }
};

export default { initDatabase, studentsAPI, subjectsAPI, enrollmentsAPI, gradesAPI };
