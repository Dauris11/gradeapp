// Servicio de WhatsApp para el frontend
// Integración con Twilio WhatsApp API

export const WhatsAppService = {
    /**
     * Verificar estado de WhatsApp
     * @returns {Promise<Object>} Estado
     */
    checkStatus: async () => {
        try {
            const response = await fetch('http://localhost:3001/api/whatsapp/status');
            return await response.json();
        } catch (error) {
            return {
                ready: false,
                message: 'Error al verificar estado'
            };
        }
    },

    /**
     * Obtener código QR para escanear
     * @returns {Promise<Object>} QR Code
     */
    getQRCode: async () => {
        try {
            const response = await fetch('http://localhost:3001/api/whatsapp/qr');
            return await response.json();
        } catch (error) {
            return {
                needsScan: false,
                message: 'Error al obtener QR'
            };
        }
    },

    /**
     * Enviar mensaje de WhatsApp
     * @param {string} to - Número de teléfono (formato: 18091234567 sin +)
     * @param {string} message - Mensaje de texto
     * @returns {Promise} Resultado del envío
     */
    sendMessage: async (to, message) => {
        try {
            console.log('📱 Enviando WhatsApp a:', to);
            
            // Limpiar número (quitar + y espacios)
            const cleanPhone = to.replace(/[+\s-]/g, '');
            
            const response = await fetch('http://localhost:3001/api/whatsapp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: cleanPhone,
                    message
                })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ WhatsApp enviado exitosamente');
                return result;
            } else {
                console.error('❌ Error al enviar WhatsApp:', result.error);
                throw new Error(result.error || 'Error al enviar WhatsApp');
            }
        } catch (error) {
            console.error('❌ Error al enviar WhatsApp:', error);
            throw error;
        }
    },

    /**
     * Generar mensaje de reporte para WhatsApp
     * @param {Object} student - Datos del estudiante
     * @param {string} pdfUrl - URL del PDF (opcional)
     * @returns {string} Mensaje formateado
     */
    generateReportMessage: (student, pdfUrl = null) => {
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
        `.trim();

        if (pdfUrl) {
            message += `\n\n📄 *Descarga tu reporte:*\n${pdfUrl}`;
        }

        return message;
    },

    /**
     * Enviar reporte a estudiante por WhatsApp
     * @param {Object} student - Datos del estudiante
     * @param {string} pdfUrl - URL del PDF (opcional)
     * @returns {Promise} Resultado del envío
     */
    sendStudentReport: async (student, pdfUrl = null) => {
        if (!student.phone) {
            throw new Error(`El estudiante ${student.name} no tiene número de teléfono registrado`);
        }

        const message = WhatsAppService.generateReportMessage(student, pdfUrl);
        
        return await WhatsAppService.sendMessage(
            student.phone,
            message
        );
    },

    /**
     * Enviar mensajes masivos por WhatsApp
     * @param {Array} messages - Array de mensajes
     * @param {Function} onProgress - Callback de progreso
     * @returns {Promise<Array>} Resultados
     */
    sendBulkMessages: async (messages, onProgress = null) => {
        const results = [];
        const total = messages.length;

        for (let i = 0; i < messages.length; i++) {
            const messageData = messages[i];
            
            try {
                const result = await WhatsAppService.sendMessage(
                    messageData.to,
                    messageData.message
                );
                
                results.push({
                    to: messageData.to,
                    student: messageData.student,
                    success: true,
                    ...result
                });

                // Callback de progreso
                if (onProgress) {
                    onProgress({
                        current: i + 1,
                        total,
                        student: messageData.student,
                        status: 'success'
                    });
                }
            } catch (error) {
                results.push({
                    to: messageData.to,
                    student: messageData.student,
                    success: false,
                    error: error.message
                });

                // Callback de progreso
                if (onProgress) {
                    onProgress({
                        current: i + 1,
                        total,
                        student: messageData.student,
                        status: 'error',
                        error: error.message
                    });
                }
            }

            // Delay entre mensajes (1 segundo)
            if (i < messages.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return results;
    },

    /**
     * Validar número de teléfono
     * @param {string} phone - Número de teléfono
     * @returns {Promise<Object>} Validación
     */
    validatePhone: async (phone) => {
        try {
            const response = await fetch('http://localhost:3001/api/whatsapp/validate-phone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone })
            });

            return await response.json();
        } catch (error) {
            return {
                valid: false,
                message: 'Error al validar número'
            };
        }
    },

    /**
     * Verificar configuración de WhatsApp
     * @returns {Promise<Object>} Estado de configuración
     */
    checkConfiguration: async () => {
        try {
            const response = await fetch('http://localhost:3001/api/whatsapp/config');
            return await response.json();
        } catch (error) {
            return {
                configured: false,
                message: 'Error al verificar configuración'
            };
        }
    }
};

export default WhatsAppService;
