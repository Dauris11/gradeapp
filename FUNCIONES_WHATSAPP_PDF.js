// Funciones mejoradas para WhatsApp y PDF - Agregar después de loadData() en Reports.jsx

    // Manejar descarga de PDF individual
    const handleDownloadPDF = async (student) => {
        try {
            // Marcar como descargando
            setDownloadingPDF(prev => ({ ...prev, [student.id]: true }));
            
            // Obtener datos del estudiante
            const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
            const studentGrades = grades.filter(g => 
                studentEnrollments.some(e => e.id === g.enrollmentId)
            );
            
            // Generar PDF
            const doc = await PDFService.generateStudentReport(
                student,
                studentEnrollments,
                studentGrades
            );
            
            // Descargar
            PDFService.downloadPDF(doc, `Reporte_${student.name.replace(/\s+/g, '_')}.pdf`);
            
            toast.success(`Reporte de ${student.name} descargado`, 'Éxito');
        } catch (error) {
            console.error('Error downloading PDF:', error);
            toast.error('Error al descargar el reporte', 'Error');
        } finally {
            setDownloadingPDF(prev => ({ ...prev, [student.id]: false }));
        }
    };

    // Manejar envío por WhatsApp
    const handleSendWhatsApp = async (student) => {
        // Verificar si tiene teléfono
        if (!student.phone || student.phone.trim() === '') {
            // Mostrar modal para ingresar teléfono
            setCurrentStudent(student);
            setPhoneInput('');
            setShowPhoneModal(true);
            return;
        }
        
        // Enviar con el teléfono registrado
        await sendWhatsAppMessage(student, student.phone);
    };

    // Enviar mensaje de WhatsApp
    const sendWhatsAppMessage = async (student, phone) => {
        try {
            // Marcar como enviando
            setSendingWhatsApp(prev => ({ ...prev, [student.id]: true }));
            
            // Generar mensaje
            const message = WhatsAppService.generateReportMessage(student);
            
            // Enviar
            await WhatsAppService.sendMessage(phone, message);
            
            toast.success(`Reporte enviado a ${student.name}`, 'Éxito');
            
            // Cerrar modal si está abierto
            setShowPhoneModal(false);
            setCurrentStudent(null);
            setPhoneInput('');
            
        } catch (error) {
            console.error('Error sending WhatsApp:', error);
            toast.error(error.message || 'Error al enviar por WhatsApp', 'Error');
        } finally {
            setSendingWhatsApp(prev => ({ ...prev, [student.id]: false }));
        }
    };

    // Confirmar envío con teléfono ingresado
    const handleConfirmPhone = async () => {
        if (!phoneInput || phoneInput.trim() === '') {
            toast.error('Por favor ingresa un número de teléfono', 'Error');
            return;
        }
        
        // Validar formato básico
        const cleanPhone = phoneInput.replace(/[^\d]/g, '');
        if (cleanPhone.length < 10) {
            toast.error('El número debe tener al menos 10 dígitos', 'Error');
            return;
        }
        
        await sendWhatsAppMessage(currentStudent, cleanPhone);
    };
