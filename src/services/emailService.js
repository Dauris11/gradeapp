// Servicio de envío de emails con plantilla profesional
// Incluye configuración de correo institucional y plantilla HTML

export const EmailService = {
    // Configuración del correo institucional
    config: {
        fromEmail: 'noreply@gradeapp.com', // Cambiar por tu correo institucional
        fromName: 'GradeApp - Sistema Académico',
        replyTo: 'soporte@gradeapp.com', // Cambiar por tu correo de soporte
    },

    // Generar plantilla HTML profesional
    generateEmailTemplate: (student, reportType = 'individual') => {
        const currentDate = new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte Académico - ${student.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <!-- Container Principal -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header con Logo y Gradiente -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 40px 30px; text-align: center;">
                            <img src="https://i.imgur.com/your-logo.png" alt="GradeApp Logo" style="width: 80px; height: 80px; margin-bottom: 15px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">GradeApp</h1>
                            <p style="color: #E0E7FF; margin: 5px 0 0 0; font-size: 14px;">Sistema de Gestión Académica</p>
                        </td>
                    </tr>

                    <!-- Contenido Principal -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <!-- Saludo -->
                            <h2 style="color: #1E293B; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
                                ¡Hola, ${student.name}! 👋
                            </h2>
                            <p style="color: #64748B; margin: 0 0 25px 0; font-size: 14px;">
                                ${currentDate}
                            </p>

                            <!-- Mensaje Principal -->
                            <p style="color: #334155; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                Nos complace compartir contigo tu <strong>reporte académico actualizado</strong>. 
                                Adjunto a este correo encontrarás un documento PDF con el detalle completo de tus calificaciones.
                            </p>

                            <!-- Tarjeta de Información -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); border-radius: 12px; padding: 20px; margin: 25px 0;">
                                <tr>
                                    <td>
                                        <h3 style="color: #0369A1; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                                            📊 Tu reporte incluye:
                                        </h3>
                                        <ul style="color: #0C4A6E; margin: 0; padding-left: 20px; line-height: 1.8;">
                                            <li>Calificaciones detalladas por materia</li>
                                            <li>Promedio de asignaciones y exámenes</li>
                                            <li>Calificación acumulada actualizada</li>
                                            <li>Estado de aprobación de cada materia</li>
                                            <li>Gráficos y estadísticas de rendimiento</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>

                            <!-- Mensaje de Motivación -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border-left: 4px solid #22C55E; border-radius: 8px; padding: 15px 20px; margin: 20px 0;">
                                <tr>
                                    <td>
                                        <p style="color: #166534; margin: 0; font-size: 14px; line-height: 1.6;">
                                            <strong>💡 Recuerda:</strong> Tu esfuerzo y dedicación son la clave del éxito. 
                                            Sigue trabajando con constancia y verás los resultados. ¡Estamos aquí para apoyarte!
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Información de Contacto -->
                            <p style="color: #334155; margin: 25px 0 0 0; font-size: 14px; line-height: 1.6;">
                                Si tienes alguna pregunta sobre tus calificaciones o necesitas aclaraciones, 
                                no dudes en contactarnos. Estamos para ayudarte.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAFC; padding: 30px; text-align: center; border-top: 1px solid #E2E8F0;">
                            <p style="color: #64748B; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                                Saludos cordiales,
                            </p>
                            <p style="color: #3B82F6; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">
                                Equipo GradeApp
                            </p>
                            
                            <!-- Redes Sociales / Contacto -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="mailto:soporte@gradeapp.com" style="color: #3B82F6; text-decoration: none; margin: 0 10px; font-size: 13px;">
                                            📧 soporte@gradeapp.com
                                        </a>
                                        <span style="color: #CBD5E1;">|</span>
                                        <a href="tel:+1234567890" style="color: #3B82F6; text-decoration: none; margin: 0 10px; font-size: 13px;">
                                            📞 +123 456 7890
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Nota Legal -->
                            <p style="color: #94A3B8; margin: 20px 0 0 0; font-size: 11px; line-height: 1.5;">
                                Este es un correo automático generado por GradeApp. Por favor, no respondas a este mensaje.<br>
                                Si deseas contactarnos, utiliza los medios de contacto proporcionados arriba.
                            </p>
                            
                            <p style="color: #CBD5E1; margin: 10px 0 0 0; font-size: 10px;">
                                © ${new Date().getFullYear()} GradeApp. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `.trim();
    },

    // Enviar email con plantilla profesional
    sendEmail: async (to, subject, htmlBody, attachment = null) => {
        console.log('📧 Preparando envío de email...');
        console.log('Para:', to);
        console.log('Asunto:', subject);
        
        try {
            // Llamar a la API del backend
            const response = await fetch('http://localhost:3001/api/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to,
                    from: EmailService.config.fromEmail,
                    fromName: EmailService.config.fromName,
                    replyTo: EmailService.config.replyTo,
                    subject,
                    html: htmlBody,
                    attachment: attachment ? {
                        name: attachment.name,
                        data: attachment.data,
                        type: 'application/pdf'
                    } : null
                })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Email enviado exitosamente');
                return result;
            } else {
                console.error('❌ Error al enviar email:', result.error);
                throw new Error(result.error || 'Error al enviar email');
            }
        } catch (error) {
            console.error('❌ Error al enviar email:', error);
            throw error;
        }
    },

    // Enviar reporte individual a estudiante
    sendStudentReport: async (student, pdfBlob) => {
        const subject = `📊 Tu Reporte Académico - ${new Date().toLocaleDateString('es-ES')}`;
        const htmlBody = EmailService.generateEmailTemplate(student, 'individual');

        // Convertir PDF Blob a Base64
        const pdfBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.readAsDataURL(pdfBlob);
        });

        return await EmailService.sendEmail(
            student.email,
            subject,
            htmlBody,
            {
                name: `Reporte_${student.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
                data: pdfBase64
            }
        );
    },

    // Enviar reportes masivos
    sendBulkReports: async (reports, onProgress = null) => {
        const results = [];
        const total = reports.length;

        for (let i = 0; i < reports.length; i++) {
            const report = reports[i];
            
            try {
                const result = await EmailService.sendStudentReport(report.student, report.pdfBlob);
                results.push({
                    student: report.student.name,
                    email: report.student.email,
                    success: true,
                    ...result
                });

                // Callback de progreso
                if (onProgress) {
                    onProgress({
                        current: i + 1,
                        total,
                        student: report.student.name,
                        status: 'success'
                    });
                }
            } catch (error) {
                results.push({
                    student: report.student.name,
                    email: report.student.email,
                    success: false,
                    error: error.message
                });

                // Callback de progreso
                if (onProgress) {
                    onProgress({
                        current: i + 1,
                        total,
                        student: report.student.name,
                        status: 'error',
                        error: error.message
                    });
                }
            }

            // Pequeño delay entre envíos para no saturar
            if (i < reports.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        return results;
    },

    // Configurar correo institucional
    setInstitutionalEmail: (fromEmail, fromName, replyTo) => {
        EmailService.config.fromEmail = fromEmail;
        EmailService.config.fromName = fromName;
        EmailService.config.replyTo = replyTo;
        
        console.log('✅ Configuración de correo actualizada:', EmailService.config);
    },

    // Obtener configuración actual
    getConfig: () => {
        return { ...EmailService.config };
    }
};

export default EmailService;
