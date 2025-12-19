import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
    User,
    Calendar,
    BookOpen,
    Award,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    Filter
} from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Header = styled.div``;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
`;

const SearchBar = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.primary};

  &::placeholder {
    color: ${props => props.theme.colors.text.muted};
  }
`;

const StudentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const StudentCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.xl};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: ${props => props.theme.shadows.xl};
    transform: translateY(-4px);
  }
`;

const StudentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StudentAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  flex-shrink: 0;
`;

const StudentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const StudentName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StudentMatricula = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.muted};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const StatusBadge = styled.div`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => {
        switch (props.$status) {
            case 'active': return props.theme.colors.success.main + '20';
            case 'completed': return props.theme.colors.info.main + '20';
            case 'withdrawn': return props.theme.colors.warning.main + '20';
            case 'suspended': return props.theme.colors.danger.main + '20';
            default: return props.theme.colors.slate[100];
        }
    }};
  color: ${props => {
        switch (props.$status) {
            case 'active': return props.theme.colors.success.main;
            case 'completed': return props.theme.colors.info.main;
            case 'withdrawn': return props.theme.colors.warning.main;
            case 'suspended': return props.theme.colors.danger.main;
            default: return props.theme.colors.text.secondary;
        }
    }};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const StudentStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const PeriodsTimeline = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: ${props => props.theme.spacing.md};
`;

const TimelineTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TimelineItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const TimelineDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.primary.main};
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: 60px 40px;
  text-align: center;
  border: 2px dashed ${props => props.theme.colors.border};
  grid-column: 1 / -1;

  svg {
    margin: 0 auto ${props => props.theme.spacing.lg};
    color: ${props => props.theme.colors.text.muted};
  }

  h3 {
    font-size: ${props => props.theme.typography.fontSize.xl};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  p {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const StudentHistory = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/academic/students/all-time');
            const data = await response.json();

            // Cargar historial de cada estudiante
            const studentsWithHistory = await Promise.all(
                data.map(async (student) => {
                    const historyResponse = await fetch(`http://localhost:3001/api/academic/students/${student.id}/history`);
                    const history = await historyResponse.json();
                    return { ...student, history };
                })
            );

            setStudents(studentsWithHistory);
        } catch (error) {
            console.error('Error cargando estudiantes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.matricula.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircle size={12} />;
            case 'completed': return <Award size={12} />;
            case 'withdrawn': return <AlertCircle size={12} />;
            case 'suspended': return <XCircle size={12} />;
            default: return <Clock size={12} />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Activo';
            case 'completed': return 'Completado';
            case 'withdrawn': return 'Retirado';
            case 'suspended': return 'Suspendido';
            default: return status;
        }
    };

    return (
        <Container>
            <Header>
                <Title>Historial de Estudiantes</Title>
                <Subtitle>Registro completo de todos los estudiantes que han cursado en la institución</Subtitle>
            </Header>

            <SearchBar>
                <Search size={20} color={props => props.theme.colors.text.muted} />
                <SearchInput
                    type="text"
                    placeholder="Buscar por nombre o matrícula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchBar>

            <StudentsGrid>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                        <StudentCard
                            key={student.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <StudentHeader>
                                <StudentAvatar>
                                    {getInitials(student.name)}
                                </StudentAvatar>
                                <StudentInfo>
                                    <StudentName>{student.name}</StudentName>
                                    <StudentMatricula>{student.matricula}</StudentMatricula>
                                </StudentInfo>
                                <StatusBadge $status={student.status}>
                                    {getStatusIcon(student.status)}
                                    {getStatusLabel(student.status)}
                                </StatusBadge>
                            </StudentHeader>

                            <StudentStats>
                                <StatItem>
                                    <StatLabel>Períodos Cursados</StatLabel>
                                    <StatValue>{student.periodsAttended || 0}</StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>Último Período</StatLabel>
                                    <StatValue>{student.lastPeriod || 'N/A'}</StatValue>
                                </StatItem>
                            </StudentStats>

                            {student.history && student.history.length > 0 && (
                                <PeriodsTimeline>
                                    <TimelineTitle>Historial Académico</TimelineTitle>
                                    <TimelineItems>
                                        {student.history.slice(0, 3).map((record) => (
                                            <TimelineItem key={record.id}>
                                                <TimelineDot />
                                                <span>{record.periodName}</span>
                                                {record.averageGrade && (
                                                    <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
                                                        {record.averageGrade.toFixed(1)}
                                                    </span>
                                                )}
                                            </TimelineItem>
                                        ))}
                                        {student.history.length > 3 && (
                                            <TimelineItem>
                                                <span style={{ fontSize: '11px', fontStyle: 'italic' }}>
                                                    +{student.history.length - 3} períodos más
                                                </span>
                                            </TimelineItem>
                                        )}
                                    </TimelineItems>
                                </PeriodsTimeline>
                            )}
                        </StudentCard>
                    ))
                ) : (
                    <EmptyState>
                        <User size={64} />
                        <h3>No se encontraron estudiantes</h3>
                        <p>
                            {searchTerm
                                ? 'Intenta con otro término de búsqueda'
                                : 'Aún no hay estudiantes registrados en el sistema'
                            }
                        </p>
                    </EmptyState>
                )}
            </StudentsGrid>
        </Container>
    );
};

export default StudentHistory;
