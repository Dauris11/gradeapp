import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usersAPI } from '../services/usersAPI';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${props => props.theme.spacing.md};
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows['2xl']};
  padding: ${props => props.theme.spacing['2xl']};
  max-width: 450px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[900]};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.slate[600]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[700]};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const PasswordInputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.slate[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.base};
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.slate[400]};
  padding: 0;
  display: flex;
  align-items: center;
`;

const Button = styled(motion.button)`
  padding: ${props => props.theme.spacing.md};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Alert = styled(motion.div)`
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
  background: ${props => props.$type === 'success'
        ? 'rgba(16, 185, 129, 0.1)'
        : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$type === 'success'
        ? props.theme.colors.success.main
        : props.theme.colors.danger.main};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [message, setMessage] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            verifyToken();
        } else {
            setValidating(false);
            setMessage({
                type: 'error',
                text: 'Token no proporcionado'
            });
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            const response = await usersAPI.verifyResetToken(token);

            if (response.valid) {
                setTokenValid(true);
                setUser(response.user);
            } else {
                setMessage({
                    type: 'error',
                    text: response.message || 'Token inválido o expirado'
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Error al verificar el token'
            });
        } finally {
            setValidating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({
                type: 'error',
                text: 'Las contraseñas no coinciden'
            });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({
                type: 'error',
                text: 'La contraseña debe tener al menos 6 caracteres'
            });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await usersAPI.resetPasswordWithToken(token, newPassword);

            if (response.success) {
                setMessage({
                    type: 'success',
                    text: 'Contraseña restablecida exitosamente. Redirigiendo al login...'
                });

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.error || 'Error al restablecer la contraseña'
            });
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <Container>
                <Card
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <Header>
                        <Logo>
                            <Lock size={40} />
                        </Logo>
                        <Title>Verificando...</Title>
                        <Subtitle>Por favor espera</Subtitle>
                    </Header>
                </Card>
            </Container>
        );
    }

    if (!tokenValid) {
        return (
            <Container>
                <Card
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <Header>
                        <Logo>
                            <AlertCircle size={40} />
                        </Logo>
                        <Title>Token Inválido</Title>
                        <Subtitle>El enlace de recuperación no es válido o ha expirado</Subtitle>
                    </Header>

                    {message && (
                        <Alert $type="error">
                            <AlertCircle size={20} />
                            <div>{message.text}</div>
                        </Alert>
                    )}

                    <Button
                        onClick={() => navigate('/')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Volver al Login
                    </Button>
                </Card>
            </Container>
        );
    }

    return (
        <Container>
            <Card
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Header>
                    <Logo>
                        <Lock size={40} />
                    </Logo>
                    <Title>Nueva Contraseña</Title>
                    <Subtitle>
                        {user && `Hola ${user.username}, ingresa tu nueva contraseña`}
                    </Subtitle>
                </Header>

                {message && (
                    <Alert
                        $type={message.type}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                        <div>{message.text}</div>
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Nueva Contraseña</Label>
                        <PasswordInputWrapper>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <PasswordToggle
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </PasswordToggle>
                        </PasswordInputWrapper>
                    </FormGroup>

                    <FormGroup>
                        <Label>Confirmar Contraseña</Label>
                        <PasswordInputWrapper>
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <PasswordToggle
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </PasswordToggle>
                        </PasswordInputWrapper>
                    </FormGroup>

                    <Button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default ResetPassword;
