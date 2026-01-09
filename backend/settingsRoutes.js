const express = require('express');
const { db } = require('./database');

const router = express.Router();

// Obtener todas las configuraciones
router.get('/', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM settings').all();
        const settings = {};
        rows.forEach(row => {
            try {
                settings[row.key] = JSON.parse(row.value);
            } catch (e) {
                settings[row.key] = row.value;
            }
        });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar una configuración específica
router.post('/', (req, res) => {
    const { key, value } = req.body;
    try {
        const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
            .run(key, valueStr);
        res.json({ success: true, key, value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar múltiples configuraciones
router.post('/bulk', (req, res) => {
    const { settings } = req.body; // Array de { key, value }
    try {
        const update = db.transaction((items) => {
            for (const item of items) {
                const valueStr = typeof item.value === 'object' ? JSON.stringify(item.value) : String(item.value);
                db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
                    .run(item.key, valueStr);
            }
        });
        update(settings);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
