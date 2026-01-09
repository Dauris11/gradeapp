const express = require('express');
const { db } = require('./database');

const router = express.Router();

// Obtener distribución de calificaciones
router.get('/grades-distribution', (req, res) => {
    try {
        // Obtenemos los promedios acumulados aproximados o las notas finales de las inscripciones
        // Como no tenemos una tabla de 'final_grades' consolidada aún (se calcula al vuelo),
        // vamos a obtener todas las notas y promediar por inscripción en el backend para el reporte
        
        const settingsRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('grading_ranges');
        const gradingRanges = settingsRow ? JSON.parse(settingsRow.value) : [
            { letter: 'A', min: 90, max: 100 },
            { letter: 'B', min: 80, max: 89.9 },
            { letter: 'C', min: 70, max: 79.9 },
            { letter: 'D', min: 60, max: 69.9 },
            { letter: 'F', min: 0, max: 59.9 }
        ];

        const distribution = {};
        gradingRanges.forEach(r => {
            distribution[r.letter] = 0;
        });
        
        const enrollments = db.prepare(`
            SELECT e.id, s.components 
            FROM enrollments e 
            JOIN subjects s ON e.subjectId = s.id
        `).all();

        for (const enrollment of enrollments) {
            const grades = db.prepare('SELECT score, componentId FROM grades WHERE enrollmentId = ?').all(enrollment.id);
            if (grades.length === 0) continue;

            const components = enrollment.components ? JSON.parse(enrollment.components) : null;
            let total = 0;

            if (components && components.length > 0) {
                // Calcular por pesos reales de componentes
                let totalWeight = 0;
                components.forEach(comp => {
                    const compGrades = grades.filter(g => g.componentId === comp.id);
                    if (compGrades.length > 0) {
                        const avg = compGrades.reduce((sum, g) => sum + g.score, 0) / compGrades.length;
                        total += (avg * (comp.weight / 100));
                        totalWeight += comp.weight;
                    }
                });
                // Ajustar si no hay notas en todos los componentes
                if (totalWeight > 0) total = (total / totalWeight) * 100;
            } else {
                // Fallback a promedio simple
                total = grades.reduce((sum, g) => sum + g.score, 0) / grades.length;
            }

            // Asignar a rango
            const range = gradingRanges.find(r => total >= r.min && total <= r.max);
            if (range) {
                distribution[range.letter]++;
            } else if (total < 60) {
                distribution['F'] = (distribution['F'] || 0) + 1;
            }
        }

        const formattedData = Object.keys(distribution).map(name => ({
            name,
            value: distribution[name]
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rendimiento por materia
router.get('/subject-performance', (req, res) => {
    try {
        const subjects = db.prepare('SELECT id, name FROM subjects').all();
        const performance = [];

        for (const subject of subjects) {
            const enrollments = db.prepare('SELECT id FROM enrollments WHERE subjectId = ?').all(subject.id);
            if (enrollments.length === 0) continue;

            let totalSubjectScore = 0;
            let count = 0;

            for (const enrollment of enrollments) {
                const grades = db.prepare('SELECT score, type FROM grades WHERE enrollmentId = ?').all(enrollment.id);
                if (grades.length === 0) continue;

                const assignments = grades.filter(g => g.type === 'assignment');
                const exams = grades.filter(g => g.type === 'exam');
                
                const assignmentAvg = assignments.length > 0
                    ? assignments.reduce((sum, g) => sum + g.score, 0) / assignments.length
                    : 0;
                
                const examAvg = exams.length > 0
                    ? exams.reduce((sum, g) => sum + g.score, 0) / exams.length
                    : 0;
                
                totalSubjectScore += (assignmentAvg * 0.4) + (examAvg * 0.6);
                count++;
            }

            if (count > 0) {
                performance.push({
                    name: subject.name,
                    average: Math.round((totalSubjectScore / count) * 10) / 10
                });
            }
        }

        res.json(performance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Resumen de asistencia global
router.get('/attendance-summary', (req, res) => {
    try {
        const stats = db.prepare(`
            SELECT status, COUNT(*) as count 
            FROM attendance 
            GROUP BY status
        `).all();
        
        // Formatear para gráficos de Recharts
        const formatted = stats.map(s => ({
            name: s.status === 'present' ? 'Presente' : s.status === 'absent' ? 'Ausente' : 'Tardanza',
            value: s.count,
            color: s.status === 'present' ? '#10B981' : s.status === 'absent' ? '#EF4444' : '#F59E0B'
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
