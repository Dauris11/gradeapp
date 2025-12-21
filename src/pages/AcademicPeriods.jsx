import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Plus,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
  X,
  Edit2,
  Power
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

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

const HeaderInfo = styled.div``;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.base};
`;

const AddButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${props => props.theme.shadows.lg};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$gradient};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.$positive ? props.theme.colors.success.main : props.theme.colors.error.main};
  margin-top: ${props => props.theme.spacing.sm};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const PeriodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const PeriodCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.xl};
  border: 2px solid ${props => props.$isActive
    ? props.theme.colors.primary.main
    : props.theme.colors.border};
  box-shadow: ${props => props.$isActive
    ? props.theme.shadows.xl
    : props.theme.shadows.md};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.$isActive
    ? props.theme.colors.gradients.primary
    : 'transparent'};
    opacity: ${props => props.$isActive ? 0.05 : 0};
  }
`;

const PeriodHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const PeriodInfo = styled.div`
  flex: 1;
`;

const PeriodName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const PeriodCode = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.muted};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.$active ? props.theme.colors.success.main + '20' : props.theme.colors.warning.main + '20'};
  color: ${props => props.$active ? props.theme.colors.success.main : props.theme.colors.warning.main};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PeriodBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const DateInfo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.md};
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const DateItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Value = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.sm};
  padding-top: ${props => props.theme.spacing.sm};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 10px 16px;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;

  ${props => props.variant === 'primary' && `
    background: ${props.theme.colors.primary.main};
    color: white;
    border: 1px solid ${props.theme.colors.primary.main};
    &:hover {
      background: ${props.theme.colors.primary.dark};
      border-color: ${props.theme.colors.primary.dark};
    }
  `}

  ${props => props.variant === 'outline' && `
    background: transparent;
    color: ${props.theme.colors.text.secondary};
    border: 1px solid ${props.theme.colors.border};
    &:hover {
      border-color: ${props.theme.colors.primary.main};
      color: ${props.theme.colors.primary.main};
      background: ${props.theme.colors.primary.main}10;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: 60px 40px;
  text-align: center;
  border: 2px dashed ${props => props.theme.colors.border};

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
    margin-bottom: ${props => props.theme.spacing.lg};
  }
`;

const AcademicPeriods = () => {
  const { t } = useLanguage();
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeStudents: 0,
    averageGrade: 0,
    totalCourses: 0,
    completionRate: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargar períodos
      const periodsRes = await fetch('http://localhost:3001/api/academic/periods');
      const periodsData = await periodsRes.json();
      const validPeriods = Array.isArray(periodsData) ? periodsData : [];
      setPeriods(validPeriods);

      // Simular estadísticas para visualización
      setStats({
        activeStudents: 1250,
        averageGrade: 88.5,
        totalCourses: 42,
        completionRate: 94
      });

      setLoading(false);
    } catch (error) {
      console.error(t('common.error'), error);
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    if (!confirm(t('periods.confirmActivate'))) return;

    try {
      await fetch(`http://localhost:3001/api/academic/periods/${id}/activate`, {
        method: 'POST'
      });
      loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreatePeriod = () => {
    alert(t('common.comingSoon'));
  };

  const handleViewDetails = (period) => {
    if (!period) return;

    const details = `
${t('periods.periodDetails')}:
------------------------------------------------
${t('periods.name')}: ${period.name}
${t('periods.code')}: ${period.code}
${t('periods.status')}: ${period.isActive ? t('periods.active') : t('periods.inactive')}
${t('periods.startDate')}: ${period.startDate}
${t('periods.endDate')}: ${period.endDate}
        `;
    alert(details);
  };

  return (
    <Container>
      <Header>
        <HeaderInfo>
          <Title>{t('periods.title')}</Title>
          <Subtitle>{t('periods.subtitle')}</Subtitle>
        </HeaderInfo>
        <AddButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreatePeriod}
        >
          <Plus size={20} />
          {t('periods.newPeriod')}
        </AddButton>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          $gradient="linear-gradient(to right, #6366f1, #818cf8)"
        >
          <StatHeader>
            <StatLabel>{t('periods.activeStudents')}</StatLabel>
            <StatIcon $bg="rgba(99, 102, 241, 0.1)" $color="#6366f1">
              <Users size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.activeStudents}</StatValue>
          <StatTrend $positive>
            <TrendingUp size={14} />
            +12% vs {t('periods.lastPeriod')}
          </StatTrend>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          $gradient="linear-gradient(to right, #10b981, #34d399)"
        >
          <StatHeader>
            <StatLabel>{t('periods.averageGrade')}</StatLabel>
            <StatIcon $bg="rgba(16, 185, 129, 0.1)" $color="#10b981">
              <BarChart3 size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.averageGrade}%</StatValue>
          <StatTrend $positive>
            <TrendingUp size={14} />
            +2.4% vs {t('periods.lastPeriod')}
          </StatTrend>
        </StatCard>
      </StatsGrid>

      <PeriodsGrid>
        {periods.map((period, index) => (
          <PeriodCard
            key={period.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            $isActive={period.isActive}
          >
            <PeriodHeader $isActive={period.isActive}>
              <div>
                <PeriodCode>{period.code}</PeriodCode>
                <PeriodName>{period.name}</PeriodName>
              </div>
              <StatusBadge $active={period.isActive}>
                {period.isActive ? <CheckCircle size={14} /> : <Clock size={14} />}
                {period.isActive ? t('periods.active') : t('periods.inactive')}
              </StatusBadge>
            </PeriodHeader>

            <PeriodBody>
              <DateInfo>
                <DateItem>
                  <Label>{t('periods.startDate')}</Label>
                  <Value>{new Date(period.startDate).toLocaleDateString()}</Value>
                </DateItem>
                <DateItem>
                  <Label>{t('periods.endDate')}</Label>
                  <Value>{new Date(period.endDate).toLocaleDateString()}</Value>
                </DateItem>
              </DateInfo>

              <ActionButtons>
                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(period)}
                >
                  {t('periods.viewDetails')}
                </Button>
                {!period.isActive && (
                  <Button
                    variant="primary"
                    onClick={() => handleActivate(period.id)}
                  >
                    {t('periods.activate')}
                  </Button>
                )}
              </ActionButtons>
            </PeriodBody>
          </PeriodCard>
        ))}
      </PeriodsGrid>
    </Container>
  );
};

export default AcademicPeriods;
