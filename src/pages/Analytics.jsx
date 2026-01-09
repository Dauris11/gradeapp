import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
    TrendingUp,
    Users,
    BookOpen,
    Award,
    Calendar,
    PieChart as PieChartIcon,
    BarChart3,
    Activity
} from 'lucide-react';
import { analyticsAPI, subjectsAPI, studentsAPI, enrollmentsAPI } from '../services/database';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 40px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
  letter-spacing: -0.04em;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.slate[500]};
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

const StatCard = styled(motion.div)`
  ${props => props.theme.glassmorphism}
  padding: 24px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg};
  color: white;
  box-shadow: 0 8px 16px ${props => props.bg}40;
`;

const StatInfo = styled.div`
  h4 { font-size: 14px; color: ${props => props.theme.colors.slate[500]}; font-weight: 600; margin-bottom: 4px; }
  span { font-size: 28px; font-weight: 800; color: ${props => props.theme.colors.slate[900]}; }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  ${props => props.theme.glassmorphism}
  padding: 32px;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  height: 450px;
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  h3 { font-size: 20px; font-weight: 800; color: ${props => props.theme.colors.slate[900]}; }
  svg { color: ${props => props.theme.colors.primary.main}; }
`;

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899'];

const Analytics = () => {
    const { t } = useLanguage();
    const [gradeData, setGradeData] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [summaryStats, setSummaryStats] = useState({
        totalStudents: 0,
        avgGrade: 0,
        totalSubjects: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [grades, performance, attendance, students, subjects, enrollments] = await Promise.all([
                analyticsAPI.getGradesDistribution(),
                analyticsAPI.getSubjectPerformance(),
                analyticsAPI.getAttendanceSummary(),
                studentsAPI.getAll(),
                subjectsAPI.getAll(),
                enrollmentsAPI.getAll()
            ]);

            setGradeData(grades);
            setPerformanceData(performance);
            setAttendanceData(attendance);

            // Calcular promedio general de promedios de materias
            const avg = performance.length > 0
                ? performance.reduce((sum, p) => sum + p.average, 0) / performance.length
                : 0;

            setSummaryStats({
                totalStudents: students.length,
                totalSubjects: subjects.length,
                avgGrade: Math.round(avg * 10) / 10
            });
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando analíticas...</div>;
    }

    return (
        <Container>
            <Header>
                <Title>{t('analytics.title')}</Title>
                <Subtitle>{t('analytics.subtitle')}</Subtitle>
            </Header>

            <StatsGrid>
                <StatCard whileHover={{ y: -5 }}>
                    <IconWrapper bg="#6366F1">
                        <Users size={28} />
                    </IconWrapper>
                    <StatInfo>
                        <h4>{t('analytics.totalStudents')}</h4>
                        <span>{summaryStats.totalStudents}</span>
                    </StatInfo>
                </StatCard>

                <StatCard whileHover={{ y: -5 }}>
                    <IconWrapper bg="#10B981">
                        <Award size={28} />
                    </IconWrapper>
                    <StatInfo>
                        <h4>{t('analytics.averageGrade')}</h4>
                        <span>{summaryStats.avgGrade}%</span>
                    </StatInfo>
                </StatCard>

                <StatCard whileHover={{ y: -5 }}>
                    <IconWrapper bg="#F59E0B">
                        <BookOpen size={28} />
                    </IconWrapper>
                    <StatInfo>
                        <h4>{t('dashboard.totalSubjects')}</h4>
                        <span>{summaryStats.totalSubjects}</span>
                    </StatInfo>
                </StatCard>
            </StatsGrid>

            <ChartsGrid>
                <ChartCard
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <ChartTitle>
                        <BarChart3 size={24} />
                        <h3>{t('analytics.gradeDistribution')}</h3>
                    </ChartTitle>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gradeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: '#f1f5f9' }}
                            />
                            <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <ChartTitle>
                        <PieChartIcon size={24} />
                        <h3>{t('analytics.attendanceOverview')}</h3>
                    </ChartTitle>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={attendanceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {attendanceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ gridColumn: 'span 2' }}
                >
                    <ChartTitle>
                        <TrendingUp size={24} />
                        <h3>{t('analytics.subjectPerformance')}</h3>
                    </ChartTitle>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="average" fill="#10B981" radius={[0, 8, 8, 0]} barSize={25} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </ChartsGrid>
        </Container>
    );
};

export default Analytics;
