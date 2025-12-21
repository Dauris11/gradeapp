import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
    Award,
    Plus,
    Trash2,
    BookOpen,
    Users,
    FileText,
    ClipboardCheck,
    X,
    TrendingUp,
    Download,
    CheckCircle2,
    AlertCircle,
    Calendar,
    ChevronRight,
    Search
} from 'lucide-react';
import { enrollmentsAPI, gradesAPI, studentsAPI } from '../services/database';
import PDFService from '../services/pdfService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
  padding-bottom: 40px;
`;

const Header = styled.div`
    margin-bottom: ${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
  letter-spacing: -0.04em;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.slate[500]};
  font-weight: 500;
`;

const FiltersCard = styled.div`
  ${props => props.theme.glassmorphism}
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.slate[700]};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Select = styled.select`
  width: 100%;
  background: white;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: 14px;
  padding: 14px;
  font-size: 15px;
  color: ${props => props.theme.colors.slate[800]};
  outline: none;
  transition: all 0.2s;
  cursor: pointer;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const EnrollmentCard = styled(motion.div)`
  ${props => props.theme.glassmorphism}
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const ColorBar = styled.div`
  height: 6px;
  background: linear-gradient(to right, ${props => props.color});
`;

const CardContent = styled.div`
  padding: 32px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const StudentInfo = styled.div`
    h3 {
        font-size: 24px;
        font-weight: 800;
        color: ${props => props.theme.colors.slate[900]};
        margin-bottom: 8px;
        letter-spacing: -0.02em;
    }
`;

const InfoRow = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.slate[500]};
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-top: 4px;

  svg { color: ${props => props.theme.colors.primary.main}; }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.bg || props.theme.colors.gradients.primary};
  color: ${props => props.color || 'white'};
  padding: 12px 20px;
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: ${props => props.shadow || '0 10px 20px rgba(99, 102, 241, 0.2)'};
  border: none;
  cursor: pointer;
`;

const AddButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.primary};
  color: white;
  padding: 12px 20px;
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
  border: none;
  cursor: pointer;
  white-space: nowrap;

  @media (max-width: 640px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const AccumulatedSection = styled.div`
  background: rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.6);
`;

const AccumulatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled.div`
  text-align: center;
  padding: 16px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  span {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme.colors.slate[400]};
    display: block;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  h4 {
    font-size: 24px;
    font-weight: 900;
    color: ${props => props.color};
  }
`;

const ReportButton = styled(motion.button)`
  width: 100%;
  background: white;
  color: ${props => props.theme.colors.primary.main};
  padding: 14px;
  border-radius: 16px;
  font-weight: 700;
  border: 1px solid ${props => props.theme.colors.primary.main}20;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.primary.main}05;
  }
`;

const GradesSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const GradeListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h4`
  font-size: 15px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[800]};
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const GradeItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-radius: 18px;
  border: 1px solid ${props => props.theme.colors.slate[100]};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);

  &:hover {
    border-color: ${props => props.theme.colors.primary.main}40;
    transform: translateY(-2px);
  }
`;

const GradeName = styled.div`
  h5 { font-size: 14px; font-weight: 700; color: ${props => props.theme.colors.slate[800]}; margin-bottom: 2px; }
  span { font-size: 11px; color: ${props => props.theme.colors.slate[400]}; font-weight: 500; }
`;

const IconButton = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${props => props.$bg || '#F1F5F9'};
  color: ${props => props.$color || '#64748B'};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 28px;
  width: 100%;
  max-width: 480px;
  padding: 40px;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  font-size: 15px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
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

    useEffect(() => { loadData(); }, []);

    useEffect(() => {
        const enrollmentParam = searchParams.get('enrollment');
        if (enrollmentParam && enrollments.length > 0) {
            const enrollmentId = parseInt(enrollmentParam);
            const enrollment = enrollments.find(e => e.id === enrollmentId);
            if (enrollment) {
                setSelectedEnrollment(enrollmentId.toString());
                handleAddGrade(enrollmentId);
                searchParams.delete('enrollment');
                setSearchParams(searchParams);
            }
        }
    }, [searchParams, enrollments]);

    const loadData = async () => {
        try {
            const validEnrollments = Array.isArray(allEnrollments) ? allEnrollments : [];
            const enriched = await Promise.all(validEnrollments.map(async enrollment => {
                const grades = await gradesAPI.getByEnrollment(enrollment.id);
                const accumulated = gradesAPI.calculateAccumulated ? gradesAPI.calculateAccumulated(enrollment.id) : null;
                return { ...enrollment, grades: grades || [], accumulated };
            }));
            setEnrollments(enriched);
        } catch (error) { console.error(error); }
    };

    const filteredEnrollments = selectedEnrollment === 'all'
        ? enrollments
        : enrollments.filter(e => e.id === parseInt(selectedEnrollment));

    const handleAddGrade = (enrollmentId) => {
        setCurrentEnrollmentId(enrollmentId);
        setFormData({
            type: 'assignment', name: '', score: '', maxScore: 100,
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
        } catch (error) { alert('Error al guardar'); }
    };

    const handleDeleteGrade = async (gradeId) => {
        if (window.confirm('¿Eliminar esta calificación?')) {
            try {
                await gradesAPI.delete(gradeId);
                await loadData();
            } catch (error) { alert('Error al eliminar'); }
        }
    };

    const getGradeColor = (score) => {
        if (score >= 90) return '#10B981';
        if (score >= 80) return '#6366F1';
        if (score >= 70) return '#F59E0B';
        return '#EF4444';
    };

    const handleGenerateReport = async (enrollment) => {
        try {
            const allStudents = await studentsAPI.getAll();
            const student = allStudents.find(s => s.name === enrollment.studentName);
            if (!student) return alert('Estudiante no encontrado');
            const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
            const allGrades = await gradesAPI.getAll();
            const doc = await PDFService.generateStudentReport(student, studentEnrollments, allGrades);
            PDFService.downloadPDF(doc, `Reporte_${student.name.replace(/\s+/g, '_')}.pdf`);
        } catch (error) { alert(`Error: ${error.message}`); }
    };

    return (
        <Container>
            <Header>
                <Title>Gestión Académica</Title>
                <Subtitle>Control de calificaciones, asistencias y rendimiento por materia</Subtitle>
            </Header>

            <FiltersCard>
                <Label><Users size={16} /> Seleccionar Registro Académico</Label>
                <Select value={selectedEnrollment} onChange={e => setSelectedEnrollment(e.target.value)}>
                    <option value="all">Todas las materias inscritas</option>
                    {Array.isArray(enrollments) && enrollments.map(e => <option key={e.id} value={e.id}>{e.studentName} — {e.subjectName}</option>)}
                </Select>
            </FiltersCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {filteredEnrollments.length > 0 ? filteredEnrollments.map((enrollment, idx) => (
                    <EnrollmentCard
                        key={enrollment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <ColorBar color={enrollment.color || '#6366F1, #8B5CF6'} />
                        <CardContent>
                            <CardHeader>
                                <StudentInfo>
                                    <h3>{enrollment.studentName}</h3>
                                    <InfoRow><BookOpen size={14} /> {enrollment.subjectName} ({enrollment.subjectCode})</InfoRow>
                                    <InfoRow><Users size={14} /> Prof. {enrollment.teacher}</InfoRow>
                                </StudentInfo>
                                <AddButton
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAddGrade(enrollment.id)}
                                >
                                    <Plus size={18} /> Nueva Nota
                                </AddButton>
                            </CardHeader>

                            {enrollment.accumulated && (
                                <AccumulatedSection>
                                    <AccumulatedGrid>
                                        <StatBox color={getGradeColor(enrollment.accumulated.assignmentAvg)}>
                                            <span>Tareas ({enrollment.accumulated.totalAssignments})</span>
                                            <h4>{enrollment.accumulated.assignmentAvg}%</h4>
                                        </StatBox>
                                        <StatBox color={getGradeColor(enrollment.accumulated.examAvg)}>
                                            <span>Exámenes ({enrollment.accumulated.totalExams})</span>
                                            <h4>{enrollment.accumulated.examAvg}%</h4>
                                        </StatBox>
                                        <StatBox color={getGradeColor(enrollment.accumulated.accumulated)}>
                                            <span>Promedio Final</span>
                                            <h4>{enrollment.accumulated.accumulated}%</h4>
                                        </StatBox>
                                    </AccumulatedGrid>
                                    <ReportButton
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => handleGenerateReport(enrollment)}
                                    >
                                        <Download size={18} /> Descargar Reporte de Progreso
                                    </ReportButton>
                                </AccumulatedSection>
                            )}

                            <GradesSection>
                                <GradeListContainer>
                                    <SectionTitle><FileText size={18} color="#6366F1" /> Asignaciones y Tareas</SectionTitle>
                                    {enrollment.grades.filter(g => g.type === 'assignment').length > 0 ? (
                                        enrollment.grades.filter(g => g.type === 'assignment').map(g => (
                                            <GradeItem key={g.id}>
                                                <GradeName>
                                                    <h5>{g.name}</h5>
                                                    <span>{new Date(g.date).toLocaleDateString()}</span>
                                                </GradeName>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ fontWeight: '800', color: getGradeColor((g.score / g.maxScore) * 100) }}>
                                                        {g.score}/{g.maxScore}
                                                    </div>
                                                    <IconButton $bg="#FEE2E2" $color="#EF4444" onClick={() => handleDeleteGrade(g.id)} whileHover={{ scale: 1.1 }}>
                                                        <Trash2 size={14} />
                                                    </IconButton>
                                                </div>
                                            </GradeItem>
                                        ))
                                    ) : <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Sin tareas registradas</p>}
                                </GradeListContainer>

                                <GradeListContainer>
                                    <SectionTitle><ClipboardCheck size={18} color="#10B981" /> Exámenes y Pruebas</SectionTitle>
                                    {enrollment.grades.filter(g => g.type === 'exam').length > 0 ? (
                                        enrollment.grades.filter(g => g.type === 'exam').map(g => (
                                            <GradeItem key={g.id}>
                                                <GradeName>
                                                    <h5>{g.name}</h5>
                                                    <span>{new Date(g.date).toLocaleDateString()}</span>
                                                </GradeName>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ fontWeight: '800', color: getGradeColor((g.score / g.maxScore) * 100) }}>
                                                        {g.score}/{g.maxScore}
                                                    </div>
                                                    <IconButton $bg="#FEE2E2" $color="#EF4444" onClick={() => handleDeleteGrade(g.id)} whileHover={{ scale: 1.1 }}>
                                                        <Trash2 size={14} />
                                                    </IconButton>
                                                </div>
                                            </GradeItem>
                                        ))
                                    ) : <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Sin exámenes registrados</p>}
                                </GradeListContainer>
                            </GradesSection>
                        </CardContent>
                    </EnrollmentCard>
                )) : (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '32px', border: '1px dashed #cbd5e1' }}>
                        <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
                        <h3 style={{ color: '#475569', fontWeight: '700' }}>No se encontraron registros</h3>
                        <p style={{ color: '#94a3b8' }}>Selecciona una opción diferente en el filtro o inscribe alumnos en materias.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}>
                        <ModalContent initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>Registrar Nota</h2>
                                <IconButton onClick={() => setIsModalOpen(false)}><X size={20} /></IconButton>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                <InputGroup>
                                    <Label>Tipo de Evaluación</Label>
                                    <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="assignment">📝 Asignación / Tarea</option>
                                        <option value="exam">📋 Examen Parcial / Final</option>
                                    </Select>
                                </InputGroup>
                                <InputGroup>
                                    <Label>Nombre de la Evaluación</Label>
                                    <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Primer Parcial, Tarea #1" />
                                </InputGroup>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <InputGroup>
                                        <Label>Nota Obtenida</Label>
                                        <Input type="number" step="0.5" required value={formData.score} onChange={e => setFormData({ ...formData, score: e.target.value })} placeholder="0.0" />
                                    </InputGroup>
                                    <InputGroup>
                                        <Label>Puntaje Máximo</Label>
                                        <Input type="number" required value={formData.maxScore} onChange={e => setFormData({ ...formData, maxScore: e.target.value })} placeholder="100" />
                                    </InputGroup>
                                </div>
                                <ActionButton type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                                    <CheckCircle2 size={18} /> Guardar Calificación
                                </ActionButton>
                            </Form>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default GradeManagement;
