// Servicio de envío de emails usando Gmail (Nodemailer)
const nodemailer = require('nodemailer');
require('dotenv').config();

// Crear el transportador reutilizable
const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Debe ser una "Contraseña de Aplicación" de Google
        }
    });
};

/**
 * Enviar email usando Gmail
 * @param {Object} emailData - Datos del email
 */
const sendEmail = async (emailData) => {
    try {
        const transporter = createTransporter();

        if (!transporter) {
            throw new Error('Credenciales de Gmail no configuradas. Necesitas EMAIL_USER y EMAIL_PASS en el archivo .env');
        }

        const { to, fromName, subject, html, attachment } = emailData;

        const mailOptions = {
            from: `"${fromName || 'GradeApp'}" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };

        if (attachment && attachment.data) {
            mailOptions.attachments = [{
                filename: attachment.name || 'documento.pdf',
                content: attachment.data, // Puede ser Buffer, Stream o Base64 string
                encoding: 'base64'
            }];
        }

        console.log(`📧 Enviando email a: ${to} desde ${process.env.EMAIL_USER}`);
        
        const info = await transporter.sendMail(mailOptions);
        
        console.log(`✅ Email enviado: ${info.messageId}`);
        return {
            success: true,
            message: `Email enviado a ${to}`,
            messageId: info.messageId
        };

    } catch (error) {
        console.error('❌ Error enviando email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Enviar múltiples emails con delay para evitar bloqueo
 */
const sendBulkEmails = async (emails) => {
    const results = [];
    
    // Verificar configuración una sola vez
    const transporter = createTransporter();
    if (!transporter) {
        return emails.map(e => ({ to: e.to, success: false, error: 'Gmail no configurado' }));
    }

    for (const emailData of emails) {
        try {
            const result = await sendEmail(emailData);
            results.push(result);
            
            // Pausa de 1 segundos entre correos para no saturar Gmail (rate limits)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            results.push({ to: emailData.to, success: false, error: error.message });
        }
    }

    return results;
};

/**
 * Verificar estado de la configuración
 */
const checkConfiguration = () => {
    const isConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    return {
        configured: isConfigured,
        user: process.env.EMAIL_USER || 'No definido',
        message: isConfigured 
            ? 'Gmail configurado correctamente (Verificar contraseña de aplicación)' 
            : 'Faltan credenciales. Agrega EMAIL_USER y EMAIL_PASS al .env'
    };
};

module.exports = {
    sendEmail,
    sendBulkEmails,
    checkConfiguration
};
