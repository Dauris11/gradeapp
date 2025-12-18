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
    X,
    Filter,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { studentsAPI, subjectsAPI, enrollmentsAPI } from '../services/database';
import { Toast, useToast } from '../components/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
  padding-bottom: 40px;
`;

const Header = styled.div`
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

const TitleSection = styled.div`
  h1 {
    font-size: 36px;
    font-weight: 800;
    color: ${props => props.theme.colors.slate[900]};
    letter-spacing: -0.04em;
    margin-bottom: 8px;
  }
  p {
    font-size: 16px;
    color: ${props => props.theme.colors.slate[500]};
    font-weight: 500;
  }
`;

const AddButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.primary};
  color: white;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
  border: none;
  cursor: pointer;
`;

const FiltersCard = styled.div`
  ${props => props.theme.glassmorphism}
  border-radius: 24px;
  padding: 24px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 14px;
    color: ${props => props.theme.colors.slate[400]};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 42px;
  background: white;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  background: white;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const EnrollmentCard = styled(motion.div)`
  ${props => props.theme.glassmorphism}
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const CardTop = styled.div`
  height: 6px;
  background: linear-gradient(to right, ${props => props.color});
`;

const CardBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const IconBox = styled.div`
  width: 44px;
  height: 44px;
  background: ${props => props.bg};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StudentInfo = styled.div`
   margin-top: 8px;
   h3 { font-size: 18px; font-weight: 800; color: ${props => props.theme.colors.slate[900]}; margin-bottom: 4px; }
   div { font-size: 13px; color: ${props => props.theme.colors.slate[500]}; font-weight: 500; display: flex; align-items: center; gap: 6px; }
`;

const SubjectInfo = styled.div`
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.8);

  h4 { font-size: 14px; font-weight: 700; color: ${props => props.theme.colors.slate[800]}; margin-bottom: 2px; }
  p { font-size: 12px; color: ${props => props.theme.colors.slate[500]}; }
`;

const GradeBadge = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;

  span { font-size: 12px; font-weight: 700; color: ${props => props.theme.colors.slate[400]}; text-transform: uppercase; }
  div { 
    padding: 4px 12px; 
    border-radius: 10px; 
    font-size: 13px; 
    font-weight: 800; 
    background: ${props => props.bg};
    color: ${props => props.color};
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
  max-width: 480px;
  padding: 40px;
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

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [st, su, en] = await Promise.all([
                studentsAPI.getAll(), subjectsAPI.getAll(), enrollmentsAPI.getAll()
            ]);
            setStudents(st); setSubjects(su); setEnrollments(en);
        } catch (err) { console.error(err); }
    };

    const filtered = enrollments.filter(e => {
        const matchSearch = e.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || e.subjectName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStudent = filterStudent === 'all' || e.studentId === parseInt(filterStudent);
        const matchSubject = filterSubject === 'all' || e.subjectId === parseInt(filterSubject);
        return matchSearch && matchStudent && matchSubject;
    });

    const handleDelete = async (id, sName, suName) => {
        if (window.confirm(`¿Retirar a ${sName} de ${suName}?`)) {
            try {
                await enrollmentsAPI.delete(id);
                toast.success('Retiro completado');
                await loadData();
            } catch (err) { toast.error('Error: Posiblemente tiene notas registradas'); }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const student = students.find(s => s.id === parseInt(formData.studentId));
        const subject = subjects.find(s => s.id === parseInt(formData.subjectId));
        if (!student || !subject) return;

        if (enrollments.some(e => e.studentId === student.id && e.subjectId === subject.id)) {
            return toast.warning('Ya está inscrito');
        }

        try {
            await enrollmentsAPI.create({
                studentId: student.id, studentName: student.name,
                subjectId: subject.id, subjectName: subject.name,
                subjectCode: subject.code, color: subject.color
            });
            await loadData(); setIsModalOpen(false); toast.success('Inscripción exitosa');
        } catch (err) { toast.error('Error al inscribir'); }
    };

    const getGradeStyles = (grade) => {
        if (!grade) return { bg: '#F1F5F9', color: '#64748B' };
        if (grade >= 90) return { bg: '#ECFDF5', color: '#10B981' };
        if (grade >= 80) return { bg: '#EEF2FF', color: '#6366F1' };
        if (grade >= 70) return { bg: '#FFFBEB', color: '#F59E0B' };
        return { bg: '#FEF2F2', color: '#EF4444' };
    };

    return (
        <Container>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
            <Header>
                <TitleSection>
                    <h1>Inscripciones</h1>
                    <p>Relación académica entre estudiantes y materias curriculares</p>
                </TitleSection>
                <AddButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={20} /> Inscribir Alumno
                </AddButton>
            </Header>

            <FiltersCard>
                <InputWrapper>
                    <Search size={18} />
                    <Input placeholder="Buscar por nombre o materia..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </InputWrapper>
                <Select value={filterStudent} onChange={e => setFilterStudent(e.target.value)}>
                    <option value="all">Filtro por Estudiante</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
                <Select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
                    <option value="all">Filtro por Materia</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
            </FiltersCard>

            <Grid>
                {filtered.map((en, idx) => {
                    const styles = getGradeStyles(en.grade);
                    return (
                        <EnrollmentCard key={en.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} whileHover={{ y: -8 }}>
                            <CardTop color={en.color || '#6366F1, #8B5CF6'} />
                            <CardBody>
                                <CardHeader>
                                    <IconBox bg={en.color || '#6366F1'}><Users size={20} /></IconBox>
                                    <motion.button
                                        onClick={() => handleDelete(en.id, en.studentName, en.subjectName)}
                                        style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <Trash2 size={16} />
                                    </motion.button>
                                </CardHeader>
                                <StudentInfo>
                                    <h3>{en.studentName}</h3>
                                    <div><UserPlus size={14} /> Registro Académico</div>
                                </StudentInfo>
                                <SubjectInfo>
                                    <h4>{en.subjectName}</h4>
                                    <p>Código: {en.subjectCode}</p>
                                </SubjectInfo>
                                <GradeBadge bg={styles.bg} color={styles.color}>
                                    <span>Promedio Actual</span>
                                    <div>{en.grade ? `${en.grade}%` : 'S/N'}</div>
                                </GradeBadge>
                            </CardBody>
                        </EnrollmentCard>
                    );
                })}
            </Grid>

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '32px' }}>
                    <AlertCircle size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                    <h3 style={{ color: '#64748b' }}>No se encontraron inscripciones</h3>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}>
                        <ModalContent initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Inscribir Alumno</h2>
                                <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '700' }}>Seleccionar Estudiante</label>
                                    <Select required value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })}>
                                        <option value="">Buscar estudiante...</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </Select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '700' }}>Seleccionar Materia</label>
                                    <Select required value={formData.subjectId} onChange={e => setFormData({ ...formData, subjectId: e.target.value })}>
                                        <option value="">Buscar materia...</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                    </Select>
                                </div>
                                <AddButton type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                                    <Plus size={18} /> Confirmar Inscripción
                                </AddButton>
                            </form>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default Enrollments;
