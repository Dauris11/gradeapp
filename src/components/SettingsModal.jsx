import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Monitor, Save, Bell, Percent, ChevronRight, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../i18n/LanguageContext';
import { settingsAPI } from '../services/database';
import { Toast, useToast } from './Toast';

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 28px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px;
  position: relative;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 24px;
    border-radius: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${props => props.theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${props => props.theme.colors.slate[100]};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: ${props => props.theme.colors.text.secondary};

  &:hover {
    background: ${props => props.theme.colors.slate[200]};
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
`;

const ThemeOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ThemeOption = styled(motion.button)`
  padding: 20px;
  border-radius: 16px;
  border: 2px solid ${props => props.$active
    ? props.theme.colors.primary.main
    : props.theme.colors.border};
  background: ${props => props.$active
    ? props.theme.colors.primary.main + '10'
    : props.theme.colors.surface};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.$active
    ? props.theme.colors.gradients.primary
    : 'transparent'};
    opacity: ${props => props.$active ? 0.05 : 0};
    transition: opacity 0.2s;
  }
`;

const ThemeIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$active
    ? props.theme.colors.gradients.primary
    : props.theme.colors.slate[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$active
    ? 'white'
    : props.theme.colors.text.secondary};
  transition: all 0.2s;
`;

const ThemeLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$active
    ? props.theme.colors.primary.main
    : props.theme.colors.text.secondary};
  transition: color 0.2s;
`;

const ThemeDescription = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.text.muted};
  text-align: center;
  line-height: 1.4;
`;

const PreviewSection = styled.div`
  padding: 24px;
  border-radius: 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
`;

const PreviewTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
`;

const PreviewColors = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
`;

const ColorSwatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ColorSwatch = styled(motion.div)`
  aspect-ratio: 1;
  border-radius: 12px;
  background: ${props => props.$color};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%);
  }
`;

const ColorLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.muted};
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.main}20;
  }
`;

const Toggle = styled.button`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${props => props.$active ? props.theme.colors.primary.main : props.theme.colors.slate[300]};
  position: relative;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.$active ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s;
  }
`;

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${props => props.theme.colors.slate[50]};
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.slate[100]};
  }
`;

