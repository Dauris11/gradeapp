import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Activity,
  ArrowRight,
  Plus,
  Calendar,
  Clock,
  ChevronRight,
  Zap,
  UserCheck,
  FileText,
  MousePointer2,
  Sparkles
} from 'lucide-react';
import { studentsAPI, subjectsAPI, enrollmentsAPI } from '../services/database';
import { useLanguage } from '../i18n/LanguageContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
  padding-bottom: 40px;
`;

const HeroSection = styled.div`
  position: relative;
  padding: 48px;
  background: ${props => props.theme.colors.gradients.primary};
  border-radius: 32px;
  color: white;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 300px;
    height: 300px;
    background: white;
    opacity: 0.1;
    filter: blur(80px);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    padding: 32px;
  }
`;

const HeroContent = styled.div`
  max-width: 500px;
  h1 {
    font-size: 42px;
    font-weight: 800;
    margin-bottom: 12px;
    letter-spacing: -0.04em;
    line-height: 1.1;
  }
  p {
    font-size: 18px;
    opacity: 0.9;
    font-weight: 500;
  }
`;

const QuickActionBtn = styled(motion.button)`
  background: white;
  color: ${props => props.theme.colors.primary.main};
  padding: 16px 32px;
  border-radius: 18px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
`;

const StatCard = styled(motion.div)`
  ${props => props.theme.glassmorphism}
  padding: 28px;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: -20px;
    width: 60px;
    height: 60px;
    background: ${props => props.accent};
    filter: blur(40px);
    opacity: 0.2;
  }
`;

const StatIcon = styled.div`
  width: 54px;
  height: 54px;
  background: ${props => props.bg};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const StatInfo = styled.div`
  div {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.slate[500]};
    margin-bottom: 4px;
  }
  h3 {
    font-size: 32px;
    font-weight: 900;
    color: ${props => props.theme.colors.slate[900]};
    letter-spacing: -0.02em;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  ${props => props.theme.glassmorphism}
  border-radius: 28px;
  padding: 32px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;

  h2 {
    font-size: 20px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.2s;

  &:hover {
    background: white;
    transform: translateX(8px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
`;

const ShortcutGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ShortcutItem = styled(motion.button)`
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 22px;
  display: flex;
  align-items: center;
  gap: 18px;
  border: 1px solid ${props => props.theme.colors.slate[100]};
  transition: all 0.2s;
  cursor: pointer;

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: ${props => props.bg};
    color: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text {
    flex: 1;
    text-align: left;
    h4 { font-size: 15px; font-weight: 700; color: ${props => props.theme.colors.slate[800]}; margin-bottom: 2px; }
    p { font-size: 12px; color: ${props => props.theme.colors.slate[500]}; }
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.1);
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ students: 0, subjects: 0, enrollments: 0, avg: 85 });

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sub, e] = await Promise.all([
          studentsAPI.getAll(),
          subjectsAPI.getAll(),
          enrollmentsAPI.getAll()
        ]);
        setStats({
          students: s.length,
          subjects: sub.length,
          enrollments: e.length,
          avg: 88.4
        });
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long'
  }).format(now);

  const statCards = [
    { title: t('dashboard.totalStudents'), count: stats.students, icon: Users, color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)' },
    { title: t('dashboard.totalSubjects'), count: stats.subjects, icon: BookOpen, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: t('dashboard.activeEnrollments'), count: stats.enrollments, icon: GraduationCap, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
    { title: t('dashboard.averageGrade'), count: stats.avg + '%', icon: TrendingUp, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)' },
  ];

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', width: 'fit-content', fontSize: '13px' }}>
            <Sparkles size={14} />
            {formattedDate.toUpperCase()}
          </div>
          <h1>{t('dashboard.welcome')}, Administrador</h1>
          <p>Hoy es un gran día para seguir gestionando la excelencia académica de nuestros estudiantes.</p>
        </HeroContent>
        <QuickActionBtn
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/grade-management')}
        >
          <MousePointer2 size={18} />
          {t('nav.gradeManagement')}
        </QuickActionBtn>
      </HeroSection>

      <StatsGrid>
        {statCards.map((card, i) => (
          <StatCard key={i} accent={card.color} whileHover={{ y: -8 }}>
            <StatIcon color={card.color} bg={card.bg}><card.icon size={26} /></StatIcon>
            <StatInfo>
              <div>{card.title}</div>
              <h3>{card.count}</h3>
            </StatInfo>
          </StatCard>
        ))}
      </StatsGrid>

      <AnimatePresence>
        <MainContent>
          <Card>
            <CardHeader>
              <h2><Activity size={20} color="#6366F1" /> Actividad Reciente</h2>
              <button style={{ color: '#6366F1', fontWeight: '700', fontSize: '14px', background: 'none' }}>Ver Historial</button>
            </CardHeader>
            <ActivityList>
              {[
                { title: 'Nota Registrada', sub: 'Matemáticas - Juan Pérez', time: 'hace 4 min', color: '#6366F1', icon: Award },
                { title: 'Nuevo Alumno', sub: 'Inscrito en 2do Cuatrimestre', time: 'hace 1 hora', color: '#10B981', icon: UserCheck },
                { title: 'Reporte Generado', sub: 'Boletines finales Septiembre', time: 'hace 3 horas', color: '#F59E0B', icon: FileText },
                { title: 'Evento Próximo', sub: 'Examen de Física - Aula 4', time: 'Mañana', color: '#EC4899', icon: Calendar },
              ].map((item, i) => (
                <ActivityItem
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <StatIcon color={item.color} bg={`${item.color}15`} style={{ width: 44, height: 44 }}><item.icon size={20} /></StatIcon>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '2px' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>{item.sub}</p>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>{item.time}</div>
                </ActivityItem>
              ))}
            </ActivityList>
          </Card>

          <Card>
            <CardHeader>
              <h2><Zap size={20} color="#F59E0B" /> {t('common.quickAccess') || 'Accesos Rápidos'}</h2>
            </CardHeader>
            <ShortcutGrid>
              <ShortcutItem
                bg="#EEF2FF" color="#6366F1"
                whileHover={{ x: 5 }}
                onClick={() => navigate('/students')}
              >
                <div className="icon"><Users size={20} /></div>
                <div className="text">
                  <h4>{t('nav.students')}</h4>
                  <p>Gestionar registros</p>
                </div>
                <ChevronRight size={18} />
              </ShortcutItem>
              <ShortcutItem
                bg="#ECFDF5" color="#10B981"
                whileHover={{ x: 5 }}
                onClick={() => navigate('/subjects')}
              >
                <div className="icon"><BookOpen size={20} /></div>
                <div className="text">
                  <h4>{t('nav.subjects')}</h4>
                  <p>Ver currículo</p>
                </div>
                <ChevronRight size={18} />
              </ShortcutItem>
              <ShortcutItem
                bg="#FFFBEB" color="#F59E0B"
                whileHover={{ x: 5 }}
                onClick={() => navigate('/reports')}
              >
                <div className="icon"><FileText size={20} /></div>
                <div className="text">
                  <h4>{t('nav.reports')}</h4>
                  <p>Generar boletines</p>
                </div>
                <ChevronRight size={18} />
              </ShortcutItem>
            </ShortcutGrid>
          </Card>
        </MainContent>
      </AnimatePresence>
    </Container>
  );
};

export default Dashboard;

