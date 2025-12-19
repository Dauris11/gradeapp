// Script de prueba para verificar la configuración de SendGrid
require('dotenv').config();
const emailService = require('./emailService');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  🧪 PRUEBA DE CONFIGURACIÓN DE SENDGRID 🧪               ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

async function testSendGrid() {
    try {
        // 1. Verificar configuración
        console.log('📋 PASO 1: Verificando configuración...\n');
        const config = emailService.checkConfiguration();
        
        console.log('   Estado:', config.configured ? '✅ Configurado' : '❌ No configurado');
        console.log('   From Email:', config.fromEmail);
        console.log('   From Name:', config.fromName);
        console.log('   Reply To:', config.replyTo);
        console.log('   Mensaje:', config.message);
        console.log('');

        if (!config.configured) {
            console.log('❌ SendGrid no está configurado.');
            console.log('   Ejecuta: node configurar-sendgrid.js\n');
            return;
        }

        // 2. Solicitar email de prueba
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const emailDestino = await new Promise((resolve) => {
            rl.question('📧 Ingresa un email para enviar una prueba: ', (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });

        if (!emailDestino || !emailDestino.includes('@')) {
            console.log('\n❌ Email inválido. Prueba cancelada.\n');
            return;
        }

        // 3. Enviar email de prueba
        console.log('\n📤 PASO 2: Enviando email de prueba...\n');
        
        const emailData = {
            to: emailDestino,
            subject: '🎓 Prueba de SendGrid - GradeApp',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
                            color: white;
                            padding: 30px;
                            border-radius: 10px 10px 0 0;
                            text-align: center;
                        }
                        .content {
                            background: #f8f9fa;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .success-icon {
                            font-size: 48px;
                            margin: 20px 0;
                        }
                        .info-box {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                            border-left: 4px solid #10B981;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            color: #6c757d;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>🎓 GradeApp</h1>
                        <p>Sistema de Gestión de Calificaciones</p>
                    </div>
                    <div class="content">
                        <div class="success-icon">✅</div>
                        <h2>¡Configuración Exitosa!</h2>
                        <p>Este es un email de prueba para verificar que SendGrid está configurado correctamente.</p>
                        
                        <div class="info-box">
                            <h3>✨ ¿Qué significa esto?</h3>
                            <p>Si estás leyendo este mensaje, significa que:</p>
                            <ul>
                                <li>✅ Tu API Key de SendGrid es válida</li>
                                <li>✅ El email de remitente está verificado</li>
                                <li>✅ El sistema está listo para enviar reportes</li>
                            </ul>
                        </div>

                        <h3>🚀 Próximos Pasos</h3>
                        <p>Ahora puedes:</p>
                        <ol>
                            <li>Enviar reportes de calificaciones por email</li>
                            <li>Configurar envíos masivos a padres de familia</li>
                            <li>Personalizar las plantillas de email</li>
                        </ol>

                        <div class="footer">
                            <p>Este es un email automático generado por GradeApp</p>
                            <p>Fecha: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const resultado = await emailService.sendEmail(emailData);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        if (resultado.success) {
            console.log('✅ ¡EMAIL ENVIADO EXITOSAMENTE!\n');
            console.log('   Destinatario:', emailDestino);
            console.log('   Message ID:', resultado.messageId);
            console.log('   Status Code:', resultado.statusCode);
            console.log('\n📬 Revisa tu bandeja de entrada (y la carpeta de spam)\n');
            console.log('💡 Tip: Si el email llegó a spam, configura Domain Authentication');
            console.log('   en SendGrid para mejorar la entregabilidad.\n');
        } else {
            console.log('❌ ERROR AL ENVIAR EMAIL\n');
            console.log('   Error:', resultado.error);
            if (resultado.details && resultado.details.length > 0) {
                console.log('   Detalles:', JSON.stringify(resultado.details, null, 2));
            }
            console.log('\n📚 Consulta CONFIGURAR_SENDGRID_COMPLETO.md para solucionar problemas\n');
        }

    } catch (error) {
        console.error('\n❌ Error durante la prueba:', error.message);
        console.error('   Stack:', error.stack);
        console.log('\n📚 Consulta CONFIGURAR_SENDGRID_COMPLETO.md para ayuda\n');
    }
}

// Ejecutar prueba
testSendGrid();
