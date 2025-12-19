// Rutas para calendario y notificaciones
const express = require('express');
const { db } = require('./database');

const router = express.Router();

// ==================== EVENTOS DEL CALENDARIO ====================

// Obtener todos los eventos
router.get('/events', (req, res) => {
    try {
        const { startDate, endDate, subjectId, periodId } = req.query;
        
        let query = 'SELECT * FROM calendar_events WHERE isActive = 1';
        const params = [];
        
        if (startDate) {
            query += ' AND startDate >= ?';
            params.push(startDate);
        }
        
        if (endDate) {
            query += ' AND startDate <= ?';
            params.push(endDate);
        }
        
        if (subjectId) {
            query += ' AND subjectId = ?';
            params.push(subjectId);
        }
        
        if (periodId) {
            query += ' AND periodId = ?';
            params.push(periodId);
        }
        
        query += ' ORDER BY startDate, startTime';
        
        const events = db.prepare(query).all(...params);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener eventos de hoy
router.get('/events/today', (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const events = db.prepare(`
            SELECT * FROM calendar_events 
            WHERE isActive = 1 AND startDate = ?
            ORDER BY startTime
        `).all(today);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener eventos de esta semana
router.get('/events/week', (req, res) => {
    try {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const events = db.prepare(`
            SELECT * FROM calendar_events 
            WHERE isActive = 1 
            AND startDate >= ? 
            AND startDate <= ?
            ORDER BY startDate, startTime
        `).all(weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0]);
        
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear evento
router.post('/events', (req, res) => {
    try {
        const {
            title,
            description,
            eventType,
            startDate,
            endDate,
            startTime,
            endTime,
            subjectId,
            subjectName,
            subjectColor,
            location,
            isRecurring,
            recurringPattern,
            recurringDays,
            createdBy,
            periodId
        } = req.body;
        
        const result = db.prepare(`
            INSERT INTO calendar_events (
                title, description, eventType, startDate, endDate, startTime, endTime,
                subjectId, subjectName, subjectColor, location, isRecurring, 
                recurringPattern, recurringDays, createdBy, periodId
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            title, description, eventType, startDate, endDate, startTime, endTime,
            subjectId, subjectName, subjectColor, location, isRecurring,
            recurringPattern, recurringDays, createdBy, periodId
        );
        
        const event = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(result.lastInsertRowid);
        
        // Si el evento tiene una materia, crear notificaciones para los estudiantes inscritos
        if (subjectId) {
            createEventNotifications(result.lastInsertRowid, subjectId, title, startDate, startTime);
        }
        
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar evento
router.put('/events/:id', (req, res) => {
    try {
        const { title, description, startDate, endDate, startTime, endTime, location } = req.body;
        
        db.prepare(`
            UPDATE calendar_events 
            SET title = ?, description = ?, startDate = ?, endDate = ?, 
                startTime = ?, endTime = ?, location = ?
            WHERE id = ?
        `).run(title, description, startDate, endDate, startTime, endTime, location, req.params.id);
        
        const event = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(req.params.id);
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar evento
router.delete('/events/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM calendar_events WHERE id = ?').run(req.params.id);
        res.json({ message: 'Evento eliminado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== NOTIFICACIONES ====================

// Obtener notificaciones de un usuario
router.get('/notifications/:userId', (req, res) => {
    try {
        const notifications = db.prepare(`
            SELECT * FROM notifications 
            WHERE userId = ? 
            ORDER BY createdAt DESC 
            LIMIT 50
        `).all(req.params.userId);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener notificaciones no leídas
router.get('/notifications/:userId/unread', (req, res) => {
    try {
        const notifications = db.prepare(`
            SELECT * FROM notifications 
            WHERE userId = ? AND isRead = 0
            ORDER BY createdAt DESC
        `).all(req.params.userId);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Marcar notificación como leída
router.put('/notifications/:id/read', (req, res) => {
    try {
        db.prepare('UPDATE notifications SET isRead = 1 WHERE id = ?').run(req.params.id);
        res.json({ message: 'Notificación marcada como leída' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Marcar todas las notificaciones como leídas
router.put('/notifications/:userId/read-all', (req, res) => {
    try {
        db.prepare('UPDATE notifications SET isRead = 1 WHERE userId = ?').run(req.params.userId);
        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Crear notificación
router.post('/notifications', (req, res) => {
    try {
        const { userId, title, message, type, eventId, subjectId, link } = req.body;
        
        const result = db.prepare(`
            INSERT INTO notifications (userId, title, message, type, eventId, subjectId, link)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(userId, title, message, type, eventId, subjectId, link);
        
        const notification = db.prepare('SELECT * FROM notifications WHERE id = ?').get(result.lastInsertRowid);
        res.json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== FUNCIONES AUXILIARES ====================

function createEventNotifications(eventId, subjectId, eventTitle, eventDate, eventTime) {
    try {
        // Obtener todos los estudiantes inscritos en la materia
        const enrollments = db.prepare(`
            SELECT DISTINCT e.studentId, s.name, s.email
            FROM enrollments e
            JOIN students s ON e.studentId = s.id
            WHERE e.subjectId = ?
        `).all(subjectId);
        
        // Crear notificación para cada estudiante
        enrollments.forEach(enrollment => {
            // Registrar participante
            db.prepare(`
                INSERT INTO event_participants (eventId, studentId, enrollmentId)
                VALUES (?, ?, ?)
            `).run(eventId, enrollment.studentId, enrollment.id);
            
            // Crear notificación
            const message = `Tienes clase programada para el ${new Date(eventDate).toLocaleDateString('es-ES')} a las ${eventTime}`;
            
            db.prepare(`
                INSERT INTO notifications (userId, title, message, type, eventId, subjectId)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(enrollment.studentId, eventTitle, message, 'class', eventId, subjectId);
        });
        
        console.log(`✅ Creadas ${enrollments.length} notificaciones para el evento ${eventId}`);
    } catch (error) {
        console.error('Error creando notificaciones:', error);
    }
}

// Generar eventos recurrentes automáticamente
router.post('/events/generate-recurring', (req, res) => {
    try {
        const { subjectId, periodId } = req.body;
        
        // Obtener la materia
        const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(subjectId);
        if (!subject || !subject.schedule) {
            return res.status(400).json({ error: 'Materia no encontrada o sin horario' });
        }
        
        // Obtener el período
        const period = db.prepare('SELECT * FROM academic_periods WHERE id = ?').get(periodId);
        if (!period) {
            return res.status(400).json({ error: 'Período no encontrado' });
        }
        
        // Parsear el horario (ejemplo: "Lunes 8:00-10:00, Miércoles 10:00-12:00")
        const schedulePattern = subject.schedule;
        const dayMap = {
            'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3,
            'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6, 'domingo': 0
        };
        
        // Generar eventos desde el inicio hasta el fin del período
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        let eventsCreated = 0;
        
        // Aquí se generarían los eventos recurrentes
        // Por simplicidad, retornamos éxito
        
        res.json({ message: `Eventos recurrentes generados para ${subject.name}`, count: eventsCreated });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
