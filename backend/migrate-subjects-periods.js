const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'grade_manager.db');
const db = new Database(dbPath);

console.log('🔄 Vinculando materias con períodos académicos...\n');

try {
    // Agregar columna periodId a subjects si no existe
    const subjectsInfo = db.prepare("PRAGMA table_info(subjects)").all();
    const hasPeriodId = subjectsInfo.some(col => col.name === 'periodId');
    
    if (!hasPeriodId) {
        db.exec(`ALTER TABLE subjects ADD COLUMN periodId INTEGER`);
        console.log('✅ Columna periodId agregada a subjects');
        
        // Obtener el período activo
        const activePeriod = db.prepare('SELECT id FROM academic_periods WHERE isActive = 1').get();
        
        if (activePeriod) {
            // Asignar todas las materias existentes al período activo
            db.prepare('UPDATE subjects SET periodId = ? WHERE periodId IS NULL').run(activePeriod.id);
            console.log(`✅ Materias existentes asignadas al período activo (ID: ${activePeriod.id})`);
        }
    } else {
        console.log('✅ La columna periodId ya existe en subjects');
    }

    // Agregar columna isActive a subjects si no existe
    const hasIsActive = subjectsInfo.some(col => col.name === 'isActive');
    
    if (!hasIsActive) {
        db.exec(`ALTER TABLE subjects ADD COLUMN isActive INTEGER DEFAULT 1`);
        console.log('✅ Columna isActive agregada a subjects');
    } else {
        console.log('✅ La columna isActive ya existe en subjects');
    }

    console.log('\n✅ Migración completada exitosamente');
    console.log('\n📊 Estructura actualizada de subjects:');
    const updatedInfo = db.prepare("PRAGMA table_info(subjects)").all();
    updatedInfo.forEach(col => {
        console.log(`   - ${col.name} (${col.type})`);
    });
    
} catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
} finally {
    db.close();
}
