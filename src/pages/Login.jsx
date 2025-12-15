import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, GraduationCap, Eye, EyeOff, X } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  background: ${props => props.theme.colors.slate[50]};
  font-family: ${props => props.theme.typography.fontFamily};
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing['2xl']};
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Pattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(30deg, rgba(255, 255, 255, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.05) 87.5%, rgba(255, 255, 255, 0.05)),
    linear-gradient(150deg, rgba(255, 255, 255, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.05) 87.5%, rgba(255, 255, 255, 0.05)),
    linear-gradient(30deg, rgba(255, 255, 255, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.05) 87.5%, rgba(255, 255, 255, 0.05)),
    linear-gradient(150deg, rgba(255, 255, 255, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.05) 87.5%, rgba(255, 255, 255, 0.05));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px;
`;

const BrandSection = styled(motion.div)`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 500px;
`;

const LogoContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto ${props => props.theme.spacing.xl};
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: ${props => props.theme.spacing.lg};
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const BrandTitle = styled.h1`
  font-size: 3rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: white;
  margin-bottom: ${props => props.theme.spacing.md};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BrandSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

const FeatureList = styled.div`
  margin-top: ${props => props.theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  color: white;
  font-size: ${props => props.theme.typography.fontSize.base};
`;

const FeatureIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing['2xl']};
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const LoginCard = styled(motion.div)`
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: ${props => props.theme.spacing['2xl']};
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.slate[200]};
`;

const WelcomeText = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const WelcomeSubtext = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[500]};
`;

const FormContainer = styled.div`
  padding: ${props => props.theme.spacing['2xl']};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.slate[700]};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.slate[400]};
  pointer-events: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.slate[400]};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${props => props.theme.colors.slate[600]};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  padding-left: 3rem;
  padding-right: ${props => props.type === 'password' ? '3rem' : props.theme.spacing.md};
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  color: ${props => props.theme.colors.slate[800]};
  font-size: ${props => props.theme.typography.fontSize.base};
  outline: none;
  transition: all ${props => props.theme.transitions.base};

  &::placeholder {
    color: ${props => props.theme.colors.slate[400]};
  }

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const RememberSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[600]};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

const ForgotLink = styled.a`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.primary.main};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.theme.colors.gradients.blue};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  margin-top: ${props => props.theme.spacing.md};
`;

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  display: flex;
  
  &:hover {
    color: #1e293b;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
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
        setError(data.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
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
        setResetMessage(`✅ ${data.message}. Tu contraseña es: ${data.password}`);
      } else {
        setResetMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setResetMessage('❌ Error al conectar con el servidor');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  return (
    <Container>
      <LeftPanel>
        <Pattern />
        <BrandSection
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LogoContainer>
            <LogoImage src="/imagenes/logo-principal.png" alt="GradeApp Logo" />
          </LogoContainer>
          <BrandTitle>GradeApp</BrandTitle>
          <BrandSubtitle>
            Sistema integral de gestión académica para instituciones educativas modernas
          </BrandSubtitle>

          <FeatureList>
            <FeatureItem>
              <FeatureIcon>
                <GraduationCap size={20} />
              </FeatureIcon>
              <span>Gestión completa de estudiantes y materias</span>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>
                <GraduationCap size={20} />
              </FeatureIcon>
              <span>Sistema de calificaciones automatizado</span>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>
                <GraduationCap size={20} />
              </FeatureIcon>
              <span>Reportes y análisis en tiempo real</span>
            </FeatureItem>
          </FeatureList>
        </BrandSection>
      </LeftPanel>

      <RightPanel>
        <LoginCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardHeader>
            <WelcomeText>Iniciar Sesión</WelcomeText>
            <WelcomeSubtext>Ingresa tus credenciales para continuar</WelcomeSubtext>
          </CardHeader>

          <FormContainer>
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label htmlFor="username">Usuario</Label>
                <InputWrapper>
                  <Icon>
                    <User size={20} />
                  </Icon>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="password">Contraseña</Label>
                <InputWrapper>
                  <Icon>
                    <Lock size={20} />
                  </Icon>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </PasswordToggle>
                </InputWrapper>
              </InputGroup>

              {error && (
                <div style={{
                  padding: '12px',
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  color: '#DC2626',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              <RememberSection>
                <CheckboxLabel>
                  <Checkbox
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  Recordarme
                </CheckboxLabel>
                <ForgotLink onClick={() => setShowResetModal(true)}>
                  ¿Olvidaste tu contraseña?
                </ForgotLink>
              </RememberSection>

              <LoginButton
                type="submit"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                <LogIn size={20} />
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </LoginButton>
            </Form>
          </FormContainer>
        </LoginCard>
      </RightPanel>

      {showResetModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowResetModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Recuperar Contraseña</ModalTitle>
              <CloseButton onClick={() => setShowResetModal(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleResetPassword}>
              <InputGroup>
                <Label htmlFor="resetEmail">Email</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  placeholder="tu@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  style={{ paddingLeft: '12px' }}
                />
              </InputGroup>

              {resetMessage && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: resetMessage.includes('✅') ? '#D1FAE5' : '#FEE2E2',
                  border: `1px solid ${resetMessage.includes('✅') ? '#6EE7B7' : '#FCA5A5'}`,
                  borderRadius: '8px',
                  color: resetMessage.includes('✅') ? '#065F46' : '#DC2626',
                  fontSize: '14px'
                }}>
                  {resetMessage}
                </div>
              )}

              <LoginButton
                type="submit"
                style={{ marginTop: '20px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Recuperar Contraseña
              </LoginButton>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Login;
