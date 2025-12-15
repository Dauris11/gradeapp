import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Activity,
  Search,
  X,
  ArrowRight
} from 'lucide-react';
import { studentsAPI, subjectsAPI, enrollmentsAPI } from '../services/database';

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
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SearchSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 600px;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.slate[400]};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  padding-left: 3rem;
  padding-right: 3rem;
  background: white;
  border: 2px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  color: ${props => props.theme.colors.slate[800]};
  font-size: ${props => props.theme.typography.fontSize.base};
  outline: none;
  transition: all ${props => props.theme.transitions.base};
  box-shadow: ${props => props.theme.shadows.sm};

  &::placeholder {
    color: ${props => props.theme.colors.slate[400]};
  }

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), ${props => props.theme.shadows.lg};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.slate[400]};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    color: ${props => props.theme.colors.slate[600]};
    background: ${props => props.theme.colors.slate[100]};
  }
`;

const SearchResults = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
`;

const ResultCategory = styled.div`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.slate[50]};
  border-bottom: 1px solid ${props => props.theme.colors.slate[200]};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[600]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ResultItem = styled(motion.div)`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.slate[100]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.slate[50]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ResultContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
`;

const ResultIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.bgColor};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  flex-shrink: 0;
`;

const ResultText = styled.div`
  flex: 1;
`;

const ResultTitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: 0.125rem;
`;

const ResultSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.slate[500]};
`;

const EmptyResults = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.slate[400]};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${props => props.theme.spacing.lg};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCardWrapper = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

const StatBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 8rem;
  height: 8rem;
  background: ${props => props.color};
  opacity: 0.1;
  border-radius: 50%;
  margin-right: -4rem;
  margin-top: -4rem;
`;

const StatContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  z-index: 10;
`;

const StatInfo = styled.div``;

const StatLabel = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[500]};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatValue = styled.h3`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.lg};

  svg {
    color: white;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: ${props => props.theme.spacing.lg};
`;

const CardTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.xl};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.slate[50]};
  }
`;

const ActivityIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-center;
  flex-shrink: 0;

  svg {
    color: white;
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.p`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.slate[800]};
`;

const ActivitySubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.slate[500]};
`;

const ActivityTime = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.slate[400]};
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.gradient};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  box-shadow: 0 10px 15px -3px ${props => props.shadowColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px ${props => props.shadowColor};
  }
