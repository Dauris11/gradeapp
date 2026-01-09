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
import { academicAPI } from '../services/database';
import { useToast, Toast } from '../components/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div``;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.slate[500]};
`;

const SearchBar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 12px 20px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: ${props => props.theme.colors.slate[900]};

  &::placeholder {
    color: ${props => props.theme.colors.slate[400]};
  }
`;

const StudentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const StudentCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-4px);
  }
`;

const StudentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
`;

const StudentAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: ${props => props.theme.colors.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 800;
  flex-shrink: 0;
`;

const StudentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const StudentName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.slate[900]};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StudentMatricula = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.slate[500]};
  font-weight: 600;
`;

const StatusBadge = styled.div`
  padding: 4px 12px;
  border-radius: 20px;
  background: ${props => {
    switch (props.$status) {
      case 'active': return '#dcfce7';
      case 'completed': return '#e0e7ff';
      case 'withdrawn': return '#fef3c7';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active': return '#10b981';
      case 'completed': return '#6366f1';
      case 'withdrawn': return '#d97706';
      default: return '#64748b';
    }
  }};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const StudentStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.slate[500]};
  text-transform: uppercase;
  font-weight: 700;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
`;

const PeriodsTimeline = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 16px;
`;

const TimelineTitle = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.slate[500]};
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 12px;
`;

const TimelineItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${props => props.theme.colors.slate[600]};
`;

const TimelineDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary.main};
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  background: white; border-radius: 20px; padding: 60px; text-align: center;
  border: 2px dashed ${props => props.theme.colors.border}; grid-column: 1 / -1;
`;

const StudentHistory = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try {
      const data = await academicAPI.getAllTimeStudents();
      const validData = Array.isArray(data) ? data : [];

      const studentsWithHistory = await Promise.all(
        validData.map(async (student) => {
          const history = await academicAPI.getStudentHistory(student.id);
          return { ...student, history: Array.isArray(history) ? history : [] };
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

  if (loading) return <Container>Cargando historial...</Container>;

  return (
    <Container>
      <Header>
        <Title>Historial de Estudiantes</Title>
        <Subtitle>Registro completo de todos los estudiantes que han cursado en la institución</Subtitle>
      </Header>

      <SearchBar>
        <Search size={20} color="#64748B" />
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
                <StudentAvatar>{getInitials(student.name)}</StudentAvatar>
                <StudentInfo>
                  <StudentName>{student.name}</StudentName>
                  <StudentMatricula>{student.matricula}</StudentMatricula>
                </StudentInfo>
                <StatusBadge $status={student.status || 'active'}>
                  {student.status === 'completed' ? <Award size={12} /> : <CheckCircle size={12} />}
                  {student.status || 'Activo'}
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
                          <span style={{ marginLeft: 'auto', fontWeight: 800, color: '#1E293B' }}>
                            {record.averageGrade.toFixed(1)}
                          </span>
                        )}
                      </TimelineItem>
                    ))}
                  </TimelineItems>
                </PeriodsTimeline>
              )}
            </StudentCard>
          ))
        ) : (
          <EmptyState>
            <User size={64} color="#CBD5E1" style={{ marginBottom: '20px' }} />
            <h3 style={{ margin: '0 0 10px' }}>No se encontraron estudiantes</h3>
            <p style={{ color: '#64748B', margin: 0 }}>Intenta con otro término de búsqueda.</p>
          </EmptyState>
        )}
      </StudentsGrid>
    </Container>
  );
};

export default StudentHistory;
