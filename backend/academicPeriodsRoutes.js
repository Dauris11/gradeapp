// Rutas para gestión de períodos académicos y registro histórico
const express = require('express');
const { db } = require('./database');

const router = express.Router();

// ==================== PERÍODOS ACADÉMICOS ====================

// Obtener todos los períodos académicos
router.get('/periods', (req, res) => {
    try {
        const periods = db.prepare(`
            SELECT *, 
                   (SELECT COUNT(*) FROM student_period_records WHERE periodId = academic_periods.id) as studentCount
            FROM academic_periods 
            ORDER BY year DESC, quarter DESC
        `).all();
        res.json(periods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener período activo
router.get('/periods/active', (req, res) => {
    try {
        const period = db.prepare('SELECT * FROM academic_periods WHERE isActive = 1').get();
        res.json(period || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear nuevo período académico
router.post('/periods', (req, res) => {
    try {
        const { name, code, startDate, endDate, year, quarter } = req.body;
        
        const result = db.prepare(`
            INSERT INTO academic_periods (name, code, startDate, endDate, year, quarter, isActive)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        `).run(name, code, startDate, endDate, year, quarter);
        
        const period = db.prepare('SELECT * FROM academic_periods WHERE id = ?').get(result.lastInsertRowid);
        res.json(period);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Activar un período académico (desactiva los demás)
router.post('/periods/:id/activate', (req, res) => {
    try {
        // Desactivar todos los períodos
        db.prepare('UPDATE academic_periods SET isActive = 0').run();
        
        // Activar el período seleccionado
        db.prepare('UPDATE academic_periods SET isActive = 1 WHERE id = ?').run(req.params.id);
        
        const period = db.prepare('SELECT * FROM academic_periods WHERE id = ?').get(req.params.id);
        res.json(period);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== REGISTRO HISTÓRICO DE ESTUDIANTES ====================

// Obtener registros de estudiantes por período
router.get('/periods/:periodId/students', (req, res) => {
    try {
        const records = db.prepare(`
            SELECT spr.*, 
                   (SELECT COUNT(*) FROM period_enrollments WHERE studentId = spr.studentId AND periodId = spr.periodId) as enrolledSubjects
            FROM student_period_records spr
            WHERE spr.periodId = ?
            ORDER BY spr.studentName
        `).all(req.params.periodId);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registrar estudiante en un período
router.post('/periods/:periodId/students', (req, res) => {
    try {
        const { studentId, studentName, matricula, email, phone, enrollmentDate } = req.body;
        const periodId = req.params.periodId;
        
        const result = db.prepare(`
            INSERT INTO student_period_records 
            (studentId, periodId, studentName, matricula, email, phone, enrollmentDate, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
        `).run(studentId, periodId, studentName, matricula, email, phone, enrollmentDate || new Date().toISOString());
        
        const record = db.prepare('SELECT * FROM student_period_records WHERE id = ?').get(result.lastInsertRowid);
        res.json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar registro de estudiante en período
router.put('/periods/:periodId/students/:recordId', (req, res) => {
    try {
        const { status, completionDate, averageGrade, totalCredits, notes } = req.body;
        
        db.prepare(`
            UPDATE student_period_records 
            SET status = ?, completionDate = ?, averageGrade = ?, totalCredits = ?, notes = ?, updatedAt = ?
            WHERE id = ?
        `).run(status, completionDate, averageGrade, totalCredits, notes, new Date().toISOString(), req.params.recordId);
        
        const record = db.prepare('SELECT * FROM student_period_records WHERE id = ?').get(req.params.recordId);
        res.json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener historial completo de un estudiante
router.get('/students/:studentId/history', (req, res) => {
    try {
        const history = db.prepare(`
            SELECT spr.*, ap.name as periodName, ap.code as periodCode, ap.year, ap.quarter
            FROM student_period_records spr
            JOIN academic_periods ap ON spr.periodId = ap.id
            WHERE spr.studentId = ?
            ORDER BY ap.year DESC, ap.quarter DESC
        `).all(req.params.studentId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== INSCRIPCIONES POR PERÍODO ====================

// Obtener inscripciones de un estudiante en un período
router.get('/periods/:periodId/students/:studentId/enrollments', (req, res) => {
    try {
        const enrollments = db.prepare(`
            SELECT * FROM period_enrollments
            WHERE periodId = ? AND studentId = ?
            ORDER BY subjectName
        `).all(req.params.periodId, req.params.studentId);
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registrar inscripción en período
router.post('/periods/:periodId/enrollments', (req, res) => {
    try {
        const { studentId, subjectId, studentName, subjectName, subjectCode, teacher, enrollmentDate } = req.body;
        const periodId = req.params.periodId;
        
        const result = db.prepare(`
            INSERT INTO period_enrollments 
            (studentId, periodId, subjectId, studentName, subjectName, subjectCode, teacher, enrollmentDate, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'in_progress')
        `).run(studentId, periodId, subjectId, studentName, subjectName, subjectCode, teacher, enrollmentDate || new Date().toISOString());
        
        const enrollment = db.prepare('SELECT * FROM period_enrollments WHERE id = ?').get(result.lastInsertRowid);
        res.json(enrollment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar inscripción (calificación final, estado)
router.put('/periods/:periodId/enrollments/:enrollmentId', (req, res) => {
    try {
        const { finalGrade, status, completionDate } = req.body;
        
        db.prepare(`
            UPDATE period_enrollments 
            SET finalGrade = ?, status = ?, completionDate = ?
            WHERE id = ?
        `).run(finalGrade, status, completionDate, req.params.enrollmentId);
        
        const enrollment = db.prepare('SELECT * FROM period_enrollments WHERE id = ?').get(req.params.enrollmentId);
        res.json(enrollment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== REPORTES Y ESTADÍSTICAS ====================

// Obtener estadísticas de un período
router.get('/periods/:periodId/stats', (req, res) => {
    try {
        const stats = {
            totalStudents: db.prepare('SELECT COUNT(*) as count FROM student_period_records WHERE periodId = ?').get(req.params.periodId).count,
            activeStudents: db.prepare('SELECT COUNT(*) as count FROM student_period_records WHERE periodId = ? AND status = "active"').get(req.params.periodId).count,
            completedStudents: db.prepare('SELECT COUNT(*) as count FROM student_period_records WHERE periodId = ? AND status = "completed"').get(req.params.periodId).count,
            totalEnrollments: db.prepare('SELECT COUNT(*) as count FROM period_enrollments WHERE periodId = ?').get(req.params.periodId).count,
            averageGrade: db.prepare('SELECT AVG(averageGrade) as avg FROM student_period_records WHERE periodId = ? AND averageGrade IS NOT NULL').get(req.params.periodId).avg || 0
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los estudiantes que han estudiado en la institución
router.get('/students/all-time', (req, res) => {
    try {
        const students = db.prepare(`
            SELECT DISTINCT s.*, 
                   (SELECT COUNT(DISTINCT periodId) FROM student_period_records WHERE studentId = s.id) as periodsAttended,
                   (SELECT MAX(ap.year || '-Q' || ap.quarter) 
                    FROM student_period_records spr 
                    JOIN academic_periods ap ON spr.periodId = ap.id 
                    WHERE spr.studentId = s.id) as lastPeriod
            FROM students s
            ORDER BY s.name
        `).all();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
