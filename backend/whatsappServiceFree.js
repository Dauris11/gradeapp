// Servicio de WhatsApp GRATUITO usando whatsapp-web.js
// NO requiere Twilio ni ninguna cuenta de pago
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let whatsappClient = null;
let isReady = false;
let qrCodeData = null;

/**
 * Inicializar cliente de WhatsApp Web
 */
const initializeWhatsApp = () => {
    if (whatsappClient) {
        console.log('✅ Cliente de WhatsApp ya inicializado');
        return;
    }

    console.log('🔄 Inicializando WhatsApp Web...');

    whatsappClient = new Client({
        authStrategy: new LocalAuth({
            dataPath: './whatsapp-session'
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        }
    });

    // Evento: QR Code generado
    whatsappClient.on('qr', (qr) => {
        console.log('\n📱 ESCANEA ESTE CÓDIGO QR CON TU WHATSAPP:\n');
        qrcode.generate(qr, { small: true });
        qrCodeData = qr;
        console.log('\n💡 También puedes escanear el QR desde la app web en: http://localhost:3001/api/whatsapp/qr\n');
    });

    // Evento: Cliente listo
    whatsappClient.on('ready', () => {
        console.log('✅ WhatsApp Web conectado y listo!');
        isReady = true;
        qrCodeData = null;
    });

    // Evento: Autenticación exitosa
    whatsappClient.on('authenticated', () => {
        console.log('✅ WhatsApp autenticado correctamente');
    });

    // Evento: Error de autenticación
    whatsappClient.on('auth_failure', (msg) => {
        console.error('❌ Error de autenticación:', msg);
        isReady = false;
    });

    // Evento: Desconectado
    whatsappClient.on('disconnected', (reason) => {
        console.log('⚠️ WhatsApp desconectado:', reason);
        isReady = false;
        qrCodeData = null;
    });

    // Inicializar
    whatsappClient.initialize().catch(err => {
        console.error('❌ Error al inicializar WhatsApp:', err);
    });
};

/**
 * Enviar mensaje de WhatsApp
 * @param {string} to - Número de teléfono (formato: 18091234567 sin +)
 * @param {string} message - Mensaje de texto
 * @returns {Promise} Resultado del envío
 */
const sendWhatsAppMessage = async (to, message) => {
    try {
        if (!whatsappClient || !isReady) {
            throw new Error('WhatsApp no está conectado. Por favor, escanea el código QR primero.');
        }

        // Formatear número (agregar @c.us al final)
        const chatId = to.includes('@c.us') ? to : `${to}@c.us`;

        console.log(`📱 Enviando WhatsApp a: ${to}`);
        
        // Enviar mensaje
        const response = await whatsappClient.sendMessage(chatId, message);
        
        console.log(`✅ WhatsApp enviado exitosamente a ${to}`);
        return {
            success: true,
            message: `WhatsApp enviado exitosamente a ${to}`,
            messageId: response.id.id
        };

    } catch (error) {
        console.error('❌ Error al enviar WhatsApp:', error);
        
        return {
            success: false,
            error: error.message || 'Error desconocido al enviar WhatsApp'
        };
    }
};

/**
 * Generar mensaje de reporte para WhatsApp
 * @param {Object} student - Datos del estudiante
 * @returns {string} Mensaje formateado
 */
const generateReportMessage = (student) => {
    const currentDate = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
🎓 *GradeApp - Reporte Académico*

¡Hola ${student.name}! 👋

Te enviamos tu reporte académico actualizado correspondiente a ${currentDate}.

📊 *Tu reporte incluye:*
• Calificaciones detalladas por materia
• Promedio de asignaciones y exámenes
• Calificación acumulada actualizada
• Estado de aprobación de cada materia

💡 *Recuerda:* Tu esfuerzo y dedicación son la clave del éxito. ¡Sigue trabajando con constancia!

Si tienes alguna pregunta sobre tus calificaciones, no dudes en contactarnos.

---
_GradeApp - Sistema de Gestión Académica_
📧 ${process.env.REPLY_TO_EMAIL || 'soporte@gradeapp.com'}
    `.trim();
};

/**
 * Enviar reporte a estudiante por WhatsApp
 * @param {Object} student - Datos del estudiante
 * @returns {Promise} Resultado del envío
 */
const sendStudentReport = async (student) => {
    const message = generateReportMessage(student);
    
    // Limpiar número de teléfono (quitar + y espacios)
    const cleanPhone = student.phone.replace(/[+\s-]/g, '');
    
    return await sendWhatsAppMessage(cleanPhone, message);
};

/**
 * Enviar mensajes masivos por WhatsApp
 * @param {Array} messages - Array de mensajes a enviar
 * @returns {Promise<Array>} Resultados de los envíos
 */
const sendBulkWhatsApp = async (messages) => {
    const results = [];

    for (const messageData of messages) {
        try {
            // Limpiar número
            const cleanPhone = messageData.to.replace(/[+\s-]/g, '');
            
            const result = await sendWhatsAppMessage(cleanPhone, messageData.message);
            results.push({
                to: messageData.to,
                ...result
            });

            // Delay entre mensajes (2 segundos para evitar bloqueos)
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            results.push({
                to: messageData.to,
                success: false,
                error: error.message
            });
        }
    }

    return results;
};

/**
 * Verificar estado de WhatsApp
 * @returns {Object} Estado de la configuración
 */
const checkStatus = () => {
    return {
        initialized: !!whatsappClient,
        ready: isReady,
        needsQR: !isReady && !!qrCodeData,
        message: isReady 
            ? 'WhatsApp Web está conectado y listo para usar'
            : qrCodeData
            ? 'Escanea el código QR para conectar WhatsApp'
            : 'WhatsApp se está inicializando...'
    };
};

/**
 * Obtener código QR
 * @returns {string|null} Código QR en base64
 */
const getQRCode = () => {
    return qrCodeData;
};

/**
 * Desconectar WhatsApp
 */
const disconnect = async () => {
    if (whatsappClient) {
        await whatsappClient.destroy();
        whatsappClient = null;
        isReady = false;
        qrCodeData = null;
        console.log('🔌 WhatsApp desconectado');
    }
};

/**
 * Validar formato de número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {Object} Validación
 */
const validatePhoneNumber = (phone) => {
    // Limpiar número
    const cleanPhone = phone.replace(/[+\s-]/g, '');
    
    // Debe tener entre 10 y 15 dígitos
    const isValid = /^\d{10,15}$/.test(cleanPhone);
    
    return {
        valid: isValid,
        cleanPhone: cleanPhone,
        message: isValid 
            ? 'Número válido'
            : 'El número debe tener entre 10 y 15 dígitos (ej: 18091234567)'
    };
};

module.exports = {
    initializeWhatsApp,
    sendWhatsAppMessage,
    sendStudentReport,
    sendBulkWhatsApp,
    checkStatus,
    getQRCode,
    disconnect,
    validatePhoneNumber,
    generateReportMessage
};
