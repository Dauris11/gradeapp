import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
    Award,
    Plus,
    Edit,
    Trash2,
    BookOpen,
    Users,
    FileText,
    ClipboardCheck,
    X,
    TrendingUp,
    Download
} from 'lucide-react';
import { enrollmentsAPI, gradesAPI, studentsAPI } from '../services/database';
import PDFService from '../services/pdfService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.slate[500]};
`;

const FiltersCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: ${props => props.theme.spacing.lg};
`;

const Select = styled.select`
  width: 100%;
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.slate[800]};
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const EnrollmentCard = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  overflow: hidden;
`;

const ColorBar = styled.div`
  height: 0.5rem;
  background: linear-gradient(to right, ${props => props.color});
`;

const CardContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.slate[200]};
`;

const StudentInfo = styled.div``;

const StudentName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
`;

const SubjectName = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[500]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.xs};
`;

const AddButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.blue};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
`;

const AccumulatedSection = styled.div`
  background: ${props => props.theme.colors.slate[50]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ReportButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.theme.colors.gradients.blue};
  color: white;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.md};
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
`;

const AccumulatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.md};
`;

const StatBox = styled.div`
  text-align: center;
`;

const StatLabel = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.slate[500]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatValue = styled.p`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.color || props.theme.colors.slate[800]};
`;

const GradesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const SectionTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[700]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const GradesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const GradeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: white;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const GradeName = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[700]};
`;

const GradeScore = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.color};
`;

const IconButton = styled(motion.button)`
  width: 1.75rem;
  height: 1.75rem;
  background: ${props => props.bgColor};
  color: ${props => props.color};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: ${props => props.theme.spacing.md};
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  max-width: 28rem;
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.slate[700]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.slate[800]};
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
`;

const CancelButton = styled(motion.button)`
  flex: 1;
  background: ${props => props.theme.colors.slate[200]};
  color: ${props => props.theme.colors.slate[800]};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: none;
  cursor: pointer;
`;

const SubmitButton = styled(motion.button)`
  flex: 1;
  background: ${props => props.theme.colors.gradients.blue};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
