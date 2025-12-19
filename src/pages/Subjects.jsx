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
    FileText,
    Calendar,
    GraduationCap,
    MoreVertical,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import { subjectsAPI, enrollmentsAPI, gradesAPI, studentsAPI } from '../services/database';
import { Toast, useToast } from '../components/Toast';
import ComponentsConfigurator from '../components/ComponentsConfigurator';
import { useLanguage } from '../i18n/LanguageContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${props => props.theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${props => props.theme.colors.slate[900]};
  }
  p {
    color: ${props => props.theme.colors.slate[500]};
    font-size: 15px;
  }
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.success};
  color: white;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
  border: none;
  cursor: pointer;
`;

const TopBar = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background: white;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: 14px;
  padding: 12px 16px 12px 44px;
  font-size: 15px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.success.main};
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05);
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.slate[400]};
`;

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const SubjectCard = styled(motion.div)`
  ${props => props.theme.glassmorphism}
  border-radius: 24px;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CardIndicator = styled.div`
  height: 6px;
  background: ${props => props.color || props.theme.colors.primary.main};
  width: 100%;
`;

const CardContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${props => props.color || props.theme.colors.primary.main}15;
  color: ${props => props.color || props.theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubjectHeader = styled.div`
  h3 {
    font-size: 20px;
    font-weight: 800;
    color: ${props => props.theme.colors.slate[900]};
    margin: 4px 0;
  }
  .code {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme.colors.slate[400]};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || props.theme.colors.slate[400]};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.slate[50]};
    border-color: ${props => props.color || props.theme.colors.primary.main};
    color: ${props => props.color || props.theme.colors.primary.main};
  }
`;

const TeacherRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: ${props => props.theme.colors.slate[50]};
  border-radius: 12px;
  
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: ${props => props.theme.colors.slate[200]};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.slate[500]};
  }
  
  span {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.slate[700]};
  }
`;

const InfoBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const MiniInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.slate[500]};
  font-size: 13px;
  
  svg { color: ${props => props.theme.colors.slate[400]}; }
  strong { color: ${props => props.theme.colors.slate[900]}; font-weight: 700; }
`;

const ExpandCardBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: ${props => props.expanded ? props.theme.colors.slate[900] : props.theme.colors.slate[100]};
  color: ${props => props.expanded ? 'white' : props.theme.colors.slate[700]};
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.expanded ? props.theme.colors.slate[800] : props.theme.colors.slate[200]};
  }
`;

const StudentsPanel = styled(motion.div)`
  padding: 20px;
  background: ${props => props.theme.colors.slate[50]};
  border-radius: 18px;
  margin: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StudentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.slate[100]};

  .name {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.slate[800]};
  }
  
  .grade {
    font-size: 14px;
    font-weight: 800;
    color: ${props => props.gradeColor};
  }
`;

const AddStudentBtn = styled.button`
  width: 100%;
  padding: 10px;
  background: white;
  border: 2px dashed ${props => props.theme.colors.slate[200]};
  border-radius: 12px;
  color: ${props => props.theme.colors.slate[500]};
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    border-color: ${props => props.theme.colors.success.main};
    color: ${props => props.theme.colors.success.main};
    background: ${props => props.theme.colors.success.main}05;
  }
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px;
  position: relative;
`;

const ModalHeaderWrapper = styled.div`
  margin-bottom: 32px;
  h2 { font-size: 24px; font-weight: 800; }
  p { color: ${props => props.theme.colors.slate[500]}; font-size: 14px; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label { font-size: 13px; font-weight: 600; color: ${props => props.theme.colors.slate[700]}; }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: 12px;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.success.main};
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: 12px;
  font-size: 15px;
  background: white;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.success.main};
  }
`;

const SubmitBtn = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.success};
  color: white;
  padding: 16px;
  border-radius: 14px;
  font-weight: 700;
  margin-top: 12px;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  border: none;
  cursor: pointer;
