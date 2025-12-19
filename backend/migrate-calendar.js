const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'grade_manager.db');
const db = new Database(dbPath);

console.log('🔄 Creando sistema de calendario y eventos...\n');

try {
    // Tabla de eventos del calendario
    db.exec(`
        CREATE TABLE IF NOT EXISTS calendar_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            eventType TEXT DEFAULT 'class',
            startDate TEXT NOT NULL,
            endDate TEXT,
            startTime TEXT,
            endTime TEXT,
            subjectId INTEGER,
            subjectName TEXT,
            subjectColor TEXT,
            location TEXT,
            isRecurring INTEGER DEFAULT 0,
            recurringPattern TEXT,
            recurringDays TEXT,
            createdBy INTEGER,
            periodId INTEGER,
            isActive INTEGER DEFAULT 1,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE,
            FOREIGN KEY (periodId) REFERENCES academic_periods(id) ON DELETE CASCADE
        )
    `);
    console.log('✅ Tabla calendar_events creada');

    // Tabla de notificaciones
    db.exec(`
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'info',
            eventId INTEGER,
            subjectId INTEGER,
            isRead INTEGER DEFAULT 0,
            link TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (eventId) REFERENCES calendar_events(id) ON DELETE CASCADE,
            FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
        )
    `);
    console.log('✅ Tabla notifications creada');

    // Tabla de participantes de eventos (para saber quién tiene cada clase)
    db.exec(`
        CREATE TABLE IF NOT EXISTS event_participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            eventId INTEGER NOT NULL,
            userId INTEGER,
            studentId INTEGER,
            enrollmentId INTEGER,
            notified INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (eventId) REFERENCES calendar_events(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (enrollmentId) REFERENCES enrollments(id) ON DELETE CASCADE
        )
    `);
    console.log('✅ Tabla event_participants creada');

    console.log('\n✅ Migración de calendario completada exitosamente');
    console.log('\n📊 Nuevas tablas creadas:');
    console.log('   - calendar_events: Eventos del calendario');
    console.log('   - notifications: Sistema de notificaciones');
    console.log('   - event_participants: Participantes de eventos');
    
} catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
} finally {
    db.close();
}
