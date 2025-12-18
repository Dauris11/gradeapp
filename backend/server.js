const express = require('express');
const cors = require('cors');
const { db, initDatabase } = require('./database');
const whatsappService = require('./whatsappServiceFree');
const QRCode = require('qrcode');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar base de datos
initDatabase();

// Inicializar WhatsApp
whatsappService.initializeWhatsApp();

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
// Obtener todos los usuarios
app.get('/api/users', (req, res) => {
    const users = db.prepare('SELECT id, username, email, role, fullName, isActive, createdAt, lastLogin FROM users').all();
    res.json(users);
});

// Obtener un usuario por ID
app.get('/api/users/:id', (req, res) => {
    const user = db.prepare('SELECT id, username, email, role, fullName, isActive, createdAt, lastLogin FROM users WHERE id = ?').get(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
    }
});

// Crear nuevo usuario
app.post('/api/users', (req, res) => {
    const { username, password, email, role, fullName } = req.body;
    try {
        const result = db.prepare(`
            INSERT INTO users (username, password, email, role, fullName)
            VALUES (?, ?, ?, ?, ?)
        `).run(username, password, email, role || 'user', fullName);
        
        const user = db.prepare('SELECT id, username, email, role, fullName, isActive FROM users WHERE id = ?').get(result.lastInsertRowid);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar usuario
app.put('/api/users/:id', (req, res) => {
    const { username, email, role, fullName, isActive } = req.body;
    try {
        db.prepare(`
            UPDATE users 
            SET username = ?, email = ?, role = ?, fullName = ?, isActive = ?
            WHERE id = ?
        `).run(username, email, role, fullName, isActive !== undefined ? isActive : 1, req.params.id);
        
        const user = db.prepare('SELECT id, username, email, role, fullName, isActive FROM users WHERE id = ?').get(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar usuario
app.delete('/api/users/:id', (req, res) => {
    // No permitir eliminar al admin principal
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (user && user.username === 'admin') {
        return res.status(403).json({ error: 'No se puede eliminar el usuario administrador principal' });
    }
    
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// Cambiar contraseña (usuario autenticado)
app.post('/api/users/:id/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    if (user.password !== currentPassword) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }
    
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, req.params.id);
    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
});

// Solicitar recuperación de contraseña
app.post('/api/auth/request-reset', (req, res) => {
    const { email } = req.body;
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
        // Por seguridad, no revelar si el email existe o no
        return res.json({ success: true, message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' });
    }
    
    // Generar token de recuperación
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hora
    
    db.prepare(`
        UPDATE users 
        SET resetToken = ?, resetTokenExpiry = ?
        WHERE id = ?
    `).run(resetToken, resetTokenExpiry, user.id);
    
    // En producción, enviar email con el token
    // Por ahora, devolver el token (solo para desarrollo)
    res.json({ 
        success: true, 
        message: 'Token de recuperación generado',
        // Solo para desarrollo - ELIMINAR en producción
        resetToken,
        resetUrl: `http://localhost:5173/reset-password?token=${resetToken}`
    });
});

// Verificar token de recuperación
app.post('/api/auth/verify-reset-token', (req, res) => {
    const { token } = req.body;
    
    const user = db.prepare(`
        SELECT id, username, email FROM users 
        WHERE resetToken = ? AND resetTokenExpiry > datetime('now')
    `).get(token);
    
    if (user) {
        res.json({ valid: true, user });
    } else {
        res.json({ valid: false, message: 'Token inválido o expirado' });
    }
});

// Restablecer contraseña con token
app.post('/api/auth/reset-password-with-token', (req, res) => {
    const { token, newPassword } = req.body;
    
    const user = db.prepare(`
        SELECT id FROM users 
        WHERE resetToken = ? AND resetTokenExpiry > datetime('now')
    `).get(token);
    
    if (!user) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    
    // Actualizar contraseña y limpiar token
    db.prepare(`
        UPDATE users 
        SET password = ?, resetToken = NULL, resetTokenExpiry = NULL
        WHERE id = ?
    `).run(newPassword, user.id);
    
    res.json({ success: true, message: 'Contraseña restablecida exitosamente' });
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

// ==================== RUTAS DE EMAIL ====================
const emailService = require('./emailService');

// Verificar configuración de SendGrid
app.get('/api/email/config', (req, res) => {
    const config = emailService.checkConfiguration();
    res.json(config);
});

// Enviar email individual
app.post('/api/email/send', async (req, res) => {
    try {
        const result = await emailService.sendEmail(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Enviar emails masivos
app.post('/api/email/send-bulk', async (req, res) => {
    try {
        const { emails } = req.body;
        const results = await emailService.sendBulkEmails(emails);
        
        const successCount = results.filter(r => r.success).length;
        
        res.json({
            success: true,
            total: results.length,
            sent: successCount,
            failed: results.length - successCount,
            results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// ==================== RUTAS DE WHATSAPP (GRATIS) ====================
const whatsappService = require('./whatsappServiceFree');

// Inicializar WhatsApp al arrancar el servidor
whatsappService.initializeWhatsApp();

// Verificar estado de WhatsApp
app.get('/api/whatsapp/status', (req, res) => {
    const status = whatsappService.checkStatus();
    res.json(status);
});

// Obtener código QR para escanear
app.get('/api/whatsapp/qr', (req, res) => {
    const qr = whatsappService.getQRCode();
    if (qr) {
        res.json({ qr, needsScan: true });
    } else {
        res.json({ needsScan: false, message: 'WhatsApp ya está conectado' });
    }
});

// Enviar mensaje de WhatsApp individual
app.post('/api/whatsapp/send', async (req, res) => {
    try {
        const { to, message } = req.body;
        const result = await whatsappService.sendWhatsAppMessage(to, message);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Enviar mensajes masivos por WhatsApp
app.post('/api/whatsapp/send-bulk', async (req, res) => {
    try {
        const { messages } = req.body;
        const results = await whatsappService.sendBulkWhatsApp(messages);
        
        const successCount = results.filter(r => r.success).length;
        
        res.json({
            success: true,
            total: results.length,
            sent: successCount,
            failed: results.length - successCount,
            results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== RUTAS DE WHATSAPP ====================
// Obtener estado de WhatsApp
app.get('/api/whatsapp/status', (req, res) => {
    const status = whatsappService.checkStatus();
    res.json({
        connected: status.ready,
        initialized: status.initialized,
        needsQR: status.needsQR,
        message: status.message
    });
});

// Obtener código QR
app.get('/api/whatsapp/qr', async (req, res) => {
    try {
        const qrData = whatsappService.getQRCode();
        if (qrData) {
            // Convertir QR a imagen base64
            const qrImage = await QRCode.toDataURL(qrData);
            res.json({ qr: qrImage, raw: qrData });
        } else {
            res.json({ qr: null, message: 'WhatsApp ya está conectado o el QR aún no está disponible' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Validar número de teléfono
app.post('/api/whatsapp/validate-phone', (req, res) => {
    const { phone } = req.body;
    const validation = whatsappService.validatePhoneNumber(phone);
    res.json(validation);
});

// Desconectar WhatsApp
app.post('/api/whatsapp/disconnect', async (req, res) => {
    try {
        await whatsappService.disconnect();
        res.json({ success: true, message: 'WhatsApp desconectado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
    console.log(`📊 Base de datos: ${__dirname}/grade_manager.db`);
});
