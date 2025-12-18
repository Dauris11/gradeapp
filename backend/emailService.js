// Servicio de envío de emails con SendGrid
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Configurar SendGrid con la API Key
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ SendGrid configurado correctamente');
} else {
    console.warn('⚠️ SENDGRID_API_KEY no configurada. Los emails no se enviarán.');
}

/**
 * Enviar email con SendGrid
 * @param {Object} emailData - Datos del email
 * @param {string} emailData.to - Destinatario
 * @param {string} emailData.from - Remitente
 * @param {string} emailData.fromName - Nombre del remitente
 * @param {string} emailData.replyTo - Correo de respuesta
 * @param {string} emailData.subject - Asunto
 * @param {string} emailData.html - Contenido HTML
 * @param {Object} emailData.attachment - Adjunto (opcional)
 * @returns {Promise} Resultado del envío
 */
const sendEmail = async (emailData) => {
    try {
        const { to, from, fromName, replyTo, subject, html, attachment } = emailData;

        // Validar que SendGrid esté configurado
        if (!process.env.SENDGRID_API_KEY) {
            throw new Error('SendGrid no está configurado. Agrega SENDGRID_API_KEY al archivo .env');
        }

        // Construir mensaje
        const msg = {
            to,
            from: {
                email: from || process.env.FROM_EMAIL || 'noreply@gradeapp.com',
                name: fromName || process.env.FROM_NAME || 'GradeApp'
            },
            replyTo: replyTo || process.env.REPLY_TO_EMAIL || from,
            subject,
            html
        };

        // Agregar adjunto si existe
        if (attachment && attachment.data) {
            msg.attachments = [{
                content: attachment.data,
                filename: attachment.name || 'documento.pdf',
                type: attachment.type || 'application/pdf',
                disposition: 'attachment'
            }];
        }

        // Enviar email
        console.log(`📧 Enviando email a: ${to}`);
        const response = await sgMail.send(msg);
        
        console.log(`✅ Email enviado exitosamente a ${to}`);
        return {
            success: true,
            message: `Email enviado exitosamente a ${to}`,
            messageId: response[0].headers['x-message-id'],
            statusCode: response[0].statusCode
        };

    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        
        // Manejar errores específicos de SendGrid
        if (error.response) {
            const { message, code, response } = error;
            return {
                success: false,
                error: message,
                code,
                details: response?.body?.errors || []
            };
        }

        return {
            success: false,
            error: error.message || 'Error desconocido al enviar email'
        };
    }
};

/**
 * Enviar múltiples emails
 * @param {Array} emails - Array de datos de emails
 * @returns {Promise<Array>} Resultados de los envíos
 */
const sendBulkEmails = async (emails) => {
    const results = [];

    for (const emailData of emails) {
        try {
            const result = await sendEmail(emailData);
            results.push({
                to: emailData.to,
                ...result
            });

            // Pequeño delay entre envíos para no saturar
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            results.push({
                to: emailData.to,
                success: false,
                error: error.message
            });
        }
    }

    return results;
};

/**
 * Verificar configuración de SendGrid
 * @returns {Object} Estado de la configuración
 */
const checkConfiguration = () => {
    const isConfigured = !!process.env.SENDGRID_API_KEY;
    
    return {
        configured: isConfigured,
        fromEmail: process.env.FROM_EMAIL || 'No configurado',
        fromName: process.env.FROM_NAME || 'No configurado',
        replyTo: process.env.REPLY_TO_EMAIL || 'No configurado',
        message: isConfigured 
            ? 'SendGrid está configurado y listo para usar'
            : 'SendGrid no está configurado. Agrega SENDGRID_API_KEY al archivo .env'
    };
};

module.exports = {
    sendEmail,
    sendBulkEmails,
    checkConfiguration
};
