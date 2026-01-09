import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Shield, Copyright, User, ExternalLink, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
`;

const HeroCard = styled(motion.div)`
  ${props => props.theme.glassmorphism}
  width: 100%;
  padding: 60px;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);

  @media (max-width: 600px) {
    padding: 30px 20px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Logo = styled.img`
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Divider = styled.div`
  width: 2px;
  height: 60px;
  background: ${props => props.theme.colors.slate[200]};

  @media (max-width: 600px) {
    width: 60px;
    height: 2px;
  }
`;

const AppTitle = styled.h1`
  font-size: 48px;
  font-weight: 900;
  background: ${props => props.theme.colors.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  letter-spacing: -0.05em;
`;

const VersionTag = styled.span`
  background: ${props => props.theme.colors.slate[100]};
  color: ${props => props.theme.colors.slate[600]};
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 32px;
`;

const ExclusivityText = styled.p`
  font-size: 18px;
  color: ${props => props.theme.colors.primary.main};
  font-weight: 700;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 48px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 24px;
  text-align: left;
  border: 1px solid ${props => props.theme.colors.slate[100]};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.primary.main};
  
  h3 {
    font-size: 18px;
    font-weight: 800;
    color: ${props => props.theme.colors.slate[800]};
  }
`;

const DeveloperName = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
  margin-bottom: 8px;
`;

const LegalText = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.slate[500]};
  line-height: 1.7;
`;

const FooterLogos = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 40px;
  opacity: 0.6;
`;

const About = () => {
    const { t } = useLanguage();

    return (
        <Container>
            <HeroCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <LogoContainer>
                    <Logo src="/imagenes/ge-logo.png" alt="Global Effect" />
                    <Divider />
                    <Logo src="/imagenes/Imagen2.png" alt="Institutional Logo" />
                </LogoContainer>

                <AppTitle>GradePro</AppTitle>
                <VersionTag>{t('about.version')}</VersionTag>

                <ExclusivityText>
                    <Globe size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    {t('about.exclusivity')}
                </ExclusivityText>

                <InfoGrid>
                    <InfoCard>
                        <CardHeader>
                            <User size={20} />
                            <h3>{t('about.creator')}</h3>
                        </CardHeader>
                        <DeveloperName>{t('about.developer')}</DeveloperName>
                        <LegalText>
                            Software Architect & Lead Developer
                        </LegalText>
                    </InfoCard>

                    <InfoCard>
                        <CardHeader>
                            <Shield size={20} />
                            <h3>{t('about.legalTitle')}</h3>
                        </CardHeader>
                        <LegalText>
                            {t('about.legalText')}
                        </LegalText>
                    </InfoCard>
                </InfoGrid>

                <div style={{ marginTop: '48px', color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Copyright size={14} />
                    {new Date().getFullYear()} {t('about.developer')}. All rights reserved.
                </div>
            </HeroCard>
        </Container>
    );
};

export default About;