`;

const GradeManagement = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [enrollments, setEnrollments] = useState([]);
    const [selectedEnrollment, setSelectedEnrollment] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEnrollmentId, setCurrentEnrollmentId] = useState(null);
    const [formData, setFormData] = useState({
        type: 'assignment',
        name: '',
        score: '',
        maxScore: 100,
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        // Check if there's an enrollment parameter in the URL
        const enrollmentParam = searchParams.get('enrollment');
        if (enrollmentParam && enrollments.length > 0) {
            const enrollmentId = parseInt(enrollmentParam);
            const enrollment = enrollments.find(e => e.id === enrollmentId);

            if (enrollment) {
                setSelectedEnrollment(enrollmentId.toString());
                handleAddGrade(enrollmentId);
                // Remove the parameter from URL
                searchParams.delete('enrollment');
                setSearchParams(searchParams);
            }
        }
    }, [searchParams, enrollments]);

    const loadData = async () => {
        try {
            const allEnrollments = await enrollmentsAPI.getAll();

            // Add grades and accumulated data to each enrollment
            const enrichedEnrollments = await Promise.all(allEnrollments.map(async enrollment => {
                const grades = await gradesAPI.getByEnrollment(enrollment.id);
                const accumulated = gradesAPI.calculateAccumulated ? gradesAPI.calculateAccumulated(enrollment.id) : null;
                return {
                    ...enrollment,
                    grades: grades || [],
                    accumulated
                };
            }));

            setEnrollments(enrichedEnrollments);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setEnrollments([]);
        }
    };

    const filteredEnrollments = selectedEnrollment === 'all'
        ? enrollments
        : enrollments.filter(e => e.id === parseInt(selectedEnrollment));

    const handleAddGrade = (enrollmentId) => {
        setCurrentEnrollmentId(enrollmentId);
        setFormData({
            type: 'assignment',
            name: '',
            score: '',
            maxScore: 100,
            date: new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await gradesAPI.create({
                enrollmentId: currentEnrollmentId,
                type: formData.type,
                name: formData.name,
                score: parseFloat(formData.score),
                maxScore: parseFloat(formData.maxScore),
                date: formData.date
            });

            await loadData();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error guardando calificación:', error);
            alert('Error al guardar la calificación');
        }
    };

    const handleDeleteGrade = async (gradeId) => {
        if (confirm('¿Eliminar esta calificación?')) {
            try {
                await gradesAPI.delete(gradeId);
                await loadData();
            } catch (error) {
                console.error('Error eliminando calificación:', error);
                alert('Error al eliminar la calificación');
            }
        }
    };

    const getGradeColor = (score) => {
        if (score >= 90) return '#22C55E';
        if (score >= 80) return '#3B82F6';
        if (score >= 70) return '#F97316';
        return '#EF4444';
    };

    const handleGenerateReport = async (enrollment) => {
        try {
            console.log('Generando reporte para:', enrollment.studentName);

            // Obtener el estudiante completo
            const allStudents = await studentsAPI.getAll();
            const student = allStudents.find(s => s.name === enrollment.studentName);
            if (!student) {
                alert('No se encontró la información del estudiante');
                return;
            }

            // Obtener todas las inscripciones del estudiante
            const studentEnrollments = enrollments.filter(e => e.studentId === student.id);

            // Obtener todas las calificaciones
            const allGrades = await gradesAPI.getAll();

            console.log('Generando PDF...');
            const doc = await PDFService.generateStudentReport(student, studentEnrollments, allGrades);
            PDFService.downloadPDF(doc, `Reporte_${student.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);

            console.log('PDF generado exitosamente');
        } catch (error) {
            console.error('Error al generar reporte:', error);
            alert(`Error al generar el reporte: ${error.message}`);
        }
    };

    return (
        <Container>
            <div>
                <Title>Gestión de Calificaciones</Title>
                <Subtitle>Administra asignaciones, exámenes y visualiza acumulados</Subtitle>
            </div>

            <FiltersCard>
                <Label>Filtrar por Inscripción</Label>
                <Select
                    value={selectedEnrollment}
                    onChange={(e) => setSelectedEnrollment(e.target.value)}
                >
                    <option value="all">Todas las inscripciones</option>
                    {enrollments.map(e => (
                        <option key={e.id} value={e.id}>
                            {e.studentName} - {e.subjectName}
                        </option>
                    ))}
                </Select>
            </FiltersCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredEnrollments.map((enrollment, index) => (
                    <EnrollmentCard
                        key={enrollment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ColorBar color={enrollment.color} />
                        <CardContent>
                            <CardHeader>
                                <StudentInfo>
                                    <StudentName>{enrollment.studentName}</StudentName>
                                    <SubjectName>
                                        <BookOpen size={14} />
                                        {enrollment.subjectName} ({enrollment.subjectCode})
                                    </SubjectName>
                                    <SubjectName>
                                        <Users size={14} />
                                        {enrollment.teacher}
                                    </SubjectName>
                                </StudentInfo>
                                <AddButton
                                    onClick={() => handleAddGrade(enrollment.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Plus size={16} />
                                    Agregar Nota
                                </AddButton>
                            </CardHeader>

                            {enrollment.accumulated && (
                                <AccumulatedSection>
                                    <AccumulatedGrid>
                                        <StatBox>
                                            <StatLabel>Asignaciones ({enrollment.accumulated.totalAssignments})</StatLabel>
                                            <StatValue color={getGradeColor(enrollment.accumulated.assignmentAvg)}>
                                                {enrollment.accumulated.assignmentAvg}%
                                            </StatValue>
                                        </StatBox>
                                        <StatBox>
                                            <StatLabel>Exámenes ({enrollment.accumulated.totalExams})</StatLabel>
                                            <StatValue color={getGradeColor(enrollment.accumulated.examAvg)}>
                                                {enrollment.accumulated.examAvg}%
                                            </StatValue>
                                        </StatBox>
                                        <StatBox>
                                            <StatLabel>
                                                <TrendingUp size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                                Acumulado
                                            </StatLabel>
                                            <StatValue color={getGradeColor(enrollment.accumulated.accumulated)}>
                                                {enrollment.accumulated.accumulated}%
                                            </StatValue>
                                        </StatBox>
                                    </AccumulatedGrid>
                                    <ReportButton
                                        onClick={() => handleGenerateReport(enrollment)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Download size={16} />
                                        Generar Reporte PDF
                                    </ReportButton>
                                </AccumulatedSection>
                            )}

                            <GradesSection>
                                {enrollment.grades.filter(g => g.type === 'assignment').length > 0 && (
                                    <>
                                        <SectionTitle>
                                            <FileText size={16} />
                                            Asignaciones
                                        </SectionTitle>
                                        <GradesList>
                                            {enrollment.grades
                                                .filter(g => g.type === 'assignment')
                                                .map(grade => (
                                                    <GradeItem key={grade.id}>
                                                        <GradeName>{grade.name}</GradeName>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <GradeScore color={getGradeColor(grade.score)}>
                                                                {grade.score}/{grade.maxScore}
                                                            </GradeScore>
                                                            <IconButton
                                                                bgColor="rgba(239, 68, 68, 0.1)"
                                                                color="#DC2626"
                                                                onClick={() => handleDeleteGrade(grade.id)}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <Trash2 size={14} />
                                                            </IconButton>
                                                        </div>
                                                    </GradeItem>
                                                ))}
                                        </GradesList>
                                    </>
                                )}

                                {enrollment.grades.filter(g => g.type === 'exam').length > 0 && (
                                    <>
                                        <SectionTitle>
                                            <ClipboardCheck size={16} />
                                            Exámenes
                                        </SectionTitle>
                                        <GradesList>
                                            {enrollment.grades
                                                .filter(g => g.type === 'exam')
                                                .map(grade => (
                                                    <GradeItem key={grade.id}>
                                                        <GradeName>{grade.name}</GradeName>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <GradeScore color={getGradeColor(grade.score)}>
                                                                {grade.score}/{grade.maxScore}
                                                            </GradeScore>
                                                            <IconButton
                                                                bgColor="rgba(239, 68, 68, 0.1)"
                                                                color="#DC2626"
                                                                onClick={() => handleDeleteGrade(grade.id)}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <Trash2 size={14} />
                                                            </IconButton>
                                                        </div>
                                                    </GradeItem>
                                                ))}
                                        </GradesList>
                                    </>
                                )}

                                {enrollment.grades.length === 0 && (
                                    <p style={{ textAlign: 'center', color: '#64748B', padding: '2rem' }}>
                                        No hay calificaciones registradas
                                    </p>
                                )}
                            </GradesSection>
                        </CardContent>
                    </EnrollmentCard>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <Modal
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <ModalContent
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ModalHeader>
                                <ModalTitle>Agregar Calificación</ModalTitle>
                                <IconButton
                                    bgColor="#F1F5F9"
                                    color="#64748B"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <X size={20} />
                                </IconButton>
                            </ModalHeader>

                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label>Tipo</Label>
                                    <Select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="assignment">Asignación/Tarea</option>
                                        <option value="exam">Examen</option>
                                    </Select>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Nombre</Label>
                                    <Input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej: Tarea 1, Parcial 1"
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Puntuación Obtenida</Label>
                                    <Input
                                        type="number"
                                        required
                                        min="0"
                                        max={formData.maxScore}
                                        step="0.1"
                                        value={formData.score}
                                        onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                                        placeholder="95"
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Puntuación Máxima</Label>
                                    <Input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.maxScore}
                                        onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                                        placeholder="100"
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Fecha</Label>
                                    <Input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </FormGroup>

                                <ButtonGroup>
                                    <CancelButton
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancelar
                                    </CancelButton>
                                    <SubmitButton
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Guardar
                                    </SubmitButton>
                                </ButtonGroup>
                            </Form>
                        </ModalContent>
                    </Modal>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default GradeManagement;
