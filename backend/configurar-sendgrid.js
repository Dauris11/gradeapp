// Script interactivo para configurar SendGrid
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  🎓 CONFIGURADOR DE SENDGRID PARA GRADEAPP 🎓            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('Este asistente te ayudará a configurar SendGrid paso a paso.\n');
console.log('📋 Antes de comenzar, asegúrate de tener:');
console.log('   1. Una cuenta en SendGrid (https://signup.sendgrid.com/)');
console.log('   2. Tu API Key de SendGrid');
console.log('   3. Un email verificado como remitente\n');

const config = {
    SENDGRID_API_KEY: '',
    FROM_EMAIL: '',
    FROM_NAME: '',
    REPLY_TO_EMAIL: '',
    PORT: '3001'
};

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function configurar() {
    try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // API Key
        console.log('🔑 PASO 1: API Key de SendGrid');
        console.log('   Obtén tu API Key en: https://app.sendgrid.com/settings/api_keys');
        console.log('   Debe comenzar con "SG." seguido de caracteres alfanuméricos\n');
        
        let apiKey = await ask('   Ingresa tu SENDGRID_API_KEY: ');
        while (!apiKey || !apiKey.startsWith('SG.')) {
            console.log('   ❌ La API Key debe comenzar con "SG."\n');
            apiKey = await ask('   Ingresa tu SENDGRID_API_KEY: ');
        }
        config.SENDGRID_API_KEY = apiKey;
        console.log('   ✅ API Key configurada\n');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // FROM_EMAIL
        console.log('📧 PASO 2: Email de Remitente');
        console.log('   Este email DEBE estar verificado en SendGrid');
        console.log('   Ve a: Settings → Sender Authentication\n');
        
        let fromEmail = await ask('   Ingresa el FROM_EMAIL: ');
        while (!fromEmail || !fromEmail.includes('@')) {
            console.log('   ❌ Ingresa un email válido\n');
            fromEmail = await ask('   Ingresa el FROM_EMAIL: ');
        }
        config.FROM_EMAIL = fromEmail;
        console.log('   ✅ Email de remitente configurado\n');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // FROM_NAME
        console.log('👤 PASO 3: Nombre del Remitente');
        console.log('   Este nombre aparecerá en los emails enviados\n');
        
        const fromName = await ask('   Ingresa el FROM_NAME [GradeApp - Sistema Académico]: ') 
            || 'GradeApp - Sistema Académico';
        config.FROM_NAME = fromName;
        console.log('   ✅ Nombre del remitente configurado\n');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // REPLY_TO_EMAIL
        console.log('↩️  PASO 4: Email de Respuesta');
        console.log('   Email donde llegarán las respuestas (puede ser el mismo que FROM_EMAIL)\n');
        
        const replyTo = await ask(`   Ingresa el REPLY_TO_EMAIL [${fromEmail}]: `) || fromEmail;
        config.REPLY_TO_EMAIL = replyTo;
        console.log('   ✅ Email de respuesta configurado\n');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Confirmar
        console.log('📋 RESUMEN DE CONFIGURACIÓN:\n');
        console.log(`   SENDGRID_API_KEY: ${config.SENDGRID_API_KEY.substring(0, 20)}...`);
        console.log(`   FROM_EMAIL:       ${config.FROM_EMAIL}`);
        console.log(`   FROM_NAME:        ${config.FROM_NAME}`);
        console.log(`   REPLY_TO_EMAIL:   ${config.REPLY_TO_EMAIL}`);
        console.log(`   PORT:             ${config.PORT}\n`);

        const confirmar = await ask('   ¿Es correcta esta configuración? (s/n): ');
        
        if (confirmar.toLowerCase() !== 's' && confirmar.toLowerCase() !== 'si') {
            console.log('\n   ❌ Configuración cancelada. Ejecuta el script nuevamente.\n');
            rl.close();
            return;
        }

        // Crear archivo .env
        const envContent = `# Configuración generada automáticamente
# Fecha: ${new Date().toLocaleString()}

# SendGrid Configuration
SENDGRID_API_KEY=${config.SENDGRID_API_KEY}

# Email Configuration
FROM_EMAIL=${config.FROM_EMAIL}
FROM_NAME=${config.FROM_NAME}
REPLY_TO_EMAIL=${config.REPLY_TO_EMAIL}

# Server Configuration
PORT=${config.PORT}
`;

        const envPath = path.join(__dirname, '.env');
        fs.writeFileSync(envPath, envContent, 'utf8');

        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║  ✅ ¡CONFIGURACIÓN COMPLETADA EXITOSAMENTE! ✅           ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        console.log(`📁 Archivo creado: ${envPath}\n`);
        console.log('🔄 PRÓXIMOS PASOS:\n');
        console.log('   1. Reinicia el servidor backend (Ctrl+C y luego npm start)');
        console.log('   2. Verifica que aparezca: "✅ SendGrid configurado correctamente"');
        console.log('   3. Prueba enviando un reporte por email desde la aplicación\n');
        console.log('📚 Documentación completa en: CONFIGURAR_SENDGRID_COMPLETO.md\n');

    } catch (error) {
        console.error('\n❌ Error durante la configuración:', error.message);
    } finally {
        rl.close();
    }
}

// Verificar si ya existe .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    rl.question('\n⚠️  Ya existe un archivo .env. ¿Deseas sobrescribirlo? (s/n): ', (answer) => {
        if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si') {
            configurar();
        } else {
            console.log('\n❌ Configuración cancelada. El archivo .env existente no fue modificado.\n');
            rl.close();
        }
    });
} else {
    configurar();
}
