import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { languageNames, languageFlags } from '../i18n/translations';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const LanguageOption = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.$isSelected
        ? props.theme.colors.primary.main
        : props.theme.colors.border};
  background: ${props => props.$isSelected
        ? props.theme.colors.primary.main + '10'
        : props.theme.colors.surface};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    transform: translateX(4px);
  }
`;

const FlagIcon = styled.div`
  font-size: 32px;
  line-height: 1;
`;

const LanguageInfo = styled.div`
  flex: 1;
  text-align: left;
`;

const LanguageName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const LanguageCode = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.muted};
  text-transform: uppercase;
`;

const CheckIcon = styled.div`
  color: ${props => props.theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LanguageSelector = () => {
    const { language, changeLanguage } = useLanguage();

    const languages = [
        { code: 'es', name: languageNames.es, flag: languageFlags.es },
        { code: 'en', name: languageNames.en, flag: languageFlags.en },
        { code: 'ht', name: languageNames.ht, flag: languageFlags.ht }
    ];

    return (
        <Container>
            {languages.map((lang, index) => (
                <LanguageOption
                    key={lang.code}
                    $isSelected={language === lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <FlagIcon>{lang.flag}</FlagIcon>
                    <LanguageInfo>
                        <LanguageName>{lang.name}</LanguageName>
                        <LanguageCode>{lang.code}</LanguageCode>
                    </LanguageInfo>
                    {language === lang.code && (
                        <CheckIcon>
                            <Check size={24} />
                        </CheckIcon>
                    )}
                </LanguageOption>
            ))}
        </Container>
    );
};

export default LanguageSelector;
