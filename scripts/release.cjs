const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Intentar cargar dotenv si existe para manejar el token fácilmente
try {
    require('dotenv').config();
} catch (e) {
    // No pasa nada si no está
}

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = require(packageJsonPath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`\n🚀 Iniciando proceso de lanzamiento AUTOMÁTICO (Release)`);
console.log(`📦 Versión detectada en package.json: ${packageJson.version}`);

// Verificar si hay un token de GitHub configurado
const hasToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

if (!hasToken) {
    console.log('\n⚠️  ADVERTENCIA: No se detectó GH_TOKEN en las variables de entorno.');
    console.log('El script subirá el código, pero NO podrá crear el release en GitHub automáticamente.');
    console.log('Para automatizarlo completamente, crea un archivo .env con: GH_TOKEN=tu_token_aqui\n');
}

rl.question(`¿Confirmas el lanzamiento de la versión v${packageJson.version}? (s/n): `, (confirm) => {
    if (confirm.toLowerCase() !== 's') {
        console.log('❌ Cancelado.');
        rl.close();
        process.exit(0);
    }

    const version = packageJson.version;

    try {
        // 1. Ejecutar Build y Publicar
        console.log('\n🔨 Paso 1: Compilando y Subiendo a GitHub Releases...');
        console.log('Esto creará el instalador y lo subirá automáticamente si tienes el token configurado.');
        
        // Ejecutamos electron-builder con el flag de publicar
        // "always" fuerza a crear el release si no existe
        const publishFlag = hasToken ? '--publish always' : '';
        execSync(`npm run build && npx electron-builder ${publishFlag}`, { 
            stdio: 'inherit', 
            cwd: path.join(__dirname, '..'),
            env: { ...process.env }
        });

        // 2. Git Commit & Tag
        console.log('\n📝 Paso 2: Guardando cambios en Git...');
        try {
            execSync('git add .', { cwd: path.join(__dirname, '..') });
            execSync(`git commit -m "chore: release v${version}"`, { cwd: path.join(__dirname, '..') });
        } catch (e) {
            console.log('ℹ️ No hay cambios para committear o el commit ya existe.');
        }

        console.log(`\n🏷️  Paso 3: Creando etiqueta v${version}...`);
        try {
            execSync(`git tag -a v${version} -m "Release version ${version}"`, { cwd: path.join(__dirname, '..') });
        } catch (e) {
            console.log(`ℹ️ El tag v${version} ya existe.`);
        }

        // 3. Git Push
        console.log('\n☁️  Paso 4: Subiendo código y etiquetas a GitHub...');
        execSync('git push origin main && git push origin --tags', { 
            stdio: 'inherit',
            cwd: path.join(__dirname, '..') 
        });

        console.log(`\n✅ ¡ÉXITO! La versión v${version} ha sido procesada.`);
        if (hasToken) {
            console.log(`🔗 Verifica tu release en: https://github.com/${packageJson.build.publish.owner}/${packageJson.build.publish.repo}/releases`);
        } else {
            console.log(`⚠️  Recuerda que debes subir el archivo .exe manualmente a GitHub porque no se detectó GH_TOKEN.`);
        }
        
    } catch (error) {
        console.error('\n❌ Error durante el proceso:', error.message);
    } finally {
        rl.close();
    }
});
