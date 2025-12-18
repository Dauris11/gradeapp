// Servicio de envío de mensajes por WhatsApp con Twilio
const twilio = require('twilio');
require('dotenv').config();

let twilioClient = null;

// Inicializar cliente de Twilio
const initializeTwilio = () => {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        console.log('✅ Twilio WhatsApp configurado correctamente');
        return true;
    } else {
        console.warn('⚠️ Twilio no configurado. Agrega TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN al .env');
        return false;
    }
};

// Inicializar al cargar el módulo
initializeTwilio();

/**
 * Enviar mensaje de WhatsApp
 * @param {Object} messageData - Datos del mensaje
 * @param {string} messageData.to - Número de teléfono del destinatario (formato: +1234567890)
 * @param {string} messageData.message - Mensaje de texto
 * @param {string} messageData.mediaUrl - URL del archivo multimedia (opcional)
 * @returns {Promise} Resultado del envío
 */
const sendWhatsAppMessage = async (messageData) => {
    try {
        const { to, message, mediaUrl } = messageData;

        // Validar que Twilio esté configurado
        if (!twilioClient) {
            throw new Error('Twilio no está configurado. Agrega las credenciales al archivo .env');
        }

        // Validar número de teléfono
        if (!to || !to.startsWith('+')) {
            throw new Error('El número de teléfono debe incluir el código de país (ej: +1234567890)');
        }

        // Construir mensaje
        const messageOptions = {
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`,
            body: message
        };

        // Agregar multimedia si existe
        if (mediaUrl) {
            messageOptions.mediaUrl = [mediaUrl];
        }

        // Enviar mensaje
        console.log(`📱 Enviando WhatsApp a: ${to}`);
        const response = await twilioClient.messages.create(messageOptions);
        
        console.log(`✅ WhatsApp enviado exitosamente a ${to}`);
        return {
            success: true,
            message: `WhatsApp enviado exitosamente a ${to}`,
            messageSid: response.sid,
            status: response.status
        };

    } catch (error) {
        console.error('❌ Error al enviar WhatsApp:', error);
        
        return {
            success: false,
            error: error.message || 'Error desconocido al enviar WhatsApp',
            code: error.code
        };
    }
};

/**
 * Generar mensaje de reporte para WhatsApp
 * @param {Object} student - Datos del estudiante
 * @param {string} pdfUrl - URL del PDF del reporte
 * @returns {string} Mensaje formateado
 */
const generateReportMessage = (student, pdfUrl = null) => {
    const currentDate = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let message = `
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

    if (pdfUrl) {
        message += `\n\n📄 *Descarga tu reporte:*\n${pdfUrl}`;
    }

    return message;
};

/**
 * Enviar reporte a estudiante por WhatsApp
 * @param {Object} student - Datos del estudiante
 * @param {string} pdfUrl - URL del PDF (opcional)
 * @returns {Promise} Resultado del envío
 */
const sendStudentReport = async (student, pdfUrl = null) => {
    const message = generateReportMessage(student, pdfUrl);
    
    return await sendWhatsAppMessage({
        to: student.phone,
        message,
        mediaUrl: pdfUrl
    });
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
            const result = await sendWhatsAppMessage(messageData);
            results.push({
                to: messageData.to,
                ...result
            });

            // Delay entre mensajes para no saturar (Twilio recomienda 1 mensaje/segundo)
            await new Promise(resolve => setTimeout(resolve, 1000));
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
 * Verificar configuración de Twilio WhatsApp
 * @returns {Object} Estado de la configuración
 */
const checkConfiguration = () => {
    const isConfigured = !!(
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_WHATSAPP_NUMBER
    );
    
    return {
        configured: isConfigured,
        accountSid: process.env.TWILIO_ACCOUNT_SID ? '***' + process.env.TWILIO_ACCOUNT_SID.slice(-4) : 'No configurado',
        whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || 'No configurado',
        message: isConfigured 
            ? 'Twilio WhatsApp está configurado y listo para usar'
            : 'Twilio WhatsApp no está configurado. Agrega las credenciales al archivo .env'
    };
};

/**
 * Validar formato de número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {Object} Validación
 */
const validatePhoneNumber = (phone) => {
    // Formato esperado: +[código país][número]
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    
    const isValid = phoneRegex.test(phone);
    
    return {
        valid: isValid,
        message: isValid 
            ? 'Número válido'
            : 'El número debe incluir el código de país (ej: +1234567890)'
    };
};

module.exports = {
    sendWhatsAppMessage,
    sendStudentReport,
    sendBulkWhatsApp,
    checkConfiguration,
    validatePhoneNumber,
    generateReportMessage
};
