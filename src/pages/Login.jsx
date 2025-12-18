import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, GraduationCap, Eye, EyeOff, X, ArrowRight, ShieldCheck } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  background: ${props => props.theme.colors.slate[950]};
  font-family: ${props => props.theme.typography.fontFamily};
  overflow: hidden;
  position: relative;
`;

const BackgroundShape = styled(motion.div)`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradients.primary};
  filter: blur(120px);
  opacity: 0.2;
  z-index: 0;
`;

const LeftPanel = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const BrandBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.gradients.primary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.4);
`;

const BrandName = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.02em;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: white;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.04em;

  span {
    background: ${props => props.theme.colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: ${props => props.theme.colors.slate[400]};
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 48px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-5px);
  }

  h4 {
    color: white;
    margin-bottom: 8px;
    font-size: 16px;
  }

  p {
    color: ${props => props.theme.colors.slate[500]};
    font-size: 13px;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 1;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);

  @media (max-width: 1024px) {
    background: ${props => props.theme.colors.slate[950]};
  }
`;

const LoginBox = styled(motion.div)`
  width: 100%;
  max-width: 440px;
`;

const LoginHeader = styled.div`
  margin-bottom: 40px;
`;

const LoginTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
`;

const LoginSubtitle = styled.p`
  color: ${props => props.theme.colors.slate[400]};
  font-size: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.slate[300]};
  margin-left: 4px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 14px 16px 14px 44px;
  color: white;
  font-size: 15px;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${props => props.theme.colors.slate[600]};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    background: rgba(99, 102, 241, 0.05);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${props => props.theme.colors.slate[500]};
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.slate[500]};
  display: flex;
  padding: 4px;

  &:hover {
    color: white;
  }
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -8px;
`;

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.slate[400]};
  cursor: pointer;

  input {
    accent-color: ${props => props.theme.colors.primary.main};
  }
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary.main};
  
  &:hover {
    color: ${props => props.theme.colors.primary.light};
    text-decoration: underline;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.theme.colors.gradients.primary};
  color: white;
  border-radius: 14px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  margin-top: 8px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled(motion.div)`
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: #fb7185;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.slate[900]};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  max-width: 440px;
  width: 100%;
  position: relative;
`;

const CloseIconButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  color: ${props => props.theme.colors.slate[500]};
  background: rgba(255, 255, 255, 0.05);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await response.json();

      if (data.success) {
        setResetMessage(`✅ Enviado. Contraseña: ${data.password}`);
      } else {
        setResetMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setResetMessage('❌ Error de conexión');
    }
  };

  return (
    <Container>
      <BackgroundShape
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '-10%', left: '-10%' }}
      />

      <BackgroundShape
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '-10%', right: '-10%', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
      />

      <LeftPanel>
        <BrandBadge>
          <LogoIcon>
            <GraduationCap color="white" size={28} />
          </LogoIcon>
          <BrandName>GradePro</BrandName>
        </BrandBadge>

        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Gestiona el <span>Éxito Académico</span> con Inteligencia.
        </HeroTitle>

        <HeroSubtitle>
          La plataforma más avanzada para la gestión de calificaciones, reportes y comunicación institucional.
        </HeroSubtitle>

        <FeatureGrid>
          <FeatureCard>
            <h4>Automatización</h4>
            <p>Calcula promedios y genera reportes en segundos.</p>
          </FeatureCard>
          <FeatureCard>
            <h4>Comunicación</h4>
            <p>Envía notas vía WhatsApp y Email de forma masiva.</p>
          </FeatureCard>
          <FeatureCard>
            <h4>Seguridad</h4>
            <p>Tus datos protegidos con los estándares más altos.</p>
          </FeatureCard>
          <FeatureCard>
            <h4>Analítica</h4>
            <p>Visualiza el progreso de cada alumno gráficamente.</p>
          </FeatureCard>
        </FeatureGrid>
      </LeftPanel>

      <RightPanel>
        <LoginBox
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <LoginHeader>
            <LoginTitle>Bienvenido</LoginTitle>
            <LoginSubtitle>Introduce tus credenciales para acceder</LoginSubtitle>
          </LoginHeader>

          {error && (
            <ErrorMsg
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <ShieldCheck size={18} />
              {error}
            </ErrorMsg>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Usuario o Email</Label>
              <InputContainer>
                <InputIcon><User size={18} /></InputIcon>
                <StyledInput
                  type="text"
                  placeholder="admin"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </InputContainer>
            </FormGroup>

            <FormGroup>
              <Label>Contraseña</Label>
              <InputContainer>
                <InputIcon><Lock size={18} /></InputIcon>
                <StyledInput
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </PasswordToggle>
              </InputContainer>
            </FormGroup>

            <ActionRow>
              <RememberMe>
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                />
                Recordarme
              </RememberMe>
              <ForgotPasswordLink type="button" onClick={() => setShowResetModal(true)}>
                ¿Olvidaste tu contraseña?
              </ForgotPasswordLink>
            </ActionRow>

            <SubmitButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Validando...' : 'Entrar al Sistema'}
              {!loading && <ArrowRight size={18} />}
            </SubmitButton>
          </Form>
        </LoginBox>
      </RightPanel>

      <AnimatePresence>
        {showResetModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResetModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseIconButton onClick={() => setShowResetModal(false)}>
                <X size={18} />
              </CloseIconButton>

              <LoginHeader>
                <LoginTitle style={{ fontSize: '24px' }}>Recuperar</LoginTitle>
                <LoginSubtitle>Te enviaremos las instrucciones de acceso.</LoginSubtitle>
              </LoginHeader>

              <form onSubmit={handleResetPassword}>
                <FormGroup style={{ marginBottom: '24px' }}>
                  <Label>Email Institucional</Label>
                  <InputContainer>
                    <InputIcon><User size={18} /></InputIcon>
                    <StyledInput
                      type="email"
                      placeholder="ejemplo@escuela.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </InputContainer>
                </FormGroup>

                {resetMessage && (
                  <div style={{
                    marginBottom: '20px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#34d399',
                    fontSize: '14px'
                  }}>
                    {resetMessage}
                  </div>
                )}

                <SubmitButton type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Enviar Instrucciones
                </SubmitButton>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Login;

