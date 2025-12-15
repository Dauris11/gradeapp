import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Servicio para generar reportes en PDF
export const PDFService = {
    // Generar reporte individual de estudiante
    generateStudentReport: async (student, enrollments, grades) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Colores del tema
        const primaryColor = [59, 130, 246]; // #3B82F6
        const secondaryColor = [37, 99, 235]; // #2563EB
        const textColor = [30, 41, 59]; // #1E293B
        const grayColor = [148, 163, 184]; // #94A3B8

        // Header con gradiente simulado
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        doc.setFillColor(...secondaryColor);
        doc.rect(0, 35, pageWidth, 5, 'F');

        // Logo izquierdo (opcional - si falla, continúa sin logo)
        try {
            const logoPath = window.location.origin + '/imagenes/logo-principal.png';
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            
            await new Promise((resolve) => {
                logoImg.onload = () => {
                    try {
                        // Calcular dimensiones manteniendo proporción
                        const maxWidth = 30;
                        const maxHeight = 25;
                        const imgRatio = logoImg.width / logoImg.height;
                        
                        let width = maxWidth;
                        let height = maxWidth / imgRatio;
                        
                        if (height > maxHeight) {
                            height = maxHeight;
                            width = maxHeight * imgRatio;
                        }
                        
                        // Centrar verticalmente en el header
                        const yPos = 8 + (maxHeight - height) / 2;
                        
                        doc.addImage(logoImg, 'PNG', 15, yPos, width, height);
                        resolve();
                    } catch (e) {
                        console.warn('No se pudo agregar el logo al PDF');
                        resolve();
                    }
                };
                logoImg.onerror = () => {
                    console.warn('Logo no disponible, continuando sin logo');
                    resolve();
                };
                logoImg.src = logoPath;
                setTimeout(() => resolve(), 2000);
            });
        } catch (error) {
            console.warn('Error al cargar logo, continuando sin logo:', error);
        }

        // Espacio para segundo logo (esquina derecha)
        // Placeholder para logo secundario que se agregará después
        try {
            const logo2Path = window.location.origin + '/imagenes/logo-secundario.png';
            const logo2Img = new Image();
            logo2Img.crossOrigin = 'Anonymous';
            
            await new Promise((resolve) => {
                logo2Img.onload = () => {
                    try {
                        // Calcular dimensiones manteniendo proporción
                        const maxWidth = 30;
                        const maxHeight = 25;
                        const imgRatio = logo2Img.width / logo2Img.height;
                        
                        let width = maxWidth;
                        let height = maxWidth / imgRatio;
                        
                        if (height > maxHeight) {
                            height = maxHeight;
                            width = maxHeight * imgRatio;
                        }
                        
                        // Posicionar en esquina derecha
                        const xPos = pageWidth - 15 - width;
                        const yPos = 8 + (maxHeight - height) / 2;
                        
                        doc.addImage(logo2Img, 'PNG', xPos, yPos, width, height);
                        resolve();
                    } catch (e) {
                        console.warn('Logo secundario no disponible');
                        resolve();
                    }
                };
                logo2Img.onerror = () => {
                    // Silenciosamente continuar sin logo secundario
                    resolve();
                };
                logo2Img.src = logo2Path;
                setTimeout(() => resolve(), 1000);
            });
        } catch (error) {
            // Silenciosamente continuar sin logo secundario
        }


        // Título del reporte
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('REPORTE ACADÉMICO', pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Sistema de Gestión de Calificaciones', pageWidth / 2, 30, { align: 'center' });

        // Información del estudiante
        let yPos = 55;
        doc.setTextColor(...textColor);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Información del Estudiante', 15, yPos);

        yPos += 10;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        const studentInfo = [
            ['Nombre:', student.name],
            ['Email:', student.email],
            ['Teléfono:', student.phone || 'N/A'],
            ['Fecha de Inscripción:', student.enrollmentDate || 'N/A'],
            ['Fecha del Reporte:', new Date().toLocaleDateString('es-ES')]
        ];

        studentInfo.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, 15, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(value, 60, yPos);
            yPos += 7;
        });

        // Resumen de calificaciones
        yPos += 5;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('Resumen de Calificaciones', 15, yPos);

        yPos += 10;


        // Tabla de materias y calificaciones
        const tableData = enrollments.map(enrollment => {
            const enrollmentGrades = grades.filter(g => g.enrollmentId === enrollment.id);
            
            const assignments = enrollmentGrades.filter(g => g.type === 'assignment');
            const exams = enrollmentGrades.filter(g => g.type === 'exam');
            
            const assignmentAvg = assignments.length > 0
                ? (assignments.reduce((sum, g) => sum + g.score, 0) / assignments.length).toFixed(1)
                : 'N/A';
            
            const examAvg = exams.length > 0
                ? (exams.reduce((sum, g) => sum + g.score, 0) / exams.length).toFixed(1)
                : 'N/A';
            
            // Manejar accumulated que puede ser un objeto o un número
            let accumulated = 'N/A';
            if (enrollment.accumulated !== null && enrollment.accumulated !== undefined) {
                if (typeof enrollment.accumulated === 'object' && enrollment.accumulated.accumulated !== undefined) {
                    // Es un objeto con la propiedad accumulated
                    accumulated = enrollment.accumulated.accumulated.toFixed(1);
                } else if (typeof enrollment.accumulated === 'number') {
                    // Es un número directo
                    accumulated = enrollment.accumulated.toFixed(1);
                }
            }

            const status = accumulated !== 'N/A' && parseFloat(accumulated) >= 70 ? 'Aprobado' : 'En Progreso';

            return [
                enrollment.subjectName,
                enrollment.subjectCode,
                assignmentAvg,
                examAvg,
                accumulated,
                status
            ];
        });


        autoTable(doc, {
            startY: yPos,
            head: [['Materia', 'Código', 'Tareas', 'Exámenes', 'Acumulado', 'Estado']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 10
            },
            bodyStyles: {
                fontSize: 9,
                textColor: textColor
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: {
                0: { cellWidth: 45 },  // Materia (reducido de 50)
                1: { cellWidth: 22 },  // Código (reducido de 25)
                2: { cellWidth: 22, halign: 'center' },  // Tareas (reducido de 25)
                3: { cellWidth: 22, halign: 'center' },  // Exámenes (reducido de 25)
                4: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },  // Acumulado (reducido de 25)
                5: { cellWidth: 28, halign: 'center' }  // Estado (reducido de 30)
            },
            didParseCell: function(data) {
                if (data.column.index === 5 && data.section === 'body') {
                    if (data.cell.text[0] === 'Aprobado') {
                        data.cell.styles.textColor = [34, 197, 94]; // Verde
                        data.cell.styles.fontStyle = 'bold';
                    } else {
                        data.cell.styles.textColor = [249, 115, 22]; // Naranja
                    }
                }
            }
        });


        // Promedio general
        const validAccumulated = enrollments.filter(e => e.accumulated !== null && e.accumulated !== undefined);
        const generalAverage = validAccumulated.length > 0
            ? (validAccumulated.reduce((sum, e) => {
                // Manejar accumulated que puede ser objeto o número
                const accValue = typeof e.accumulated === 'object' && e.accumulated.accumulated !== undefined
                    ? e.accumulated.accumulated
                    : (typeof e.accumulated === 'number' ? e.accumulated : 0);
                return sum + accValue;
            }, 0) / validAccumulated.length).toFixed(1)
            : 'N/A';


        yPos = doc.lastAutoTable.finalY + 15;

        // Caja de promedio general
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(15, yPos - 5, pageWidth - 30, 20, 3, 3, 'F');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...textColor);
        doc.text('Promedio General:', 20, yPos + 5);
        
        doc.setFontSize(18);
        doc.setTextColor(...primaryColor);
        doc.text(generalAverage + '%', pageWidth - 25, yPos + 5, { align: 'right' });

        // Footer
        const footerY = pageHeight - 20;
        doc.setDrawColor(...grayColor);
        doc.setLineWidth(0.5);
        doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
        
        doc.setFontSize(9);
        doc.setTextColor(...grayColor);
        doc.setFont('helvetica', 'normal');
        doc.text('GradeApp - Sistema de Gestión Académica', pageWidth / 2, footerY, { align: 'center' });
        doc.text(`Generado el ${new Date().toLocaleString('es-ES')}`, pageWidth / 2, footerY + 5, { align: 'center' });
        doc.text('Página 1 de 1', pageWidth - 15, footerY, { align: 'right' });

        return doc;
    },

    // Generar reporte consolidado de todos los estudiantes
    generateConsolidatedReport: async (students, enrollments, grades) => {
        const doc = new jsPDF('landscape');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const primaryColor = [59, 130, 246];
        const secondaryColor = [37, 99, 235];
        const textColor = [30, 41, 59];
        const grayColor = [148, 163, 184];

        // Header
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        doc.setFillColor(...secondaryColor);
        doc.rect(0, 30, pageWidth, 5, 'F');

        // Logo izquierdo (opcional)
        try {
            const logoPath = window.location.origin + '/imagenes/logo-principal.png';
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            
            await new Promise((resolve) => {
                logoImg.onload = () => {
                    try {
                        // Calcular dimensiones manteniendo proporción
                        const maxWidth = 30;
                        const maxHeight = 25;
                        const imgRatio = logoImg.width / logoImg.height;
                        
                        let width = maxWidth;
                        let height = maxWidth / imgRatio;
                        
                        if (height > maxHeight) {
                            height = maxHeight;
                            width = maxHeight * imgRatio;
                        }
                        
                        // Centrar verticalmente
                        const yPos = 5 + (maxHeight - height) / 2;
                        
                        doc.addImage(logoImg, 'PNG', 15, yPos, width, height);
                        resolve();
                    } catch (e) {
                        resolve();
                    }
                };
                logoImg.onerror = () => resolve();
                logoImg.src = logoPath;
                setTimeout(() => resolve(), 2000);
            });
        } catch (error) {
            console.warn('Logo no disponible en reporte consolidado');
        }

        // Logo secundario (esquina derecha)
        try {
            const logo2Path = window.location.origin + '/imagenes/logo-secundario.png';
            const logo2Img = new Image();
            logo2Img.crossOrigin = 'Anonymous';
            
            await new Promise((resolve) => {
                logo2Img.onload = () => {
                    try {
                        // Calcular dimensiones manteniendo proporción
                        const maxWidth = 30;
                        const maxHeight = 25;
                        const imgRatio = logo2Img.width / logo2Img.height;
                        
                        let width = maxWidth;
                        let height = maxWidth / imgRatio;
                        
                        if (height > maxHeight) {
                            height = maxHeight;
                            width = maxHeight * imgRatio;
                        }
                        
                        // Posicionar en esquina derecha
                        const xPos = pageWidth - 15 - width;
                        const yPos = 5 + (maxHeight - height) / 2;
                        
                        doc.addImage(logo2Img, 'PNG', xPos, yPos, width, height);
                        resolve();
                    } catch (e) {
                        resolve();
                    }
                };
                logo2Img.onerror = () => resolve();
                logo2Img.src = logo2Path;
                setTimeout(() => resolve(), 1000);
            });
        } catch (error) {
            // Silenciosamente continuar
        }


        // Título
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('REPORTE CONSOLIDADO DE CALIFICACIONES', pageWidth / 2, 18, { align: 'center' });
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, 26, { align: 'center' });

        // Tabla consolidada
        const tableData = students.map(student => {
            const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
            const totalSubjects = studentEnrollments.length;
            
            const validAccumulated = studentEnrollments.filter(e => e.accumulated !== null && e.accumulated !== undefined);
            const average = validAccumulated.length > 0
                ? (validAccumulated.reduce((sum, e) => {
                    // Manejar accumulated que puede ser objeto o número
                    const accValue = typeof e.accumulated === 'object' && e.accumulated.accumulated !== undefined
                        ? e.accumulated.accumulated
                        : (typeof e.accumulated === 'number' ? e.accumulated : 0);
                    return sum + accValue;
                }, 0) / validAccumulated.length).toFixed(1)
                : 'N/A';
            
            const approved = validAccumulated.filter(e => {
                const accValue = typeof e.accumulated === 'object' && e.accumulated.accumulated !== undefined
                    ? e.accumulated.accumulated
                    : (typeof e.accumulated === 'number' ? e.accumulated : 0);
                return accValue >= 70;
            }).length;
            const pending = totalSubjects - approved;

            return [
                student.name,
                student.email,
                totalSubjects,
                approved,
                pending,
                average + '%'
            ];
        });


        autoTable(doc, {
            startY: 45,
            head: [['Estudiante', 'Email', 'Total Materias', 'Aprobadas', 'Pendientes', 'Promedio']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 10
            },
            bodyStyles: {
                fontSize: 9,
                textColor: textColor
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 70 },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 30, halign: 'center' },
                4: { cellWidth: 30, halign: 'center' },
                5: { cellWidth: 30, halign: 'center', fontStyle: 'bold' }
            }
        });


        // Footer
        const footerY = pageHeight - 15;
        doc.setDrawColor(...grayColor);
        doc.setLineWidth(0.5);
        doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
        
        doc.setFontSize(9);
        doc.setTextColor(...grayColor);
        doc.setFont('helvetica', 'normal');
        doc.text('GradeApp - Sistema de Gestión Académica', pageWidth / 2, footerY, { align: 'center' });
        doc.text('Página 1 de 1', pageWidth - 15, footerY, { align: 'right' });

        return doc;
    },

    // Descargar PDF
    downloadPDF: (doc, filename) => {
        doc.save(filename);
    },

    // Obtener PDF como blob para envío por email
    getPDFBlob: (doc) => {
        return doc.output('blob');
    }
};

export default PDFService;
