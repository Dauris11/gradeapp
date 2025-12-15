// Servicio de envío de emails
// NOTA: Este es un servicio simulado para desarrollo
// Para producción, necesitarás un backend con servicios como:
// - SendGrid, Mailgun, AWS SES, o similar

export const EmailService = {
    // Simular envío de email (para desarrollo)
    sendEmail: async (to, subject, body, attachment = null) => {
        console.log('📧 Simulando envío de email...');
        console.log('Para:', to);
        console.log('Asunto:', subject);
        console.log('Cuerpo:', body);
        if (attachment) {
            console.log('Adjunto:', attachment.name);
        }

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simular éxito (90% de probabilidad)
        if (Math.random() > 0.1) {
            return {
                success: true,
                message: `Email enviado exitosamente a ${to}`,
                messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };
        } else {
            throw new Error('Error simulado al enviar email');
        }
    },

    // Enviar reporte individual a estudiante
    sendStudentReport: async (student, pdfBlob) => {
        const subject = `📊 Tu Reporte Académico - ${new Date().toLocaleDateString('es-ES')}`;
        const body = `
Hola ${student.name},

Adjunto encontrarás tu reporte académico actualizado con tus calificaciones y progreso.

Este reporte incluye:
- Tus calificaciones por materia
- Promedio de tareas y exámenes
- Calificación acumulada
- Estado de aprobación

Si tienes alguna pregunta sobre tus calificaciones, no dudes en contactarnos.

Saludos cordiales,
GradeApp - Sistema de Gestión Académica
        `.trim();

        return await EmailService.sendEmail(
            student.email,
            subject,
            body,
            {
                name: `Reporte_${student.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
                data: pdfBlob
            }
        );
    },

    // Enviar reportes masivos
    sendBulkReports: async (reports) => {
        const results = [];
        
        for (const report of reports) {
            try {
                const result = await EmailService.sendStudentReport(report.student, report.pdfBlob);
                results.push({
                    student: report.student.name,
                    email: report.student.email,
                    success: true,
                    ...result
                });
            } catch (error) {
                results.push({
                    student: report.student.name,
                    email: report.student.email,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    },

    // Configuración para producción con SendGrid (ejemplo)
    configureProduction: () => {
        return {
            instructions: `
Para usar en producción, necesitas:

1. Crear un backend (Node.js/Express recomendado)
2. Instalar un servicio de email:
   
   npm install @sendgrid/mail
   
3. Configurar el servicio:

   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

4. Crear endpoint para enviar emails:

   app.post('/api/send-report', async (req, res) => {
       const { to, subject, html, attachment } = req.body;
       
       const msg = {
           to,
           from: 'noreply@tudominio.com',
           subject,
           html,
           attachments: [{
               content: attachment.data,
               filename: attachment.name,
               type: 'application/pdf',
               disposition: 'attachment'
           }]
       };
       
       try {
           await sgMail.send(msg);
           res.json({ success: true });
       } catch (error) {
           res.status(500).json({ success: false, error: error.message });
       }
   });

5. Actualizar el frontend para llamar al endpoint:

   const response = await fetch('/api/send-report', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
           to: student.email,
           subject: 'Tu Reporte Académico',
           html: emailBody,
           attachment: {
               name: 'reporte.pdf',
               data: pdfBase64
           }
       })
   });

Alternativas a SendGrid:
- Mailgun: https://www.mailgun.com/
- AWS SES: https://aws.amazon.com/ses/
- Postmark: https://postmarkapp.com/
- Resend: https://resend.com/
            `.trim()
        };
    }
};

export default EmailService;
