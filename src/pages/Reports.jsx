import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Download,
    Mail,
    Users,
    BookOpen,
    CheckCircle,
    XCircle,
    Loader
} from 'lucide-react';
import { studentsAPI, enrollmentsAPI, gradesAPI } from '../services/database';
import PDFService from '../services/pdfService';
import EmailService from '../services/emailService';
import { Toast, useToast } from '../components/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Header = styled.div``;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.slate[500]};
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ActionCard = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ActionIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: ${props => props.$bgColor};
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ActionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
`;

const ActionDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[600]};
  line-height: 1.5;
  flex: 1;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.blue};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StudentsSection = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StudentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const StudentItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.slate[50]};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.slate[200]};
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
`;

const StudentAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.theme.colors.gradients.purple};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const StudentDetails = styled.div`
  flex: 1;
`;

const StudentName = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[800]};
`;

const StudentEmail = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.slate[500]};
`;

const StudentActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const IconButton = styled(motion.button)`
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.$bgColor};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.color};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BulkActionsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary.main};
  border-radius: ${props => props.theme.borderRadius.xl};
  margin-bottom: ${props => props.theme.spacing.md};
  color: white;
`;

const ProgressModal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.lg};
`;

const ProgressCard = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.xl};
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ProgressTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ProgressText = styled.p`
  flex: 1;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[600]};
