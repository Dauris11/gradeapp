import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSelector from './LanguageSelector';

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
  max-width: 480px;
  padding: 40px;
  position: relative;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.border};
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

const SettingsModal = ({ isOpen, onClose }) => {
  const { themeMode, setTheme, theme } = useTheme();

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

  // Colores del tema actual
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
        <Header>
          <Title>⚙️ Configuración</Title>
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
          <SectionTitle>Idioma / Language / Lang</SectionTitle>
          <LanguageSelector />
        </Section>

        <Section>
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
