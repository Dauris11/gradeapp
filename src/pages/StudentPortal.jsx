import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
    User,
    BookOpen,
    Award,
    Calendar,
    LogOut,
    TrendingUp,
    ChevronRight,
    ShieldCheck,
    ClipboardList
} from 'lucide-react';
import { portalAPI } from '../services/database';
import { Toast, useToast } from '../components/Toast';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 40px 20px;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px 32px;
  border-radius: 24px;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  background: ${props => props.theme.colors.gradients.primary};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 800;
`;

const WelcomeText = styled.div`
  h1 { font-size: 24px; font-weight: 800; color: #1e293b; margin: 0; }
  p { font-size: 14px; color: #64748b; margin: 4px 0 0; }
`;

const LogoutBtn = styled.button`
  background: #fee2e2;
  color: #ef4444;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #fecaca; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  padding: 32px;
  border-radius: 28px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 24px;
  color: #1e293b;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th { text-align: left; padding: 12px; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700; }
  td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
`;

const GradeBadge = styled.span`
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 700;
  background: ${props => props.score >= 70 ? '#ecfdf5' : '#fff1f2'};
  color: ${props => props.score >= 70 ? '#10b981' : '#f43f5e'};
`;

const StudentPortal = () => {
    const toast = useToast();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user && user.id) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const res = await portalAPI.getStudentData(user.id);
            setData(res);
        } catch (e) {
            toast.error("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (loading) return <Container>Cargando...</Container>;
    if (!data) return <Container>No se encontró información del estudiante.</Container>;

    const average = data.grades.length > 0
        ? (data.grades.reduce((acc, g) => acc + (g.score || 0), 0) / data.grades.length).toFixed(1)
        : 0;

    const attendanceRate = data.attendance.length > 0
        ? ((data.attendance.filter(a => a.status === 'present').length / data.attendance.length) * 100).toFixed(0)
        : 100;

    return (
        <Container>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
            <Content>
                <Header>
                    <UserInfo>
                        <Avatar>{data.student.name.charAt(0)}</Avatar>
                        <WelcomeText>
                            <h1>Hola, {data.student.name}</h1>
                            <p>Portal del Estudiante • {data.student.matricula}</p>
                        </WelcomeText>
                    </UserInfo>
                    <LogoutBtn onClick={handleLogout}>
                        <LogOut size={18} /> Cerrar Sesión
                    </LogoutBtn>
                </Header>

                <StatsGrid>
                    <StatCard whileHover={{ y: -5 }}>
                        <StatIcon bg="#e0e7ff" color="#6366f1"><BookOpen size={20} /></StatIcon>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>MATERIAS</div>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>{data.enrollments.length}</div>
                    </StatCard>
                    <StatCard whileHover={{ y: -5 }}>
                        <StatIcon bg="#dcfce7" color="#10b981"><TrendingUp size={20} /></StatIcon>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>PROMEDIO</div>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>{average}</div>
                    </StatCard>
                    <StatCard whileHover={{ y: -5 }}>
                        <StatIcon bg="#ecfdf5" color="#10b981"><ShieldCheck size={20} /></StatIcon>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>ASISTENCIA</div>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>{attendanceRate}%</div>
                    </StatCard>
                </StatsGrid>

                <MainGrid>
                    <Section>
                        <SectionTitle><Award size={24} color="#6366f1" /> Calificaciones Recientes</SectionTitle>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Actividad</th>
                                    <th>Materia</th>
                                    <th>Fecha</th>
                                    <th>Nota</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.grades.map(grade => (
                                    <tr key={grade.id}>
                                        <td style={{ fontWeight: '600' }}>{grade.name}</td>
                                        <td>{grade.componentName}</td>
                                        <td>{new Date(grade.date).toLocaleDateString()}</td>
                                        <td><GradeBadge score={grade.score}>{grade.score}/{grade.maxScore}</GradeBadge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Section>

                    <Section>
                        <SectionTitle><ClipboardList size={24} color="#f59e0b" /> Inscripciones</SectionTitle>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {data.enrollments.map(en => (
                                <div key={en.id} style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', borderLeft: `4px solid ${en.color || '#6366f1'}` }}>
                                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{en.subjectName}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Prof: {en.teacher}</div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </MainGrid>
            </Content>
        </Container>
    );
};

export default StudentPortal;