`;

const Reports = () => {
    const toast = useToast();
    const [students, setStudents] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState([]);
    const [showProgress, setShowProgress] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [studentsData, enrollmentsData, gradesData] = await Promise.all([
                studentsAPI.getAll(),
                enrollmentsAPI.getAll(),
                gradesAPI.getAll()
            ]);

            // Enriquecer enrollments con accumulated
            const enrichedEnrollments = enrollmentsData.map(enrollment => {
                const accumulated = gradesAPI.calculateAccumulated ? gradesAPI.calculateAccumulated(enrollment.id) : null;
                return {
                    ...enrollment,
                    accumulated: accumulated?.accumulated || null
                };
            });

            setStudents(studentsData);
            setEnrollments(enrichedEnrollments);
            setGrades(gradesData);
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar los datos', 'Error');
            setStudents([]);
            setEnrollments([]);
            setGrades([]);
        }
    };

    const handleGenerateConsolidatedPDF = async () => {
        try {
            setIsProcessing(true);
            toast.info('Generando reporte consolidado...', 'Procesando');

            console.log('Iniciando generación de PDF consolidado...');
            console.log('Estudiantes:', students.length);
            console.log('Inscripciones:', enrollments.length);
            console.log('Calificaciones:', grades.length);

            const doc = await PDFService.generateConsolidatedReport(students, enrollments, grades);

            console.log('PDF generado exitosamente');
            PDFService.downloadPDF(doc, `Reporte_Consolidado_${Date.now()}.pdf`);

            toast.success('Reporte consolidado generado exitosamente', 'Éxito');
        } catch (error) {
            console.error('Error al generar reporte consolidado:', error);
            toast.error(`Error al generar el reporte: ${error.message}`, 'Error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateStudentPDF = async (student) => {
        try {
            console.log('Generando PDF para:', student.name);
            const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
            console.log('Inscripciones del estudiante:', studentEnrollments.length);

            const doc = await PDFService.generateStudentReport(student, studentEnrollments, grades);
            PDFService.downloadPDF(doc, `Reporte_${student.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);

            toast.success(`Reporte de ${student.name} descargado`, 'Éxito');
        } catch (error) {
            console.error(`Error al generar reporte de ${student.name}:`, error);
            toast.error(`Error: ${error.message}`, 'Error');
        }
    };

    const handleSendStudentEmail = async (student) => {
        try {
            const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
            const doc = await PDFService.generateStudentReport(student, studentEnrollments, grades);
            const pdfBlob = PDFService.getPDFBlob(doc);

            const result = await EmailService.sendStudentReport(student, pdfBlob);

            if (result.success) {
                toast.success(`Email enviado a ${student.name}`, 'Éxito');
            }
        } catch (error) {
            toast.error(`Error al enviar email a ${student.name}`, 'Error');
        }
    };

    const handleSendBulkEmails = async () => {
        if (selectedStudents.length === 0) {
            toast.warning('Selecciona al menos un estudiante', 'Advertencia');
            return;
        }

        setIsProcessing(true);
        setShowProgress(true);
        setProgress([]);

        const reports = [];

        for (const studentId of selectedStudents) {
            const student = students.find(s => s.id === studentId);
            const studentEnrollments = enrollments.filter(e => e.studentId === studentId);

            try {
                const doc = await PDFService.generateStudentReport(student, studentEnrollments, grades);
                const pdfBlob = PDFService.getPDFBlob(doc);

                reports.push({ student, pdfBlob });

                setProgress(prev => [...prev, {
                    student: student.name,
                    status: 'generated',
                    message: 'PDF generado'
                }]);
            } catch (error) {
                setProgress(prev => [...prev, {
                    student: student.name,
                    status: 'error',
                    message: 'Error al generar PDF'
                }]);
            }
        }

        // Enviar emails
        const results = await EmailService.sendBulkReports(reports);

        results.forEach(result => {
            setProgress(prev => prev.map(p =>
                p.student === result.student
                    ? { ...p, status: result.success ? 'sent' : 'error', message: result.success ? 'Email enviado' : result.error }
                    : p
            ));
        });

        const successCount = results.filter(r => r.success).length;
        toast.success(`${successCount} de ${results.length} emails enviados exitosamente`, 'Proceso Completado');

        setIsProcessing(false);
        setSelectedStudents([]);
    };

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const toggleSelectAll = () => {
        setSelectedStudents(prev =>
            prev.length === students.length ? [] : students.map(s => s.id)
        );
    };

    return (
        <Container>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />

            <Header>
                <Title>Reportes y Calificaciones</Title>
                <Subtitle>Genera y envía reportes académicos en PDF</Subtitle>
            </Header>

            <ActionsGrid>
                <ActionCard
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                >
                    <ActionIcon $bgColor="rgba(59, 130, 246, 0.1)" color="#3B82F6">
                        <FileText size={28} />
                    </ActionIcon>
                    <ActionTitle>Reporte Consolidado</ActionTitle>
                    <ActionDescription>
                        Genera un reporte PDF con las calificaciones de todos los estudiantes en formato de tabla consolidada.
                    </ActionDescription>
                    <ActionButton
                        onClick={handleGenerateConsolidatedPDF}
                        disabled={isProcessing}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isProcessing ? <Loader className="animate-spin" size={18} /> : <Download size={18} />}
                        Generar PDF
                    </ActionButton>
                </ActionCard>

                <ActionCard
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                >
                    <ActionIcon $bgColor="rgba(34, 197, 94, 0.1)" color="#22C55E">
                        <Mail size={28} />
                    </ActionIcon>
                    <ActionTitle>Envío Masivo</ActionTitle>
                    <ActionDescription>
                        Selecciona estudiantes y envía sus reportes individuales por email de forma automática.
                    </ActionDescription>
                    <ActionButton
                        onClick={handleSendBulkEmails}
                        disabled={isProcessing || selectedStudents.length === 0}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isProcessing ? <Loader className="animate-spin" size={18} /> : <Mail size={18} />}
                        Enviar Seleccionados ({selectedStudents.length})
                    </ActionButton>
                </ActionCard>
            </ActionsGrid>

            <StudentsSection>
                <SectionTitle>Estudiantes</SectionTitle>

                {students.length > 0 && (
                    <BulkActionsBar>
                        <span>{selectedStudents.length} de {students.length} seleccionados</span>
                        <ActionButton
                            onClick={toggleSelectAll}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {selectedStudents.length === students.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                        </ActionButton>
                    </BulkActionsBar>
                )}

                <StudentsList>
                    {students.map(student => (
                        <StudentItem
                            key={student.id}
                            whileHover={{ x: 5 }}
                        >
                            <StudentInfo>
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => toggleStudentSelection(student.id)}
                                    style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                />
                                <StudentAvatar>
                                    {student.name.charAt(0).toUpperCase()}
                                </StudentAvatar>
                                <StudentDetails>
                                    <StudentName>{student.name}</StudentName>
                                    <StudentEmail>{student.email}</StudentEmail>
                                </StudentDetails>
                            </StudentInfo>
                            <StudentActions>
                                <IconButton
                                    $bgColor="rgba(59, 130, 246, 0.1)"
                                    color="#3B82F6"
                                    onClick={() => handleGenerateStudentPDF(student)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Descargar PDF"
                                >
                                    <Download size={18} />
                                </IconButton>
                                <IconButton
                                    $bgColor="rgba(34, 197, 94, 0.1)"
                                    color="#22C55E"
                                    onClick={() => handleSendStudentEmail(student)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Enviar por Email"
                                >
                                    <Mail size={18} />
                                </IconButton>
                            </StudentActions>
                        </StudentItem>
                    ))}
                </StudentsList>
            </StudentsSection>

            <AnimatePresence>
                {showProgress && (
                    <ProgressModal
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isProcessing && setShowProgress(false)}
                    >
                        <ProgressCard
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ProgressTitle>Progreso de Envío</ProgressTitle>
                            {progress.map((item, index) => (
                                <ProgressItem key={index}>
                                    {item.status === 'generated' && <Loader className="animate-spin" size={20} color="#3B82F6" />}
                                    {item.status === 'sent' && <CheckCircle size={20} color="#22C55E" />}
                                    {item.status === 'error' && <XCircle size={20} color="#EF4444" />}
                                    <ProgressText>
                                        <strong>{item.student}</strong>: {item.message}
                                    </ProgressText>
                                </ProgressItem>
                            ))}
                            {!isProcessing && (
                                <ActionButton
                                    onClick={() => setShowProgress(false)}
                                    style={{ marginTop: '1rem' }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cerrar
                                </ActionButton>
                            )}
                        </ProgressCard>
                    </ProgressModal>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default Reports;