const MainButton = styled.button`
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  background: ${props => props.theme.colors.gradients.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SettingsModal = ({ isOpen, onClose }) => {
  const { themeMode, setTheme, theme } = useTheme();
  const { t } = useLanguage();
  const toast = useToast();

  const [loading, setLoading] = React.useState(false);
  const [gradingRanges, setGradingRanges] = React.useState([]);
  const [alertsEnabled, setAlertsEnabled] = React.useState(true);
  const [threshold, setThreshold] = React.useState(70);
  const [expanded, setExpanded] = React.useState(null);

  React.useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      const settings = await settingsAPI.getAll();
      if (settings.grading_ranges) setGradingRanges(settings.grading_ranges);
      if (settings.alerts_enabled !== undefined) setAlertsEnabled(settings.alerts_enabled);
      if (settings.low_score_threshold) setThreshold(settings.low_score_threshold);
    } catch (e) { console.error(e); }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await settingsAPI.updateBulk([
        { key: 'grading_ranges', value: gradingRanges },
        { key: 'alerts_enabled', value: alertsEnabled },
        { key: 'low_score_threshold', value: threshold }
      ]);
      toast.success('Configuraciones guardadas');
    } catch (e) {
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const themes = [
    {
      id: 'light',
      label: 'Claro',
      description: 'Diseño limpio y brillante',
      icon: Sun
    },
    {
      id: 'dark',
      label: 'Oscuro',
      description: 'Elegante con tonos morado y azul',
      icon: Moon
    }
  ];

  const previewColors = [
    { color: theme.colors.primary.main, label: 'Principal' },
    { color: theme.colors.secondary.main, label: 'Secundario' },
    { color: theme.colors.success.main, label: 'Éxito' },
    { color: theme.colors.warning.main, label: 'Alerta' },
    { color: theme.colors.danger.main, label: 'Peligro' },
  ];

  return (
    <Modal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
        <Header>
          <Title>⚙️ {t('settings.title')}</Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <Section>
          <SectionTitle>Apariencia</SectionTitle>
          <ThemeOptions>
            {themes.map(themeOption => {
              const Icon = themeOption.icon;
              const isActive = themeMode === themeOption.id;

              return (
                <ThemeOption
                  key={themeOption.id}
                  $active={isActive}
                  onClick={() => setTheme(themeOption.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ThemeIconWrapper $active={isActive}>
                    <Icon size={24} />
                  </ThemeIconWrapper>
                  <ThemeLabel $active={isActive}>
                    {themeOption.label}
                  </ThemeLabel>
                  <ThemeDescription>
                    {themeOption.description}
                  </ThemeDescription>
                </ThemeOption>
              );
            })}
          </ThemeOptions>
        </Section>

        <Section>
          <SectionTitle>{t('settings.language')}</SectionTitle>
          <LanguageSelector />
        </Section>

        <Section>
          <AccordionHeader onClick={() => setExpanded(expanded === 'grading' ? null : 'grading')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Percent size={20} color={theme.colors.primary.main} />
              <span style={{ fontWeight: '700' }}>Rango de Letras Personalizable</span>
            </div>
            {expanded === 'grading' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </AccordionHeader>

          {expanded === 'grading' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ padding: '0 8px', overflow: 'hidden' }}>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>Define los límites para la conversión de notas numéricas a letras.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {gradingRanges.map((range, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                    <Input value={range.letter} onChange={e => {
                      const newRanges = [...gradingRanges];
                      newRanges[idx].letter = e.target.value.toUpperCase();
                      setGradingRanges(newRanges);
                    }} style={{ fontWeight: 'bold', textAlign: 'center' }} />
                    <Input type="number" value={range.min} onChange={e => {
                      const newRanges = [...gradingRanges];
                      newRanges[idx].min = parseFloat(e.target.value);
                      setGradingRanges(newRanges);
                    }} placeholder="Mín" />
                    <Input type="number" value={range.max} onChange={e => {
                      const newRanges = [...gradingRanges];
                      newRanges[idx].max = parseFloat(e.target.value);
                      setGradingRanges(newRanges);
                    }} placeholder="Máx" />
                    <Input value={range.description} onChange={e => {
                      const newRanges = [...gradingRanges];
                      newRanges[idx].description = e.target.value;
                      setGradingRanges(newRanges);
                    }} placeholder="Descripción" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </Section>

        <Section>
          <AccordionHeader onClick={() => setExpanded(expanded === 'alerts' ? null : 'alerts')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={20} color={theme.colors.warning.main} />
              <span style={{ fontWeight: '700' }}>Alertas de Rendimiento</span>
            </div>
            {expanded === 'alerts' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </AccordionHeader>

          {expanded === 'alerts' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ padding: '16px 8px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontWeight: '600', display: 'block' }}>Habilitar Alertas Automáticas</span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Envía WhatsApp/Email si la nota es baja.</span>
                </div>
                <Toggle $active={alertsEnabled} onClick={() => setAlertsEnabled(!alertsEnabled)} />
              </div>

              <div style={{ display: alertsEnabled ? 'block' : 'none' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '8px' }}>Umbral de Alerta (Menor que X)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} style={{ width: '80px' }} />
                  <span style={{ fontSize: '13px', color: '#64748B' }}>Puntos (Ej: Alerta si saca menos de 70)</span>
                </div>
              </div>
            </motion.div>
          )}
        </Section>

        <MainButton
          fullWidth
          onClick={handleSaveSettings}
          disabled={loading}
          style={{ marginTop: '20px', borderRadius: '16px' }}
        >
          {loading ? 'Guardando...' : <><Save size={18} /> Guardar Configuraciones Avanzadas</>}
        </MainButton>

        <Section style={{ marginTop: '40px' }}>
          <PreviewSection>
            <PreviewTitle>Paleta de Colores Actual</PreviewTitle>
            <PreviewColors>
              {previewColors.map((item, index) => (
                <ColorSwatchContainer key={index}>
                  <ColorSwatch
                    $color={item.color}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  />
                  <ColorLabel>{item.label}</ColorLabel>
                </ColorSwatchContainer>
              ))}
            </PreviewColors>
          </PreviewSection>
        </Section>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
