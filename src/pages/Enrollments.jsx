import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    Search,
    Plus,
    Trash2,
    Award,
    BookOpen,
    Users,
    X
} from 'lucide-react';
import { studentsAPI, subjectsAPI, enrollmentsAPI } from '../services/database';
import { Toast, useToast } from '../components/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
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
  background: ${props => props.theme.colors.gradients.purple};
  color: white;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.3);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const FiltersCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: ${props => props.theme.spacing.lg};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.md};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
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

const Input = styled.input`
  width: 100%;
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md};
  padding-left ${props => props.withIcon ? '2.5rem' : props.theme.spacing.md};
  color: ${props => props.theme.colors.slate[800]};
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors.info.main};
    background: white;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
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

  &:focus {
    border-color: ${props => props.theme.colors.info.main};
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled(motion.div)`
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
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(to bottom right, ${props => props.color});
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-center;
  box-shadow: ${props => props.theme.shadows.lg};

  svg {
    color: white;
  }
`;

const DeleteButton = styled(motion.button)`
  width: 2rem;
  height: 2rem;
  background: rgba(239, 68, 68, 0.1);
  color: #DC2626;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
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

const Enrollments = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStudent, setFilterStudent] = useState('all');
    const [filterSubject, setFilterSubject] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ studentId: '', subjectId: '' });
    const toast = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [studentsData, subjectsData, enrollmentsData] = await Promise.all([
                studentsAPI.getAll(),
                subjectsAPI.getAll(),
                enrollmentsAPI.getAll()
            ]);
            setStudents(studentsData);
            setSubjects(subjectsData);
            setEnrollments(enrollmentsData);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setStudents([]);
            setSubjects([]);
            setEnrollments([]);
        }
    };

    const filteredEnrollments = enrollments.filter(enrollment => {
        const matchSearch = enrollment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment.subjectName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStudent = filterStudent === 'all' || enrollment.studentId === parseInt(filterStudent);
        const matchSubject = filterSubject === 'all' || enrollment.subjectId === parseInt(filterSubject);
        return matchSearch && matchStudent && matchSubject;
    });

    const handleDelete = async (id, studentName, subjectName) => {
        if (confirm(`¿Eliminar la inscripción de ${studentName} en ${subjectName}?`)) {
            try {
                await enrollmentsAPI.delete(id);
                toast.success('La inscripción fue eliminada correctamente', 'Eliminación Exitosa');
                await loadData();
            } catch (error) {
                console.error('Error eliminando inscripción:', error);
                toast.error('No se pudo eliminar. La inscripción tiene calificaciones registradas.', 'Error al Eliminar');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const student = students.find(s => s.id === parseInt(formData.studentId));
        const subject = subjects.find(s => s.id === parseInt(formData.subjectId));

        if (!student || !subject) return;

        const exists = enrollments.some(e =>
            e.studentId === parseInt(formData.studentId) &&
            e.subjectId === parseInt(formData.subjectId)
        );

        if (exists) {
            toast.warning('Este estudiante ya está inscrito en esta materia', 'Inscripción Duplicada');
            return;
        }

        try {
            await enrollmentsAPI.create({
                studentId: student.id,
                studentName: student.name,
                subjectId: subject.id,
                subjectName: subject.name,
                subjectCode: subject.code,
                color: subject.color
            });

            await loadData();
            setIsModalOpen(false);
            toast.success(`${student.name} inscrito en ${subject.name}`, 'Inscripción Exitosa');
        } catch (error) {
            console.error('Error creando inscripción:', error);
            toast.error('No se pudo crear la inscripción', 'Error');
        }
    };

    const getGradeColor = (grade) => {
        if (!grade) return { bg: 'rgba(148, 163, 184, 0.1)', color: '#64748B' };
        if (grade >= 90) return { bg: 'rgba(34, 197, 94, 0.1)', color: '#16A34A' };
        if (grade >= 80) return { bg: 'rgba(59, 130, 246, 0.1)', color: '#2563EB' };
        if (grade >= 70) return { bg: 'rgba(249, 115, 22, 0.1)', color: '#EA580C' };
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' };
    };

    return (
        <Container>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
            <Header>
                <div>
                    <Title>Inscripciones</Title>
                    <Subtitle>Gestiona las inscripciones de estudiantes en materias</Subtitle>
                </div>
                <AddButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={20} />
                    <span>Nueva Inscripción</span>
                </AddButton>
            </Header>

            <FiltersCard>
                <FiltersGrid>
                    <SearchWrapper>
                        <SearchIcon>
                            <Search size={20} />
                        </SearchIcon>
                        <Input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            withIcon
                        />
                    </SearchWrapper>
                    <Select value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)}>
                        <option value="all">Todos los estudiantes</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </Select>
                    <Select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
                        <option value="all">Todas las materias</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </Select>
                </FiltersGrid>
            </FiltersCard>

            <Grid>
                {filteredEnrollments.map((enrollment, index) => {
                    const gradeColors = getGradeColor(enrollment.grade);
                    return (
                        <Card
                            key={enrollment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                        >
                            <ColorBar color={enrollment.color} />
                            <CardContent>
                                <CardHeader>
                                    <IconWrapper color={enrollment.color}>
                                        <UserPlus size={24} />
                                    </IconWrapper>
                                    <DeleteButton
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(enrollment.id)}
                                    >
                                        <Trash2 size={16} />
                                    </DeleteButton>
                                </CardHeader>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Users size={14} />
                                            <span>Estudiante</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{enrollment.studentName}</h3>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <BookOpen size={14} />
                                            <span>Materia</span>
                                        </div>
                                        <p style={{ fontWeight: '600', color: '#334155' }}>{enrollment.subjectName}</p>
                                        <p style={{ fontSize: '0.875rem', color: '#64748B' }}>{enrollment.subjectCode}</p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Award size={14} />
                                            <span>Calificación</span>
                                        </div>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            background: gradeColors.bg,
                                            color: gradeColors.color
                                        }}>
                                            {enrollment.grade || 'Sin nota'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </Grid>

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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Nueva Inscripción</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    style={{
                                        width: '2rem',
                                        height: '2rem',
                                        background: '#F1F5F9',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>
                                        Estudiante
                                    </label>
                                    <Select
                                        required
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    >
                                        <option value="">-- Selecciona un estudiante --</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>
                                        Materia
                                    </label>
                                    <Select
                                        required
                                        value={formData.subjectId}
                                        onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                    >
                                        <option value="">-- Selecciona una materia --</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                        ))}
                                    </Select>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem' }}>
                                    <motion.button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            flex: 1,
                                            background: '#E2E8F0',
                                            color: '#1E293B',
                                            padding: '0.75rem',
                                            borderRadius: '0.75rem',
                                            fontWeight: '500',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancelar
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            flex: 1,
                                            background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
                                            color: 'white',
                                            padding: '0.75rem',
                                            borderRadius: '0.75rem',
                                            fontWeight: '500',
                                            border: 'none',
                                            cursor: 'pointer',
                                            boxShadow: '0 10px 15px -3px rgba(168, 85, 247, 0.3)'
                                        }}
                                    >
                                        Crear
                                    </motion.button>
                                </div>
                            </form>
                        </ModalContent>
                    </Modal>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default Enrollments;
