const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'grade_manager.db');
const db = new Database(dbPath);

console.log('🔄 Ejecutando migración de base de datos...\n');

try {
    // Verificar si la columna isActive existe
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    const hasIsActive = tableInfo.some(col => col.name === 'isActive');
    
    if (!hasIsActive) {
        console.log('➕ Agregando columna isActive a la tabla users...');
        db.exec(`ALTER TABLE users ADD COLUMN isActive INTEGER DEFAULT 1`);
        console.log('✅ Columna isActive agregada');
    } else {
        console.log('✅ La columna isActive ya existe');
    }
    
    // Verificar si existen las columnas de reset de contraseña
    const hasResetToken = tableInfo.some(col => col.name === 'resetToken');
    const hasResetTokenExpiry = tableInfo.some(col => col.name === 'resetTokenExpiry');
    
    if (!hasResetToken) {
        console.log('➕ Agregando columna resetToken a la tabla users...');
        db.exec(`ALTER TABLE users ADD COLUMN resetToken TEXT`);
        console.log('✅ Columna resetToken agregada');
    } else {
        console.log('✅ La columna resetToken ya existe');
    }
    
    if (!hasResetTokenExpiry) {
        console.log('➕ Agregando columna resetTokenExpiry a la tabla users...');
        db.exec(`ALTER TABLE users ADD COLUMN resetTokenExpiry TEXT`);
        console.log('✅ Columna resetTokenExpiry agregada');
    } else {
        console.log('✅ La columna resetTokenExpiry ya existe');
    }
    
    // Verificar si existe la columna fullName
    const hasFullName = tableInfo.some(col => col.name === 'fullName');
    if (!hasFullName) {
        console.log('➕ Agregando columna fullName a la tabla users...');
        db.exec(`ALTER TABLE users ADD COLUMN fullName TEXT`);
        console.log('✅ Columna fullName agregada');
    } else {
        console.log('✅ La columna fullName ya existe');
    }
    
    // Verificar si existe la columna lastLogin
    const hasLastLogin = tableInfo.some(col => col.name === 'lastLogin');
    if (!hasLastLogin) {
        console.log('➕ Agregando columna lastLogin a la tabla users...');
        db.exec(`ALTER TABLE users ADD COLUMN lastLogin TEXT`);
        console.log('✅ Columna lastLogin agregada');
    } else {
        console.log('✅ La columna lastLogin ya existe');
    }
    
    console.log('\n✅ Migración completada exitosamente');
    console.log('\n📊 Estructura actual de la tabla users:');
    const updatedTableInfo = db.prepare("PRAGMA table_info(users)").all();
    updatedTableInfo.forEach(col => {
        console.log(`   - ${col.name} (${col.type})`);
    });
    
} catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
} finally {
    db.close();
}
