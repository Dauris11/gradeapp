import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    Save,
    Filter,
    ArrowLeftRight,
    Search,
    ChevronDown,
    BookOpen
} from 'lucide-react';
import { subjectsAPI, enrollmentsAPI, attendanceAPI } from '../services/database';
import { useLanguage } from '../i18n/LanguageContext';
import { Toast, useToast } from '../components/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
  padding-bottom: 40px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${props => props.theme.colors.slate[900]};
    margin-bottom: 8px;
  }
  p {
    color: ${props => props.theme.colors.slate[500]};
    font-size: 16px;
    font-weight: 500;
  }
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ControlCard = styled.div`
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
  cursor: pointer;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const Input = styled.input`
  width: 100%;
  background: white;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: 14px;
  padding: 14px;
  font-size: 15px;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const StudentsCard = styled(motion.div)`
  ${props => props.theme.glassmorphism}
  border-radius: 28px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const StudentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.slate[100]};
  
  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.theme.colors.gradients.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

const NameContainer = styled.div`
  h3 { font-size: 16px; font-weight: 700; color: ${props => props.theme.colors.slate[800]}; }
  p { font-size: 12px; color: ${props => props.theme.colors.slate[500]}; }
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const StatusBtn = styled.button`
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;

  ${props => props.active ? `
    border-color: ${props.color};
    background: ${props.color}15;
    color: ${props.color};
  ` : `
    background: #f8fafc;
    color: #64748b;
    border-color: #f1f5f9;
  `}

  &:hover {
    background: ${props => props.active ? props.color + '20' : '#f1f5f9'};
  }
`;

const SaveButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.primary};
  color: white;
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px -5px rgba(79, 70, 229, 0.4);
  cursor: pointer;
  align-self: flex-end;
  margin-top: 20px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Attendance = () => {
    const { t } = useLanguage();
    const toast = useToast();
    const [subjects, setSubjects] = useState([]);
    const [allEnrollments, setAllEnrollments] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filteredEnrollments, setFilteredEnrollments] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [subj, enroll] = await Promise.all([
                subjectsAPI.getAll(),
                enrollmentsAPI.getAll()
            ]);
            setSubjects(subj);
            setAllEnrollments(enroll);
        } catch (error) {
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedSubject && selectedDate) {
            loadAttendance();
        } else {
            setFilteredEnrollments([]);
        }
    }, [selectedSubject, selectedDate]);

    const loadAttendance = async () => {
        try {
            const enrolls = allEnrollments.filter(e => e.subjectId === parseInt(selectedSubject));
            const existingAttendance = await attendanceAPI.getBySubjectAndDate(selectedSubject, selectedDate);

            const map = {};
            // Inicializar con asistentes existentes
            existingAttendance.forEach(a => {
                map[a.studentId] = { status: a.status, notes: a.notes };
            });

            // Rellenar los que no tienen registro como null o present por defecto si lo deseas
            enrolls.forEach(e => {
                if (!map[e.studentId]) {
                    map[e.studentId] = { status: null, notes: '' };
                }
            });

            setFilteredEnrollments(enrolls);
            setAttendanceMap(map);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusUpdate = (studentId, status) => {
        setAttendanceMap(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };

    const handleMarkAllPresent = () => {
        const newMap = { ...attendanceMap };
        filteredEnrollments.forEach(e => {
            newMap[e.studentId] = { ...newMap[e.studentId], status: 'present' };
        });
        setAttendanceMap(newMap);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const records = Object.keys(attendanceMap).map(studentId => ({
                studentId: parseInt(studentId),
                subjectId: parseInt(selectedSubject),
                date: selectedDate,
                status: attendanceMap[studentId].status || 'absent', // Default to absent if not marked? Or skip?
                notes: attendanceMap[studentId].notes
            })).filter(r => r.status !== null);

            if (records.length === 0) {
                toast.warning('No hay cambios para guardar');
                return;
            }

            await attendanceAPI.saveBulk(records);
            toast.success(t('common.success'));
        } catch (error) {
            toast.error(t('common.error'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
            <PageHeader>
                <HeaderTitle>
                    <h1>{t('attendance.title')}</h1>
                    <p>{t('attendance.subtitle')}</p>
                </HeaderTitle>
            </PageHeader>

            <ControlsGrid>
                <ControlCard>
                    <Label><Calendar size={18} /> {t('attendance.date')}</Label>
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </ControlCard>
                <ControlCard>
                    <Label><BookOpen size={18} /> {t('subjects.title')}</Label>
                    <Select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        <option value="">{t('attendance.selectSubject')}</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                    </Select>
                </ControlCard>
            </ControlsGrid>

            <AnimatePresence mode="wait">
                {selectedSubject ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <StudentsCard>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{t('students.title')}</h2>
                                <button
                                    onClick={handleMarkAllPresent}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#6366F1',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    {t('attendance.markAllPresent')}
                                </button>
                            </div>

                            {filteredEnrollments.length > 0 ? (
                                filteredEnrollments.map((e) => (
                                    <StudentRow key={e.id}>
                                        <StudentInfo>
                                            <Avatar>{e.studentName?.charAt(0)}</Avatar>
                                            <NameContainer>
                                                <h3>{e.studentName}</h3>
                                                <p>{e.subjectCode} • {t('students.active')}</p>
                                            </NameContainer>
                                        </StudentInfo>

                                        <StatusButtons>
                                            <StatusBtn
                                                active={attendanceMap[e.studentId]?.status === 'present'}
                                                color="#10B981"
                                                onClick={() => handleStatusUpdate(e.studentId, 'present')}
                                            >
                                                <CheckCircle2 size={16} />
                                                {t('attendance.present')}
                                            </StatusBtn>
                                            <StatusBtn
                                                active={attendanceMap[e.studentId]?.status === 'absent'}
                                                color="#EF4444"
                                                onClick={() => handleStatusUpdate(e.studentId, 'absent')}
                                            >
                                                <XCircle size={16} />
                                                {t('attendance.absent')}
                                            </StatusBtn>
                                            <StatusBtn
                                                active={attendanceMap[e.studentId]?.status === 'late'}
                                                color="#F59E0B"
                                                onClick={() => handleStatusUpdate(e.studentId, 'late')}
                                            >
                                                <Clock size={16} />
                                                {t('attendance.late')}
                                            </StatusBtn>
                                        </StatusButtons>
                                    </StudentRow>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
                                    {t('common.noData')}
                                </p>
                            )}

                            {filteredEnrollments.length > 0 && (
                                <SaveButton
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    <Save size={20} />
                                    {saving ? t('common.loading') : t('attendance.saveAttendance')}
                                </SaveButton>
                            )}
                        </StudentsCard>
                    </motion.div>
                ) : (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}
                    >
                        <Users size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
                        <h3>{t('attendance.selectSubject')}</h3>
                    </motion.div>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default Attendance;
