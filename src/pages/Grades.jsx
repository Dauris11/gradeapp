import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle
} from 'lucide-react';
import { studentsAPI, subjectsAPI, enrollmentsAPI } from '../services/database';

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

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.md};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FilterGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.slate[700]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Select = styled.select`
  width: 100%;
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.slate[800]};
  font-size: ${props => props.theme.typography.fontSize.base};
  outline: none;
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    border-color: ${props => props.theme.colors.info.main};
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  }
`;

const GradesGrid = styled.div`
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

const GradeCard = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  overflow: hidden;
`;

const ColorBar = styled.div`
  height: 0.5rem;
  background: ${props => props.gradient};
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

const StudentInfo = styled.div``;

const StudentName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
`;

const SubjectName = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[500]};
`;

const IconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: ${props => props.gradient};
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-center;
  box-shadow: ${props => props.theme.shadows.lg};

  svg {
    color: white;
  }
`;

const GradeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const GradeDisplay = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const GradeInfo = styled.div``;

const GradeLabel = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[500]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const GradeValues = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${props => props.theme.spacing.sm};
`;

const GradeNumber = styled.span`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
`;

const LetterGrade = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.bgColor};
  color: ${props => props.color};
`;

const TrendIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.bgColor};
  color: ${props => props.color};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.bgColor};
  color: ${props => props.color};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const EmptyState = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: 3rem;
  text-align: center;

  svg {
    margin: 0 auto ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.slate[400]};
  }

  p {
    color: ${props => props.theme.colors.slate[500]};
    font-size: ${props => props.theme.typography.fontSize.lg};
  }
`;

const Grades = () => {
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
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
    loadData();
  }, []);

  const filteredGrades = enrollments.filter(enrollment => {
    const matchStudent = selectedStudent === 'all' || enrollment.studentId === parseInt(selectedStudent);
    const matchSubject = selectedSubject === 'all' || enrollment.subjectId === parseInt(selectedSubject);
    return matchStudent && matchSubject && enrollment.grade;
  });

  const getGradeColor = (grade) => {
    if (grade >= 90) return { bg: 'rgba(34, 197, 94, 0.1)', color: '#16A34A' };
    if (grade >= 80) return { bg: 'rgba(59, 130, 246, 0.1)', color: '#2563EB' };
    if (grade >= 70) return { bg: 'rgba(249, 115, 22, 0.1)', color: '#EA580C' };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' };
  };

  const getLetterGrade = (grade) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  const getImprovement = () => {
    return Math.floor(Math.random() * 15) - 5;
  };

  return (
    <Container>
      <div>
        <Title>Calificaciones</Title>
        <Subtitle>Gestiona y visualiza las calificaciones de los estudiantes</Subtitle>
      </div>

      <FiltersCard>
        <FiltersGrid>
          <FilterGroup>
            <Label>Filtrar por Estudiante</Label>
            <Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="all">Todos los estudiantes</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </Select>
          </FilterGroup>
          <FilterGroup>
            <Label>Filtrar por Materia</Label>
            <Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">Todas las materias</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </Select>
          </FilterGroup>
        </FiltersGrid>
      </FiltersCard>

      {filteredGrades.length > 0 ? (
        <GradesGrid>
          {filteredGrades.map((enrollment, index) => {
            const improvement = getImprovement();
            const gradeColors = getGradeColor(enrollment.grade);

            return (
              <GradeCard
                key={enrollment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <ColorBar gradient={`linear-gradient(to right, ${enrollment.color})`} />
                <CardContent>
                  <CardHeader>
                    <StudentInfo>
                      <StudentName>{enrollment.studentName}</StudentName>
                      <SubjectName>{enrollment.subjectName}</SubjectName>
                    </StudentInfo>
                    <IconWrapper gradient={`linear-gradient(to bottom right, ${enrollment.color})`}>
                      <GraduationCap size={28} />
                    </IconWrapper>
                  </CardHeader>

                  <GradeSection>
                    <GradeDisplay>
                      <GradeInfo>
                        <GradeLabel>Calificación</GradeLabel>
                        <GradeValues>
                          <GradeNumber>{enrollment.grade}</GradeNumber>
                          <LetterGrade
                            bgColor={gradeColors.bg}
                            color={gradeColors.color}
                          >
                            {getLetterGrade(enrollment.grade)}
                          </LetterGrade>
                        </GradeValues>
                      </GradeInfo>
                    </GradeDisplay>

                    <TrendIndicator
                      bgColor={improvement > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
                      color={improvement > 0 ? '#16A34A' : '#DC2626'}
                    >
                      {improvement > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      {Math.abs(improvement)}% desde el último parcial
                    </TrendIndicator>

                    {enrollment.grade >= 90 && (
                      <Badge bgColor="rgba(234, 179, 8, 0.1)" color="#CA8A04">
                        <Award size={18} />
                        Excelente desempeño
                      </Badge>
                    )}

                    {enrollment.grade < 70 && (
                      <Badge bgColor="rgba(239, 68, 68, 0.1)" color="#DC2626">
                        <AlertCircle size={18} />
                        Requiere atención
                      </Badge>
                    )}
                  </GradeSection>
                </CardContent>
              </GradeCard>
            );
          })}
        </GradesGrid>
      ) : (
        <EmptyState>
          <GraduationCap size={48} />
          <p>No se encontraron calificaciones con los filtros seleccionados</p>
        </EmptyState>
      )}
    </Container>
  );
};

export default Grades;
