import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Search,
    Plus,
    Edit,
    Trash2,
    Users as UsersIcon,
    Clock,
    Award,
    X,
    ChevronDown,
    ChevronUp,
    FileText
} from 'lucide-react';
import { subjectsAPI, enrollmentsAPI, gradesAPI, studentsAPI } from '../services/database';
import { Toast, useToast } from '../components/Toast';
import ComponentsConfigurator from '../components/ComponentsConfigurator';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};

  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
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

const AddButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.green};
  color: white;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.3);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SearchCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: ${props => props.theme.spacing.lg};
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.slate[400]};
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} 2.5rem;
  color: ${props => props.theme.colors.slate[800]};
  outline: none;
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    border-color: ${props => props.theme.colors.success.light};
    background: white;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
`;

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};
`;

const SubjectCard = styled(motion.div)`
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
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SubjectInfo = styled.div`
  flex: 1;
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(to bottom right, ${props => props.color});
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.lg};
  margin-right: ${props => props.theme.spacing.md};

  svg {
    color: white;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const IconButton = styled(motion.button)`
  width: 2rem;
  height: 2rem;
  background: ${props => props.bgColor};
  color: ${props => props.color};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SubjectName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SubjectCode = styled.p`
  color: ${props => props.theme.colors.slate[500]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TeacherName = styled.p`
  color: ${props => props.theme.colors.slate[600]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} 0;
  border-top: 1px solid ${props => props.theme.colors.slate[200]};
  border-bottom: 1px solid ${props => props.theme.colors.slate[200]};
  margin: ${props => props.theme.spacing.md} 0;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const InfoLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.slate[500]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const InfoValue = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[800]};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ScheduleText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[600]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};

  svg {
    color: ${props => props.theme.colors.slate[400]};
  }
`;

const ExpandButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.slate[700]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.slate[100]};
  }
`;

const StudentsSection = styled(motion.div)`
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.slate[200]};
`;

const StudentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const StudentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.slate[50]};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
`;

const StudentName = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.slate[800]};
`;

const StudentGrade = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.color};
  margin-right: ${props => props.theme.spacing.sm};
`;

const QuickActionButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.blue};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
`;

const EmptyState = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.slate[400]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  padding: ${props => props.theme.spacing.lg};
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
  overflow-y: auto;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm};
    align-items: flex-start;
  }
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  max-width: 42rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
  margin: auto;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    max-width: 100%;
    max-height: 95vh;
    padding: ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.xl};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm};
    border-radius: ${props => props.theme.borderRadius.lg};
    margin-top: ${props => props.theme.spacing.sm};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
`;

const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  background: ${props => props.theme.colors.slate[100]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.slate[200]};
  }
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
    border-color: ${props => props.theme.colors.success.light};
    background: white;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.slate[800]};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${props => props.theme.colors.success.light};
    background: white;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
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
  background: ${props => props.theme.colors.gradients.green};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.3);
