const express = require('express');
const cors = require('cors');
const { db, initDatabase } = require('./database');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar base de datos
initDatabase();

// ==================== RUTAS DE AUTENTICACIÓN ====================
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
    
    if (user) {
        // Actualizar último login
        db.prepare('UPDATE users SET lastLogin = ? WHERE id = ?').run(new Date().toISOString(), user.id);
        
        // No enviar password en la respuesta
        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
});

app.post('/api/auth/reset-password', (req, res) => {
    const { email } = req.body;
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (user) {
        // En producción, aquí enviarías un email
        // Por ahora, solo devolvemos la contraseña
        res.json({ 
            success: true, 
            message: 'Contraseña enviada a tu correo',
            // Solo para desarrollo - ELIMINAR en producción
            password: user.password
        });
    } else {
        res.status(404).json({ success: false, message: 'Email no encontrado' });
    }
});

// ==================== RUTAS DE USUARIOS ====================
app.get('/api/users', (req, res) => {
    const users = db.prepare('SELECT id, username, email, role, fullName, createdAt FROM users').all();
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const { username, password, email, role, fullName } = req.body;
    try {
        const result = db.prepare(`
            INSERT INTO users (username, password, email, role, fullName)
            VALUES (?, ?, ?, ?, ?)
        `).run(username, password, email, role || 'user', fullName);
        
        const user = db.prepare('SELECT id, username, email, role, fullName FROM users WHERE id = ?').get(result.lastInsertRowid);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== RUTAS DE ESTUDIANTES ====================
app.get('/api/students', (req, res) => {
    const students = db.prepare('SELECT * FROM students ORDER BY name').all();
    res.json(students);
});

app.get('/api/students/:id', (req, res) => {
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
    res.json(student);
});

app.post('/api/students', (req, res) => {
    const { name, email, phone, enrollmentDate } = req.body;
    const year = new Date().getFullYear();
    
    // Generar matrícula
    const maxSeq = db.prepare(`
        SELECT MAX(CAST(SUBSTR(matricula, 7) AS INTEGER)) as maxSeq 
        FROM students 
        WHERE matricula LIKE ?
    `).get(`GE${year}%`);
    
    const sequential = (maxSeq?.maxSeq || 0) + 1;
    const matricula = `GE${year}${String(sequential).padStart(4, '0')}`;
    
    try {
        const result = db.prepare(`
            INSERT INTO students (matricula, name, email, phone, year, enrollmentDate)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(matricula, name, email, phone, year, enrollmentDate || new Date().toISOString());
        
        const student = db.prepare('SELECT * FROM students WHERE id = ?').get(result.lastInsertRowid);
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/students/:id', (req, res) => {
    const { name, email, phone } = req.body;
    db.prepare('UPDATE students SET name = ?, email = ?, phone = ? WHERE id = ?')
        .run(name, email, phone, req.params.id);
    
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
    res.json(student);
});

app.delete('/api/students/:id', (req, res) => {
    db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// ==================== RUTAS DE MATERIAS ====================
app.get('/api/subjects', (req, res) => {
    const subjects = db.prepare('SELECT * FROM subjects ORDER BY name').all();
    const parsed = subjects.map(s => ({
        ...s,
        components: s.components ? JSON.parse(s.components) : []
    }));
    res.json(parsed);
});

app.post('/api/subjects', (req, res) => {
    const { name, code, credits, schedule, teacher, cycle, components } = req.body;
    const colors = [
        '#3B82F6, #2563EB',
        '#22C55E, #16A34A',
        '#A855F7, #9333EA',
        '#F97316, #EA580C',
        '#EC4899, #DB2777',
        '#6366F1, #4F46E5'
    ];
    
    const count = db.prepare('SELECT COUNT(*) as count FROM subjects').get();
    const color = colors[count.count % colors.length];
    
    const defaultComponents = components || [
        { id: 1, name: 'Tareas', type: 'numeric', weight: 40, maxScore: 100 },
        { id: 2, name: 'Exámenes', type: 'numeric', weight: 60, maxScore: 100 }
    ];
    
    try {
        const result = db.prepare(`
            INSERT INTO subjects (name, code, credits, schedule, teacher, cycle, color, components)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(name, code, credits, schedule, teacher, cycle || 'First cycle', color, JSON.stringify(defaultComponents));
        
        const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(result.lastInsertRowid);
        res.json({
            ...subject,
            components: JSON.parse(subject.components)
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/subjects/:id', (req, res) => {
    const { name, code, credits, schedule, teacher, cycle, components } = req.body;
    const componentsStr = components ? JSON.stringify(components) : null;
    
    db.prepare(`
        UPDATE subjects 
        SET name = ?, code = ?, credits = ?, schedule = ?, teacher = ?, cycle = ?, components = ?
        WHERE id = ?
    `).run(name, code, credits, schedule, teacher, cycle, componentsStr, req.params.id);
    
    const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(req.params.id);
    res.json({
        ...subject,
        components: subject.components ? JSON.parse(subject.components) : []
    });
});

app.delete('/api/subjects/:id', (req, res) => {
    db.prepare('DELETE FROM subjects WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// ==================== RUTAS DE INSCRIPCIONES ====================
app.get('/api/enrollments', (req, res) => {
    const enrollments = db.prepare('SELECT * FROM enrollments').all();
    res.json(enrollments);
});

app.post('/api/enrollments', (req, res) => {
    const { studentId, subjectId, studentName, subjectName, subjectCode, teacher, color, enrollmentDate } = req.body;
    
    const result = db.prepare(`
        INSERT INTO enrollments (studentId, subjectId, studentName, subjectName, subjectCode, teacher, color, enrollmentDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(studentId, subjectId, studentName, subjectName, subjectCode, teacher, color, enrollmentDate || new Date().toISOString());
    
    const enrollment = db.prepare('SELECT * FROM enrollments WHERE id = ?').get(result.lastInsertRowid);
    res.json(enrollment);
});

app.delete('/api/enrollments/:id', (req, res) => {
    db.prepare('DELETE FROM enrollments WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// ==================== RUTAS DE CALIFICACIONES ====================
app.get('/api/grades', (req, res) => {
    const grades = db.prepare('SELECT * FROM grades ORDER BY date DESC').all();
    res.json(grades);
});

app.get('/api/grades/enrollment/:enrollmentId', (req, res) => {
    const grades = db.prepare('SELECT * FROM grades WHERE enrollmentId = ? ORDER BY date').all(req.params.enrollmentId);
    res.json(grades);
});

app.post('/api/grades', (req, res) => {
    const { enrollmentId, studentId, componentId, componentName, type, name, score, maxScore, date, notes } = req.body;
    
    const result = db.prepare(`
        INSERT INTO grades (enrollmentId, studentId, componentId, componentName, type, name, score, maxScore, date, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(enrollmentId, studentId, componentId, componentName, type, name, score, maxScore || 100, date || new Date().toISOString(), notes);
    
    const grade = db.prepare('SELECT * FROM grades WHERE id = ?').get(result.lastInsertRowid);
    res.json(grade);
});

app.put('/api/grades/:id', (req, res) => {
    const { score, notes } = req.body;
    db.prepare('UPDATE grades SET score = ?, notes = ? WHERE id = ?').run(score, notes, req.params.id);
    
    const grade = db.prepare('SELECT * FROM grades WHERE id = ?').get(req.params.id);
    res.json(grade);
});

app.delete('/api/grades/:id', (req, res) => {
    db.prepare('DELETE FROM grades WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
    console.log(`📊 Base de datos: ${__dirname}/grade_manager.db`);
});
