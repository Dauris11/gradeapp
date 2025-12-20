import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, GraduationCap, Eye, EyeOff, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: ${props => props.theme.typography.fontFamily};
  overflow: hidden;
  position: relative;
`;

const LeftPanel = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
  background: white;
  position: relative;

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const BrandName = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
  letter-spacing: -0.02em;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  color: ${props => props.theme.colors.slate[900]};
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.04em;

  span {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: ${props => props.theme.colors.slate[600]};
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 48px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: 20px;
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  }

  h4 {
    color: ${props => props.theme.colors.slate[900]};
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 600;
  }

  p {
    color: ${props => props.theme.colors.slate[600]};
    font-size: 13px;
    line-height: 1.5;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;

  @media (max-width: 1024px) {
    background: white;
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
  color: ${props => props.theme.colors.slate[900]};
  margin-bottom: 12px;
  letter-spacing: -0.02em;
`;

const LoginSubtitle = styled.p`
  color: ${props => props.theme.colors.slate[600]};
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
  color: ${props => props.theme.colors.slate[700]};
  margin-left: 4px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  background: white;
  border: 2px solid ${props => props.theme.colors.slate[200]};
  border-radius: 14px;
  padding: 14px 16px 14px 44px;
  color: ${props => props.theme.colors.slate[900]};
  font-size: 15px;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${props => props.theme.colors.slate[400]};
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${props => props.theme.colors.slate[400]};
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.slate[500]};
  display: flex;
  padding: 4px;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.slate[700]};
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
  color: ${props => props.theme.colors.slate[600]};
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    accent-color: #667eea;
    cursor: pointer;
  }
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
  cursor: pointer;
  
  &:hover {
    color: #764ba2;
    text-decoration: underline;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 14px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
  margin-top: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled(motion.div)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        login(data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Error de conexión: ${err.message || 'Sin respuesta del servidor'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LeftPanel>
        <BrandBadge>
          <LogoIcon>
            <GraduationCap size={28} color="white" />
          </LogoIcon>
          <BrandName>GradePro</BrandName>
        </BrandBadge>

        <HeroTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Gestión Académica <span>Moderna</span>
        </HeroTitle>

        <HeroSubtitle>
          Sistema completo para administrar calificaciones, estudiantes y reportes de manera eficiente.
        </HeroSubtitle>

        <FeatureGrid>
          <FeatureCard>
            <h4>📊 Control Total</h4>
            <p>Gestiona calificaciones y promedios en tiempo real.</p>
          </FeatureCard>
          <FeatureCard>
            <h4>👥 Estudiantes</h4>
            <p>Administra información completa de cada alumno.</p>
          </FeatureCard>
          <FeatureCard>
            <h4>📱 Reportes</h4>
            <p>Genera y envía reportes por email y WhatsApp.</p>
          </FeatureCard>
          <FeatureCard>
            <h4>📈 Analítica</h4>
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
              {error}
            </ErrorMsg>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Usuario</Label>
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
              <ForgotPasswordLink type="button">
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
    </Container>
  );
};

export default Login;