`;

const Subjects = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useLanguage();
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [currentSubjectForEnroll, setCurrentSubjectForEnroll] = useState(null);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [expandedSubjects, setExpandedSubjects] = useState({});
    const [periods, setPeriods] = useState([]);
    const [activePeriod, setActivePeriod] = useState(null);

    // Default form data
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        credits: '',
        schedule: '',
        teacher: '',
        cycle: 'First cycle',
        color: '#6366F1',
        periodId: null,
        components: [
            { id: 1, name: 'Tareas', type: 'numeric', weight: 40, maxScore: 100 },
            { id: 2, name: 'Exámenes', type: 'numeric', weight: 60, maxScore: 100 }
        ]
    });

    useEffect(() => {
        loadSubjects();
        loadPeriods();
    }, []);

    const loadSubjects = async () => {
        try {
            const allSubjects = await subjectsAPI.getAll();
            const enrollments = await enrollmentsAPI.getAll();
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
                return { ...subject, students: studentsWithGrades };
            });
            setSubjects(enrichedSubjects);
        } catch (error) {
            toast.error(t('common.error'), t('common.error'));
        }
    };

    const loadPeriods = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/academic/periods');
            const data = await response.json();
            setPeriods(data);

            const active = data.find(p => p.isActive === 1);
            setActivePeriod(active);
        } catch (error) {
            console.error('Error cargando períodos:', error);
        }
    };

    const generateSubjectCode = (subjectName) => {
        if (!subjectName || subjectName.trim() === '') return '';

        // Obtener iniciales de las palabras principales
        const words = subjectName.trim().split(' ').filter(word => word.length > 0);
        let initials = '';

        // Tomar las iniciales de las primeras 2-3 palabras significativas
        const significantWords = words.filter(word =>
            word.length > 2 &&
            !['de', 'del', 'la', 'el', 'los', 'las', 'y', 'a', 'en'].includes(word.toLowerCase())
        );

        if (significantWords.length >= 2) {
            initials = significantWords.slice(0, 2).map(w => w[0].toUpperCase()).join('');
        } else if (significantWords.length === 1) {
            // Si solo hay una palabra significativa, tomar las primeras 2 letras
            initials = significantWords[0].substring(0, 2).toUpperCase();
        } else if (words.length > 0) {
            // Si no hay palabras significativas, usar las primeras palabras
            initials = words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
        }

        // Generar número secuencial basado en materias existentes con las mismas iniciales
        const existingCodesWithInitials = subjects
            .filter(s => s.code && s.code.startsWith(initials + '-'))
            .map(s => {
                const parts = s.code.split('-');
                return parts.length > 1 ? parseInt(parts[1]) : 0;
            })
            .filter(num => !isNaN(num));

        const nextNumber = existingCodesWithInitials.length > 0
            ? Math.max(...existingCodesWithInitials) + 1
            : 1;

        return `${initials}-${String(nextNumber).padStart(3, '0')}`;
    };

    const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleOpenModal = (subject = null) => {
        if (subject) {
            setEditingSubject(subject);
            setFormData({
                name: subject.name,
                code: subject.code || '',
                credits: subject.credits || '',
                schedule: subject.schedule || '',
                teacher: subject.teacher || '',
                cycle: subject.cycle || 'First cycle',
                color: subject.color || '#6366F1',
                periodId: subject.periodId || activePeriod?.id || null,
                components: subject.components || [
                    { id: 1, name: 'Tareas', type: 'numeric', weight: 40, maxScore: 100 },
                    { id: 2, name: 'Exámenes', type: 'numeric', weight: 60, maxScore: 100 }
                ]
            });
        } else {
            setEditingSubject(null);
            setFormData({
                name: '', code: '', credits: '', schedule: '', teacher: '',
                cycle: 'First cycle', color: '#6366F1',
                periodId: activePeriod?.id || null,
                components: [
                    { id: 1, name: 'Tareas', type: 'numeric', weight: 40, maxScore: 100 },
                    { id: 2, name: 'Exámenes', type: 'numeric', weight: 60, maxScore: 100 }
                ]
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id, name) => {
        if (confirm(`¿Eliminar la materia ${name}?`)) {
            try {
                await subjectsAPI.delete(id);
                toast.success('Materia eliminada', 'Éxito');
                loadSubjects();
            } catch (error) {
                toast.error('No se pudo eliminar la materia', 'Error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalWeight = formData.components.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
        if (totalWeight !== 100) {
            toast.warning(`La suma de pesos debe ser 100% (actual: ${totalWeight}%)`, 'Aviso');
            return;
        }

        try {
            if (editingSubject) {
                await subjectsAPI.update(editingSubject.id, formData);
                toast.success('Materia actualizada', 'Éxito');
            } else {
                await subjectsAPI.create(formData);
                toast.success('Materia registrada', 'Éxito');
            }
            loadSubjects();
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Error al guardar datos', 'Error');
        }
    };

    const toggleExpand = (id) => {
        setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleOpenEnrollModal = async (subject) => {
        setCurrentSubjectForEnroll(subject);
        try {
            const all = await studentsAPI.getAll();
            const enrolled = subject.students.map(s => s.studentId);
            setAvailableStudents(all.filter(s => !enrolled.includes(s.id)));
            setSelectedStudentId('');
            setIsEnrollModalOpen(true);
        } catch (error) {
            toast.error('Error al cargar alumnos', 'Error');
        }
    };

    const handleEnrollStudent = async (e) => {
        e.preventDefault();
        if (!selectedStudentId) return;

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
            loadSubjects();
            setIsEnrollModalOpen(false);
            toast.success('Alumno inscrito correctamente', 'Éxito');
        } catch (error) {
            toast.error('Error al inscribir alumno', 'Error');
        }
    };

    const getGradeColor = (grade) => {
        if (!grade) return '#94A3B8';
        if (grade >= 90) return '#10B981';
        if (grade >= 80) return '#3B82F6';
        if (grade >= 70) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <Container>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />

            <PageHeader>
                <HeaderTitle>
                    <h1>Materias</h1>
                    <p>Gestiona el currículo académico y las inscripciones</p>
                </HeaderTitle>
                <ActionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenModal()}
                >
                    <Plus size={20} />
                    Nueva Materia
                </ActionButton>
            </PageHeader>

            <TopBar>
                <SearchBox>
                    <SearchIconWrapper><Search size={18} /></SearchIconWrapper>
                    <SearchInput
                        placeholder="Buscar por nombre o código de materia..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchBox>
            </TopBar>

            <SubjectsGrid>
                {filteredSubjects.map((s, i) => (
                    <SubjectCard
                        key={s.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <CardIndicator color={s.color} />
                        <CardContent>
                            <CardTop>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <IconBox color={s.color}><BookOpen size={24} /></IconBox>
                                    <SubjectHeader>
                                        <div className="code">{s.code}</div>
                                        <h3>{s.name}</h3>
                                    </SubjectHeader>
                                </div>
                                <ActionGroup>
                                    <IconButton onClick={() => handleOpenModal(s)} color="#6366F1"><Edit size={16} /></IconButton>
                                    <IconButton onClick={() => handleDelete(s.id, s.name)} color="#ef4444"><Trash2 size={16} /></IconButton>
                                </ActionGroup>
                            </CardTop>

                            <TeacherRow>
                                <div className="avatar"><UsersIcon size={14} /></div>
                                <span>{s.teacher}</span>
                            </TeacherRow>

                            <InfoBar>
                                <MiniInfo><Award size={14} /> créditos: <strong>{s.credits}</strong></MiniInfo>
                                <MiniInfo><Clock size={14} /> <strong>{s.schedule}</strong></MiniInfo>
                            </InfoBar>

                            <ExpandCardBtn
                                expanded={expandedSubjects[s.id]}
                                onClick={() => toggleExpand(s.id)}
                            >
                                <GraduationCap size={18} />
                                {expandedSubjects[s.id] ? 'Ocultar Alumnos' : `Ver Alumnos (${s.students?.length || 0})`}
                                {expandedSubjects[s.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </ExpandCardBtn>
                        </CardContent>

                        <AnimatePresence>
                            {expandedSubjects[s.id] && (
                                <StudentsPanel
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    <AddStudentBtn onClick={() => handleOpenEnrollModal(s)}>
                                        <Plus size={14} /> Inscribir Nuevo Alumno
                                    </AddStudentBtn>

                                    {s.students?.map(student => (
                                        <StudentItem key={student.enrollmentId} gradeColor={getGradeColor(student.accumulated)}>
                                            <span className="name">{student.studentName}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {student.accumulated !== null && <span className="grade">{student.accumulated}%</span>}
                                                <IconButton
                                                    onClick={() => navigate(`/grade-management?enrollment=${student.enrollmentId}`)}
                                                    color="#10B981"
                                                >
                                                    <FileText size={14} />
                                                </IconButton>
                                            </div>
                                        </StudentItem>
                                    ))}

                                    {(!s.students || s.students.length === 0) && (
                                        <div style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', padding: '10px' }}>
                                            No hay alumnos inscritos
                                        </div>
                                    )}
                                </StudentsPanel>
                            )}
                        </AnimatePresence>
                    </SubjectCard>
                ))}
            </SubjectsGrid>

            <AnimatePresence>
                {isModalOpen && (
                    <ModalOverlay
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
                            <ModalHeaderWrapper>
                                <h2>{editingSubject ? 'Editar Materia' : 'Nueva Materia'}</h2>
                                <p>Configura los detalles académicos y de evaluación</p>
                            </ModalHeaderWrapper>

                            <Form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                                    <FormGroup>
                                        <label>Nombre de la Materia</label>
                                        <Input
                                            placeholder="Ej. Análisis de Redes"
                                            value={formData.name}
                                            onChange={(e) => {
                                                const newName = e.target.value;
                                                const newCode = !editingSubject ? generateSubjectCode(newName) : formData.code;
                                                setFormData({
                                                    ...formData,
                                                    name: newName,
                                                    code: newCode
                                                });
                                            }}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <label>Código (Auto-generado)</label>
                                        <Input
                                            placeholder="XX-000"
                                            value={formData.code}
                                            readOnly
                                            style={{
                                                background: '#f1f5f9',
                                                cursor: 'not-allowed',
                                                color: '#64748b'
                                            }}
                                        />
                                    </FormGroup>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <FormGroup>
                                        <label>Docente</label>
                                        <Input
                                            placeholder="Ing. Juan Pérez"
                                            value={formData.teacher}
                                            onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <label>Créditos</label>
                                        <Input
                                            type="number"
                                            value={formData.credits}
                                            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                                            required
                                        />
                                    </FormGroup>
                                </div>

                                <FormGroup>
                                    <label>Horario</label>
                                    <Input
                                        placeholder="Lun, Mie 18:00 - 20:00"
                                        value={formData.schedule}
                                        onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <label>Período Académico</label>
                                    <Select
                                        value={formData.periodId || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            periodId: e.target.value ? parseInt(e.target.value) : null
                                        })}
                                        required
                                    >
                                        <option value="">-- Seleccionar Período --</option>
                                        {periods.map(period => (
                                            <option
                                                key={period.id}
                                                value={period.id}
                                            >
                                                {period.name} {period.isActive === 1 ? '✓ Activo' : ''}
                                            </option>
                                        ))}
                                    </Select>
                                </FormGroup>

                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px', display: 'block' }}>
                                        CONFIGURACIÓN DE EVALUACIÓN
                                    </label>
                                    <ComponentsConfigurator
                                        components={formData.components}
                                        onChange={(components) => setFormData({ ...formData, components })}
                                    />
                                </div>

                                <SubmitBtn
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {editingSubject ? 'Actualizar Materia' : 'Crear Materia'}
                                </SubmitBtn>
                            </Form>
                        </ModalContent>
                    </ModalOverlay>
                )}

                {isEnrollModalOpen && (
                    <ModalOverlay
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
                            <ModalHeaderWrapper>
                                <h2>Inscribir Estudiante</h2>
                                <p>Agrega un alumno a <strong>{currentSubjectForEnroll?.name}</strong></p>
                            </ModalHeaderWrapper>

                            <Form onSubmit={handleEnrollStudent}>
                                <FormGroup>
                                    <label>Seleccionar Estudiante</label>
                                    {availableStudents.length > 0 ? (
                                        <Select
                                            required
                                            value={selectedStudentId}
                                            onChange={(e) => setSelectedStudentId(e.target.value)}
                                        >
                                            <option value="">-- Elige un estudiante --</option>
                                            {availableStudents.map(s => (
                                                <option key={s.id} value={s.id}>{s.name} - {s.matricula}</option>
                                            ))}
                                        </Select>
                                    ) : (
                                        <div style={{ padding: '20px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px' }}>
                                            No hay más estudiantes disponibles para esta materia.
                                        </div>
                                    )}
                                </FormGroup>

                                <SubmitBtn
                                    type="submit"
                                    disabled={availableStudents.length === 0}
                                    style={{ opacity: availableStudents.length === 0 ? 0.5 : 1 }}
                                >
                                    Confirmar Inscripción
                                </SubmitBtn>
                            </Form>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default Subjects;
