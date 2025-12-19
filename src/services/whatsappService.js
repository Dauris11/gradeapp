const WhatsAppService = {
    /**
     * Verificar estado de WhatsApp (Mock para compatibilidad)
     */
    checkStatus: async () => {
        return {
            ready: true,
            message: 'Modo Web Directo'
        };
    },

    /**
     * Obtener código QR (Mock para compatibilidad)
     */
    getQRCode: async () => {
        return {
            needsScan: false,
            message: 'No requerido'
        };
    },

    /**
     * Enviar mensaje de WhatsApp (Redirección a Web)
     */
    sendMessage: async (to, message) => {
        return new Promise((resolve, reject) => {
            try {
                console.log('📱 Abriendo WhatsApp Web para:', to);
                
                // Limpiar número
                const cleanPhone = to.replace(/[+\s-]/g, '');
                
                // Codificar mensaje para URL
                const encodedMessage = encodeURIComponent(message);
                
                // Crear URL de WhatsApp Web
                const url = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
                
                // Abrir en nueva pestaña
                const newWindow = window.open(url, '_blank');
                
                // Si el navegador bloqueó el popup
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    throw new Error('El navegador bloqueó la ventana emergente de WhatsApp');
                }

                resolve({ success: true, message: 'WhatsApp Web abierto' });
            } catch (error) {
                console.error('❌ Error al abrir WhatsApp:', error);
                reject(error);
            }
        });
    },

    /**
     * Generar mensaje de reporte con calificaciones
     */
    generateReportMessage: (student, enrollments = [], grades = []) => {
        const currentDate = new Date().toLocaleDateString('es-ES', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });

        // Construir resumen de calificaciones
        let gradesSummary = '';
        
        if (enrollments.length > 0 && grades.length > 0) {
            gradesSummary = '\n📋 *Resumen de Calificaciones:*\n';
            
            enrollments.forEach(enrollment => {
                const subjectGrades = grades.filter(g => g.enrollmentId === enrollment.id);
                if (subjectGrades.length > 0) {
                    gradesSummary += `\n📘 *${enrollment.subjectName}*:`;
                    
                    // Agrupar por componente (Tareas, Exámenes)
                    const components = {};
                    subjectGrades.forEach(g => {
                        if (!components[g.componentName]) components[g.componentName] = 0;
                        components[g.componentName] += g.score;
                    });

                    // Listar puntajes (esto es un ejemplo simple, se podría mejorar la lógica de promedio)
                    // Si el sistema guarda el score real de cada entrega, tal vez queramos mostrar el total acumulado
                    // O el acumulado calculado en enrollment.accumulated si viniera pre-calculado
                    
                    if (enrollment.accumulated !== undefined && enrollment.accumulated !== null) {
                         gradesSummary += ` ${enrollment.accumulated} pts`;
                    } else {
                        // Fallback: mostrar detalles
                        subjectGrades.forEach(g => {
                            gradesSummary += `\n   - ${g.name}: ${g.score}/${g.maxScore}`;
                        });
                    }
                }
            });
            gradesSummary += '\n';
        }

        return `
🎓 *GradeApp - Reporte Académico*

¡Hola ${student.name}! 👋

Te envío tu reporte de calificaciones al día ${currentDate}.
${gradesSummary}
💡 *Recuerda:* Tu dedicación es clave para el éxito. ¡Sigue adelante!

Si tienes dudas, por favor contáctame.

Atte. Tu Profesor
        `.trim();
    },

    /**
     * Enviar mensajes masivos (Iterativo con pausas para abrir pestañas)
     */
    sendBulkMessages: async (messages, onProgress = null) => {
        const results = [];
        const total = messages.length;

        for (let i = 0; i < messages.length; i++) {
            const messageData = messages[i];
            
            try {
                // En modo web, "enviar" masivo significa abrir muchas pestañas. 
                // Es intrusivo, pero es lo que hay sin API oficial.
                // Pedimos confirmación o pausa? No, el usuario pidió acción.
                // Tal vez un alert entre cada uno o simplemente abrirlo.
                
                await WhatsAppService.sendMessage(
                    messageData.to,
                    messageData.message
                );
                
                results.push({
                    to: messageData.to,
                    student: messageData.student,
                    success: true
                });

                if (onProgress) {
                    onProgress({
                        current: i + 1,
                        total,
                        student: messageData.student,
                        status: 'success'
                    });
                }
                
                // Pequeña pausa para no colapsar el navegador
                await new Promise(resolve => setTimeout(resolve, 800));

            } catch (error) {
                results.push({
                    to: messageData.to,
                    student: messageData.student,
                    success: false,
                    error: error.message
                });
                
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
        }

        return results;
    },

    validatePhone: async (phone) => {
        // Validación local simple
        const clean = phone.replace(/[^\d]/g, '');
        return {
            valid: clean.length >= 10,
            message: clean.length >= 10 ? 'Válido' : 'Muy corto'
        };
    },
    
    checkConfiguration: async () => ({ configured: true })
};

export default WhatsAppService;
