const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = require(packageJsonPath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`\n🚀 Iniciando proceso de lanzamiento (Release)`);
console.log(`📦 Versión actual: ${packageJson.version}`);

rl.question('¿Qué tipo de actualización es? (patch/minor/major) [patch]: ', (answer) => {
    let type = answer.trim() || 'patch';
    
    // Calcular nueva versión (lógica simple)
    let [major, minor, patch] = packageJson.version.split('.').map(Number);
    if (type === 'major') { major++; minor = 0; patch = 0; }
    else if (type === 'minor') { minor++; patch = 0; }
    else { patch++; }
    
    const newVersion = `${major}.${minor}.${patch}`;
    console.log(`\n✨ Nueva versión será: ${newVersion}`);
    
    rl.question('¿Proceder? (s/n): ', (confirm) => {
        if (confirm.toLowerCase() !== 's') {
            console.log('Cancelado.');
            rl.close();
            process.exit(0);
        }

        try {
            // 1. Actualizar package.json
            console.log('📝 Actualizando package.json...');
            packageJson.version = newVersion;
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

            // 2. Ejecutar Build
            console.log('🔨 Creando instalador (esto puede tardar unos minutos)...');
            // Usamos stdio inherit para ver el output de electron-builder
            execSync('npm run electron:build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

            // 3. Git Commit & Tag
            console.log('code-management committing changes...');
            execSync('git add package.json', { cwd: path.join(__dirname, '..') });
            execSync(`git commit -m "chore: release v${newVersion}"`, { cwd: path.join(__dirname, '..') });
            execSync(`git tag v${newVersion}`, { cwd: path.join(__dirname, '..') });

            // 4. Git Push
            console.log('☁️  Subiendo a GitHub...');
            execSync('git push && git push --tags', { cwd: path.join(__dirname, '..') });

            console.log('\n✅ ¡PROCESO COMPLETADO EXITOSAMENTE!');
            console.log(`\n⚠️  PASO FINAL MANUAL:`);
            console.log(`1. Ve a https://github.com/Dauris11/gradeapp/releases`);
            console.log(`2. Crea un 'New Release' seleccionando el tag v${newVersion}`);
            console.log(`3. ARRASTRA Y SUELTA estos archivos desde la carpeta 'dist-electron':`);
            console.log(`   - Grade Manager Setup ${newVersion}.exe`);
            console.log(`   - latest.yml`);
            
        } catch (error) {
            console.error('\n❌ Error durante el proceso:', error.message);
            // Revertir package.json si falló algo crítico podría ser buena idea, pero lo dejaremos así para inspección.
        } finally {
            rl.close();
        }
    });
});
