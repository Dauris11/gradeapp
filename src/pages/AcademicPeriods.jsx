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
  Power,
  ChevronRight,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { academicAPI } from '../services/database';
import { Toast, useToast } from '../components/Toast';

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
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.slate[500]};
  font-size: 15px;
`;

const AddButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 4px;
    background: ${props => props.$gradient};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.slate[500]};
  font-weight: 600;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
`;

const PeriodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const PeriodCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 2px solid ${props => props.$isActive ? props.theme.colors.primary.main : props.theme.colors.border};
  box-shadow: ${props => props.$isActive ? props.theme.shadows.lg : props.theme.shadows.sm};
  cursor: pointer;
  position: relative;
`;

const PeriodName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.slate[900]};
  margin-bottom: 4px;
`;

const PeriodCode = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.slate[500]};
  font-weight: 600;
  text-transform: uppercase;
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  background: ${props => props.$active ? '#dcfce7' : '#fef3c7'};
  color: ${props => props.$active ? '#10b981' : '#d97706'};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid ${props => props.variant === 'primary' ? 'transparent' : props.theme.colors.border};
  background: ${props => props.variant === 'primary' ? props.theme.colors.primary.main : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.slate[600]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white; border-radius: 24px; width: 100%; max-width: 600px;
  padding: 32px; max-height: 90vh; overflow-y: auto;
`;

const AcademicPeriods = () => {
  const { t } = useLanguage();
  const toast = useToast();
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [periodStats, setPeriodStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', year: new Date().getFullYear(), quarter: 1, startDate: '', endDate: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await academicAPI.getAllPeriods();
      setPeriods(data);
    } catch (e) { toast.error("Error al cargar períodos"); } finally { setLoading(false); }
  };

  const handleActivate = async (id) => {
    if (!confirm("¿Activar este período?")) return;
    try {
      await academicAPI.activatePeriod(id);
      toast.success("Período activado");
      loadData();
    } catch (e) { toast.error("Error al activar"); }
  };

  const handleViewDetails = async (period) => {
    setSelectedPeriod(period);
    setIsModalOpen(true);
    try {
      const stats = await academicAPI.getPeriodStats(period.id);
      setPeriodStats(stats);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await academicAPI.createPeriod(formData);
      toast.success("Período creado");
      setIsCreateModalOpen(false);
      loadData();
    } catch (e) { toast.error("Error al crear"); }
  };

  return (
    <Container>
      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
      <Header>
        <HeaderInfo>
          <Title>{t('periods.title')}</Title>
          <Subtitle>{t('periods.subtitle')}</Subtitle>
        </HeaderInfo>
        <AddButton whileHover={{ scale: 1.05 }} onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} /> {t('periods.newPeriod')}
        </AddButton>
      </Header>

      <StatsGrid>
        <StatCard $gradient="linear-gradient(to right, #6366f1, #818cf8)">
          <StatHeader>
            <StatLabel>Total Estudiantes</StatLabel>
            <StatIcon $bg="#e0e7ff" $color="#6366f1"><Users size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{periods.reduce((acc, p) => acc + (p.studentCount || 0), 0)}</StatValue>
        </StatCard>
        <StatCard $gradient="linear-gradient(to right, #10b981, #34d399)">
          <StatHeader>
            <StatLabel>Promedio General</StatLabel>
            <StatIcon $bg="#dcfce7" $color="#10b981"><TrendingUp size={20} /></StatIcon>
          </StatHeader>
          <StatValue>85.4%</StatValue>
        </StatCard>
      </StatsGrid>

      <PeriodsGrid>
        {periods.map(p => (
          <PeriodCard key={p.id} $isActive={p.isActive} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <PeriodCode>{p.code}</PeriodCode>
                <PeriodName>{p.name}</PeriodName>
              </div>
              <StatusBadge $active={p.isActive}>
                {p.isActive ? <CheckCircle size={14} /> : <Clock size={14} />}
                {p.isActive ? 'Activo' : 'Cerrado'}
              </StatusBadge>
            </div>
            <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748B' }}>
              📅 {new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}
            </div>
            <ActionButtons>
              <Button onClick={() => handleViewDetails(p)} variant="outline">Ver Detalles</Button>
              {!p.isActive && <Button onClick={() => handleActivate(p.id)} variant="primary">Activar</Button>}
            </ActionButtons>
          </PeriodCard>
        ))}
      </PeriodsGrid>

      <AnimatePresence>
        {isModalOpen && selectedPeriod && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <Title style={{ fontSize: '24px', margin: 0 }}>Detalles del Período</Title>
                <X size={24} onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
              </div>

              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 10px' }}>{selectedPeriod.name}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>Código: {selectedPeriod.code}</p>
              </div>

              {periodStats && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <StatLabel>Estudiantes Activos</StatLabel>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{periodStats.activeStudents}</div>
                  </div>
                  <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <StatLabel>Promedio Período</StatLabel>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{periodStats.averageGrade?.toFixed(1) || 0}%</div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '24px' }}>
                <Button style={{ width: '100%' }} variant="primary" onClick={() => (window.location.href = '#/student-history')}>
                  Ir a Historial Estudiantil
                </Button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        {isCreateModalOpen && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <Title style={{ fontSize: '24px' }}>Nuevo Período Académico</Title>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} placeholder="Nombre del período (Ej: Semestre 1 2026)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                <input style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} placeholder="Código (Ej: 2026-1)" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} required />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="date" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                  <input type="date" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} required />
                </div>
                <Button type="submit" variant="primary" style={{ padding: '14px' }}>Crear Período</Button>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AcademicPeriods;