`;

const StatCard = ({ icon: Icon, title, value, color }) => (
  <StatCardWrapper
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
  >
    <StatBackground color={color} />
    <StatContent>
      <StatInfo>
        <StatLabel>{title}</StatLabel>
        <StatValue>{value}</StatValue>
      </StatInfo>
      <StatIcon color={color}>
        <Icon size={24} />
      </StatIcon>
    </StatContent>
  </StatCardWrapper>
);

const RecentActivity = ({ icon: Icon, title, subtitle, time, color }) => (
  <ActivityItem whileHover={{ x: 5 }}>
    <ActivityIcon color={color}>
      <Icon size={20} />
    </ActivityIcon>
    <ActivityInfo>
      <ActivityTitle>{title}</ActivityTitle>
      <ActivitySubtitle>{subtitle}</ActivitySubtitle>
    </ActivityInfo>
    <ActivityTime>{time}</ActivityTime>
  </ActivityItem>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ students: [], subjects: [], enrollments: [] });
  const [showResults, setShowResults] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    activeEnrollments: 0,
    averageGrade: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const students = await studentsAPI.getAll();
        const subjects = await subjectsAPI.getAll();
        const enrollments = await enrollmentsAPI.getAll();

        setStats({
          totalStudents: students.length || 0,
          totalSubjects: subjects.length || 0,
          activeEnrollments: enrollments.length || 0,
          averageGrade: 0
        });
      } catch (error) {
        console.error('Error cargando datos:', error);
        setStats({
          totalStudents: 0,
          totalSubjects: 0,
          activeEnrollments: 0,
          averageGrade: 0
        });
      }
    };

    loadData();
  }, []);

  // Search functionality
  const handleSearch = async (value) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setShowResults(false);
      return;
    }

    try {
      const students = await studentsAPI.getAll();
      const subjects = await subjectsAPI.getAll();
      const enrollments = await enrollmentsAPI.getAll();

      const searchLower = value.toLowerCase();

      const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower)
      ).slice(0, 5);

      const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(searchLower) ||
        (s.code && s.code.toLowerCase().includes(searchLower)) ||
        (s.teacher && s.teacher.toLowerCase().includes(searchLower))
      ).slice(0, 5);

      const filteredEnrollments = enrollments.filter(e =>
        e.studentName.toLowerCase().includes(searchLower) ||
        e.subjectName.toLowerCase().includes(searchLower)
      ).slice(0, 5);

      setSearchResults({
        students: filteredStudents,
        subjects: filteredSubjects,
        enrollments: filteredEnrollments
      });
      setShowResults(true);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  const handleResultClick = (type, id) => {
    setShowResults(false);
    setSearchTerm('');

    switch (type) {
      case 'student':
        navigate('/students');
        break;
      case 'subject':
        navigate('/subjects');
        break;
      case 'enrollment':
        navigate('/enrollments');
        break;
      default:
        break;
    }
  };

  const activities = [
    { icon: GraduationCap, title: 'Sistema inicializado', subtitle: 'Datos cargados correctamente', time: 'Ahora', color: '#3B82F6' },
    { icon: Users, title: 'Estudiantes disponibles', subtitle: `${stats.totalStudents} estudiantes registrados`, time: 'Hoy', color: '#22C55E' },
    { icon: BookOpen, title: 'Materias activas', subtitle: `${stats.totalSubjects} materias disponibles`, time: 'Hoy', color: '#A855F7' },
    { icon: Award, title: 'Promedio del sistema', subtitle: `${stats.averageGrade}% promedio general`, time: 'Hoy', color: '#F97316' },
  ];

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Bienvenido al sistema de gestión de calificaciones</Subtitle>
      </Header>

      <SearchSection>
        <SearchContainer>
          <SearchWrapper>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Buscar estudiantes, materias, inscripciones..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchTerm && setShowResults(true)}
            />
            {searchTerm && (
              <ClearButton onClick={handleClearSearch}>
                <X size={18} />
              </ClearButton>
            )}
          </SearchWrapper>

          {showResults && (
            <SearchResults
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {searchResults.students.length > 0 && (
                <>
                  <ResultCategory>Estudiantes</ResultCategory>
                  {searchResults.students.map(student => (
                    <ResultItem
                      key={student.id}
                      onClick={() => handleResultClick('student', student.id)}
                      whileHover={{ backgroundColor: '#F8FAFC' }}
                    >
                      <ResultContent>
                        <ResultIcon bgColor="rgba(59, 130, 246, 0.1)" color="#3B82F6">
                          <Users size={20} />
                        </ResultIcon>
                        <ResultText>
                          <ResultTitle>{student.name}</ResultTitle>
                          <ResultSubtitle>{student.email}</ResultSubtitle>
                        </ResultText>
                      </ResultContent>
                      <ArrowRight size={16} color="#94A3B8" />
                    </ResultItem>
                  ))}
                </>
              )}

              {searchResults.subjects.length > 0 && (
                <>
                  <ResultCategory>Materias</ResultCategory>
                  {searchResults.subjects.map(subject => (
                    <ResultItem
                      key={subject.id}
                      onClick={() => handleResultClick('subject', subject.id)}
                      whileHover={{ backgroundColor: '#F8FAFC' }}
                    >
                      <ResultContent>
                        <ResultIcon bgColor="rgba(34, 197, 94, 0.1)" color="#22C55E">
                          <BookOpen size={20} />
                        </ResultIcon>
                        <ResultText>
                          <ResultTitle>{subject.name}</ResultTitle>
                          <ResultSubtitle>{subject.code} • {subject.teacher}</ResultSubtitle>
                        </ResultText>
                      </ResultContent>
                      <ArrowRight size={16} color="#94A3B8" />
                    </ResultItem>
                  ))}
                </>
              )}

              {searchResults.enrollments.length > 0 && (
                <>
                  <ResultCategory>Inscripciones</ResultCategory>
                  {searchResults.enrollments.map(enrollment => (
                    <ResultItem
                      key={enrollment.id}
                      onClick={() => handleResultClick('enrollment', enrollment.id)}
                      whileHover={{ backgroundColor: '#F8FAFC' }}
                    >
                      <ResultContent>
                        <ResultIcon bgColor="rgba(168, 85, 247, 0.1)" color="#A855F7">
                          <GraduationCap size={20} />
                        </ResultIcon>
                        <ResultText>
                          <ResultTitle>{enrollment.studentName}</ResultTitle>
                          <ResultSubtitle>{enrollment.subjectName}</ResultSubtitle>
                        </ResultText>
                      </ResultContent>
                      <ArrowRight size={16} color="#94A3B8" />
                    </ResultItem>
                  ))}
                </>
              )}

              {searchResults.students.length === 0 &&
                searchResults.subjects.length === 0 &&
                searchResults.enrollments.length === 0 && (
                  <EmptyResults>
                    No se encontraron resultados para "{searchTerm}"
                  </EmptyResults>
                )}
            </SearchResults>
          )}
        </SearchContainer>
      </SearchSection>

      <StatsGrid>
        <StatCard
          icon={Users}
          title="Total Estudiantes"
          value={stats.totalStudents}
          color="#3B82F6"
        />
        <StatCard
          icon={BookOpen}
          title="Materias Activas"
          value={stats.totalSubjects}
          color="#22C55E"
        />
        <StatCard
          icon={GraduationCap}
          title="Inscripciones"
          value={stats.activeEnrollments}
          color="#A855F7"
        />
        <StatCard
          icon={Activity}
          title="Promedio General"
          value={`${stats.averageGrade}%`}
          color="#F97316"
        />
      </StatsGrid>

      <ContentGrid>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CardTitle>Actividad Reciente</CardTitle>
          <ActivityList>
            {activities.map((activity, index) => (
              <RecentActivity key={index} {...activity} />
            ))}
          </ActivityList>
        </Card>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardTitle>Acciones Rápidas</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ActionButton
              gradient="linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
              shadowColor="rgba(59, 130, 246, 0.3)"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/students')}
            >
              <Users size={20} />
              <span>Agregar Estudiante</span>
            </ActionButton>
            <ActionButton
              gradient="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
              shadowColor="rgba(34, 197, 94, 0.3)"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/subjects')}
            >
              <BookOpen size={20} />
              <span>Crear Materia</span>
            </ActionButton>
            <ActionButton
              gradient="linear-gradient(135deg, #A855F7 0%, #9333EA 100%)"
              shadowColor="rgba(168, 85, 247, 0.3)"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/grades')}
            >
              <GraduationCap size={20} />
              <span>Ver Calificaciones</span>
            </ActionButton>
          </div>
        </Card>
      </ContentGrid>
    </Container>
  );
};

export default Dashboard;