`;

const Subjects = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [currentSubjectForEnroll, setCurrentSubjectForEnroll] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [availableStudents, setAvailableStudents] = useState([]);
    const [expandedSubjects, setExpandedSubjects] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        credits: '',
        schedule: '',
        teacher: '',
        cycle: 'First cycle',
        components: [
            { id: 1, name: 'Tareas', type: 'numeric', weight: 40, maxScore: 100 },
            { id: 2, name: 'Exámenes', type: 'numeric', weight: 60, maxScore: 100 }
        ]
    });

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const allSubjects = await subjectsAPI.getAll();
            const enrollments = await enrollmentsAPI.getAll();

            // Enrich subjects with enrolled students
            const enrichedSubjects = allSubjects.map(subject => {
                const subjectEnrollments = enrollments.filter(e => e.subjectId === subject.id);
                const studentsWithGrades = subjectEnrollments.map(enrollment => {
                    const accumulated = gradesAPI.calculateAccumulated ? gradesAPI.calculateAccumulated(enrollment.id) : null;
                    return {
                        enrollmentId: enrollment.id,
                        studentId: enrollment.studentId,
                        studentName: enrollment.studentName,
                        accumulated: accumulated?.accumulated || null
                    };
                });

                return {
                    ...subject,
                    students: studentsWithGrades
                };
            });

            setSubjects(enrichedSubjects);
        } catch (error) {
            console.error('Error cargando materias:', error);
            setSubjects([]);
        }
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subject.code && subject.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddNew = () => {
        setEditingSubject(null);
        setFormData({ name: '', code: '', credits: '', schedule: '', teacher: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        setFormData({
            name: subject.name,
            code: subject.code || '',
            credits: subject.credits || '',
            schedule: subject.schedule || '',
            teacher: subject.teacher || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id, name) => {
        if (confirm(`¿Está seguro de eliminar la materia "${name}"?`)) {
            try {
                await subjectsAPI.delete(id);
                toast.success(`La materia "${name}" fue eliminada del sistema`, 'Eliminación Exitosa');
                await loadSubjects();
            } catch (error) {
                console.error('Error eliminando materia:', error);
                toast.error('No se pudo eliminar la materia. Tiene estudiantes inscritos.', 'Error al Eliminar');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.name || !formData.name.trim()) {
            toast.warning('El nombre de la materia es obligatorio', 'Campo Requerido');
            return;
        }

        if (!formData.code || !formData.code.trim()) {
            toast.warning('El código de la materia es obligatorio', 'Campo Requerido');
            return;
        }

        // Validar componentes de evaluación
        const totalWeight = formData.components.reduce((sum, comp) => sum + (parseFloat(comp.weight) || 0), 0);
        if (totalWeight !== 100) {
            toast.warning(`La suma de los pesos debe ser 100%. Actualmente es ${totalWeight}%`, 'Configuración Inválida');
            return;
        }

        // Validar que todos los componentes tengan nombre
        const hasEmptyNames = formData.components.some(comp => !comp.name || !comp.name.trim());
        if (hasEmptyNames) {
            toast.warning('Todos los componentes deben tener un nombre', 'Campo Requerido');
            return;
        }

        try {
            if (editingSubject) {
                await subjectsAPI.update(editingSubject.id, formData);
                toast.success('La información de la materia fue actualizada correctamente', 'Actualización Exitosa');
            } else {
                await subjectsAPI.create(formData);
                toast.success('Materia creada exitosamente', 'Registro Exitoso');
            }
            await loadSubjects();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error guardando materia:', error);
            toast.error(error.message || 'No se pudo guardar la materia. Por favor, intenta nuevamente.', 'Error al Guardar');
        }
    };

    const toggleExpand = (subjectId) => {
        setExpandedSubjects(prev => ({
            ...prev,
            [subjectId]: !prev[subjectId]
        }));
    };

    const handleAddGrade = (enrollmentId) => {
        // Navigate to grade management with this enrollment pre-selected
        navigate(`/grade-management?enrollment=${enrollmentId}`);
    };

    const handleOpenEnrollModal = async (subject) => {
        setCurrentSubjectForEnroll(subject);

        try {
            // Get all students
            const allStudents = await studentsAPI.getAll();

            // Filter out students already enrolled in this subject
            const enrolledStudentIds = subject.students.map(s => s.studentId);
            const available = allStudents.filter(s => !enrolledStudentIds.includes(s.id));

            setAvailableStudents(available);
            setSelectedStudentId('');
            setIsEnrollModalOpen(true);
        } catch (error) {
            console.error('Error cargando estudiantes:', error);
            setAvailableStudents([]);
        }
    };

    const handleEnrollStudent = async (e) => {
        e.preventDefault();

        if (!selectedStudentId || !currentSubjectForEnroll) return;

        try {
            const student = await studentsAPI.getById(parseInt(selectedStudentId));

            await enrollmentsAPI.create({
                studentId: student.id,
                studentName: student.name,
                subjectId: currentSubjectForEnroll.id,
                subjectName: currentSubjectForEnroll.name,
                subjectCode: currentSubjectForEnroll.code,
                color: currentSubjectForEnroll.color
            });

            await loadSubjects();
            setIsEnrollModalOpen(false);
            toast.success(`${student.name} inscrito exitosamente`, 'Inscripción Exitosa');
        } catch (error) {
            console.error('Error inscribiendo estudiante:', error);
            toast.error('No se pudo inscribir al estudiante', 'Error');
        }
    };

    const getGradeColor = (grade) => {
        if (!grade) return '#94A3B8';
        if (grade >= 90) return '#22C55E';
        if (grade >= 80) return '#3B82F6';
        if (grade >= 70) return '#F97316';
        return '#EF4444';
    };

    return (
        <Container>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
            <Header>
                <div>
                    <Title>Materias</Title>
                    <Subtitle>Gestiona el catálogo de materias y estudiantes inscritos</Subtitle>
                </div>
                <AddButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddNew}
                >
                    <Plus size={20} />
                    <span>Nueva Materia</span>
                </AddButton>
            </Header>

            <SearchCard>
                <SearchWrapper>
                    <SearchIcon>
                        <Search size={20} />
                    </SearchIcon>
                    <SearchInput
                        type="text"
                        placeholder="Buscar materia por nombre o código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchWrapper>
            </SearchCard>

            <SubjectsGrid>
                {filteredSubjects.map((subject, index) => (
                    <SubjectCard
                        key={subject.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ColorBar color={subject.color} />
                        <CardContent>
                            <CardHeader>
                                <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                                    <IconWrapper color={subject.color}>
                                        <BookOpen size={24} />
                                    </IconWrapper>
                                    <SubjectInfo>
                                        <SubjectName>{subject.name}</SubjectName>
                                        <SubjectCode>{subject.code}</SubjectCode>
                                        <TeacherName>👨‍🏫 {subject.teacher}</TeacherName>
                                    </SubjectInfo>
                                </div>
                                <Actions>
                                    <IconButton
                                        bgColor="rgba(59, 130, 246, 0.1)"
                                        color="#2563EB"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEdit(subject)}
                                    >
                                        <Edit size={16} />
                                    </IconButton>
                                    <IconButton
                                        bgColor="rgba(239, 68, 68, 0.1)"
                                        color="#DC2626"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(subject.id, subject.name)}
                                    >
                                        <Trash2 size={16} />
                                    </IconButton>
                                </Actions>
                            </CardHeader>

                            {subject.schedule && (
                                <ScheduleText>
                                    <Clock size={14} />
                                    {subject.schedule}
                                </ScheduleText>
                            )}

                            <InfoGrid>
                                <InfoItem>
                                    <InfoLabel>
                                        <Award size={14} />
                                        Créditos
                                    </InfoLabel>
                                    <InfoValue>{subject.credits || 'N/A'}</InfoValue>
                                </InfoItem>
                                <InfoItem>
                                    <InfoLabel>
                                        <UsersIcon size={14} />
                                        Inscritos
                                    </InfoLabel>
                                    <InfoValue>{subject.students?.length || 0}</InfoValue>
                                </InfoItem>
                            </InfoGrid>

                            {subject.students && subject.students.length > 0 && (
                                <>
                                    <ExpandButton
                                        onClick={() => toggleExpand(subject.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <UsersIcon size={16} />
                                        {expandedSubjects[subject.id] ? 'Ocultar' : 'Ver'} Estudiantes ({subject.students.length})
                                        {expandedSubjects[subject.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </ExpandButton>

                                    <AnimatePresence>
                                        {expandedSubjects[subject.id] && (
                                            <StudentsSection
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <div style={{ marginBottom: '0.75rem' }}>
                                                    <QuickActionButton
                                                        onClick={() => handleOpenEnrollModal(subject)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        style={{
                                                            width: '100%',
                                                            justifyContent: 'center',
                                                            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                                                            boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3)'
                                                        }}
                                                    >
                                                        <Plus size={14} />
                                                        Agregar Estudiante
                                                    </QuickActionButton>
                                                </div>
                                                <StudentsList>
                                                    {subject.students.map(student => (
                                                        <StudentItem key={student.enrollmentId}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                                                <StudentName>{student.studentName}</StudentName>
                                                                {student.accumulated !== null && (
                                                                    <StudentGrade color={getGradeColor(student.accumulated)}>
                                                                        {student.accumulated}%
                                                                    </StudentGrade>
                                                                )}
                                                            </div>
                                                            <QuickActionButton
                                                                onClick={() => handleAddGrade(student.enrollmentId)}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <FileText size={14} />
                                                                Calificar
                                                            </QuickActionButton>
                                                        </StudentItem>
                                                    ))}
                                                </StudentsList>
                                            </StudentsSection>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}

                            {subject.students && subject.students.length === 0 && (
                                <EmptyState>No hay estudiantes inscritos</EmptyState>
                            )}
                        </CardContent>
                    </SubjectCard>
                ))}
            </SubjectsGrid>

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
                                <ModalTitle>
                                    {editingSubject ? 'Editar Materia' : 'Nueva Materia'}
                                </ModalTitle>
                                <CloseButton onClick={() => setIsModalOpen(false)}>
                                    <X size={20} />
                                </CloseButton>
                            </ModalHeader>

                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label>Nombre de la Materia</Label>
                                    <Input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Matemáticas"
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Código</Label>
                                    <Input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="MAT101"
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Créditos</Label>
                                    <Input
                                        type="number"
                                        required
                                        value={formData.credits}
                                        onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                                        placeholder="4"
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Horario</Label>
                                    <Input
                                        type="text"
                                        required
                                        value={formData.schedule}
                                        onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                        placeholder="Lun, Mie, Vie 08:00-10:00"
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Profesor</Label>
                                    <Input
                                        type="text"
                                        required
                                        value={formData.teacher}
                                        onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                                        placeholder="Prof. Einstein"
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Ciclo</Label>
                                    <Select
                                        value={formData.cycle}
                                        onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
                                    >
                                        <option value="First cycle">First cycle</option>
                                        <option value="Second cycle">Second cycle</option>
                                        <option value="Third cycle">Third cycle</option>
                                        <option value="Fourth cycle">Fourth cycle</option>
                                    </Select>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Configuración de Evaluación</Label>
                                    <ComponentsConfigurator
                                        components={formData.components}
                                        onChange={(components) => setFormData({ ...formData, components })}
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
                                        {editingSubject ? 'Guardar' : 'Crear'}
                                    </SubmitButton>
                                </ButtonGroup>
                            </Form>
                        </ModalContent>
                    </Modal>
                )}

                {isEnrollModalOpen && (
                    <Modal
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsEnrollModalOpen(false)}
                    >
                        <ModalContent
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ModalHeader>
                                <ModalTitle>Inscribir Estudiante</ModalTitle>
                                <CloseButton onClick={() => setIsEnrollModalOpen(false)}>
                                    <X size={20} />
                                </CloseButton>
                            </ModalHeader>

                            <Form onSubmit={handleEnrollStudent}>
                                <FormGroup>
                                    <Label>Materia</Label>
                                    <Input
                                        type="text"
                                        value={currentSubjectForEnroll?.name || ''}
                                        disabled
                                        style={{ background: '#F1F5F9', cursor: 'not-allowed' }}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Seleccionar Estudiante</Label>
                                    {availableStudents.length > 0 ? (
                                        <select
                                            required
                                            value={selectedStudentId}
                                            onChange={(e) => setSelectedStudentId(e.target.value)}
                                            style={{
                                                width: '100%',
                                                background: '#F8FAFC',
                                                border: '1px solid #E2E8F0',
                                                borderRadius: '0.75rem',
                                                padding: '0.75rem',
                                                color: '#1E293B',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="">-- Selecciona un estudiante --</option>
                                            {availableStudents.map(student => (
                                                <option key={student.id} value={student.id}>
                                                    {student.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p style={{
                                            textAlign: 'center',
                                            color: '#64748B',
                                            padding: '1rem',
                                            background: '#F8FAFC',
                                            borderRadius: '0.75rem'
                                        }}>
                                            Todos los estudiantes ya están inscritos en esta materia
                                        </p>
                                    )}
                                </FormGroup>

                                <ButtonGroup>
                                    <CancelButton
                                        type="button"
                                        onClick={() => setIsEnrollModalOpen(false)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancelar
                                    </CancelButton>
                                    <SubmitButton
                                        type="submit"
                                        disabled={availableStudents.length === 0}
                                        whileHover={{ scale: availableStudents.length > 0 ? 1.02 : 1 }}
                                        whileTap={{ scale: availableStudents.length > 0 ? 0.98 : 1 }}
                                        style={{
                                            opacity: availableStudents.length === 0 ? 0.5 : 1,
                                            cursor: availableStudents.length === 0 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Inscribir
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

export default Subjects;
