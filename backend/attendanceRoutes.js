const express = require('express');
const { db } = require('./database');

const router = express.Router();

// Obtener registros de asistencia por materia y fecha
router.get('/subject/:subjectId', (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'La fecha es requerida (YYYY-MM-DD)' });
        }

        const attendance = db.prepare(`
            SELECT * FROM attendance 
            WHERE subjectId = ? AND date = ?
        `).all(req.params.subjectId, date);
        
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Guardar o actualizar registros de asistencia (masivo)
router.post('/bulk', (req, res) => {
    const { attendanceRecords } = req.body; // Array de { studentId, subjectId, date, status, notes }

    if (!Array.isArray(attendanceRecords)) {
        return res.status(400).json({ error: 'Se requiere un array de registros de asistencia' });
    }

    try {
        const insertOrUpdate = db.transaction((records) => {
            for (const record of records) {
                // Verificar si ya existe para ese estudiante, materia y fecha
                const existing = db.prepare(`
                    SELECT id FROM attendance 
                    WHERE studentId = ? AND subjectId = ? AND date = ?
                `).get(record.studentId, record.subjectId, record.date);

                if (existing) {
                    db.prepare(`
                        UPDATE attendance 
                        SET status = ?, notes = ?
                        WHERE id = ?
                    `).run(record.status, record.notes || null, existing.id);
                } else {
                    db.prepare(`
                        INSERT INTO attendance (studentId, subjectId, date, status, notes)
                        VALUES (?, ?, ?, ?, ?)
                    `).run(record.studentId, record.subjectId, record.date, record.status, record.notes || null);
                }
            }
        });

        insertOrUpdate(attendanceRecords);
        res.json({ success: true, message: 'Registros de asistencia guardados correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener resumen de asistencia por estudiante para una materia
router.get('/student/:studentId/subject/:subjectId/stats', (req, res) => {
    try {
        const stats = db.prepare(`
            SELECT 
                status, 
                COUNT(*) as count 
            FROM attendance 
            WHERE studentId = ? AND subjectId = ?
            GROUP BY status
        `).all(req.params.studentId, req.params.subjectId);
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener reporte detallado por materia y rango de fechas
router.get('/report/subject/:subjectId', (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const { subjectId } = req.params;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'startDate y endDate son requeridos' });
        }

        // 1. Obtener la lista de estudiantes inscritos en esta materia
        const students = db.prepare(`
            SELECT s.id, s.name
            FROM students s
            JOIN enrollments e ON s.id = e.studentId
            WHERE e.subjectId = ?
            ORDER BY s.name
        `).all(subjectId);

        // 2. Obtener todos los registros de asistencia en el rango para esta materia
        const attendanceRecords = db.prepare(`
            SELECT studentId, date, status
            FROM attendance
            WHERE subjectId = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC
        `).all(subjectId, startDate, endDate);

        // 3. Obtener todas las fechas únicas que tienen registros en este rango
        const uniqueDates = [...new Set(attendanceRecords.map(r => r.date))].sort();

        // 4. Formatear la data para el reporte
        const reportData = students.map(student => {
            const studentAttendance = {};
            uniqueDates.forEach(date => {
                const record = attendanceRecords.find(r => r.studentId === student.id && r.date === date);
                studentAttendance[date] = record ? record.status : null; // null significa que no se pasó lista ese día
            });

            return {
                id: student.id,
                fullName: student.name,
                attendance: studentAttendance
            };
        });

        res.json({
            dates: uniqueDates,
            students: reportData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
