import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const Input = styled.input`
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

const BackButton = styled(motion.button)`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.slate[100]};
  color: ${props => props.theme.colors.slate[700]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
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

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [resetUrl, setResetUrl] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setResetUrl(null);

        try {
            const response = await usersAPI.requestPasswordReset(email);

            if (response.success) {
                setMessage({
                    type: 'success',
                    text: response.message
                });

                // En desarrollo, mostrar el enlace
                if (response.resetUrl) {
                    setResetUrl(response.resetUrl);
                }
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Error al procesar la solicitud'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Card
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Header>
                    <Logo>
                        <Mail size={40} />
                    </Logo>
                    <Title>Recuperar Contraseña</Title>
                    <Subtitle>
                        Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña
                    </Subtitle>
                </Header>

                {message && (
                    <Alert
                        $type={message.type}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                        <div>
                            <div>{message.text}</div>
                            {resetUrl && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                    <strong>Enlace de recuperación (solo desarrollo):</strong><br />
                                    <a href={resetUrl} style={{ color: 'inherit', wordBreak: 'break-all' }}>
                                        {resetUrl}
                                    </a>
                                </div>
                            )}
                        </div>
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                        />
                    </FormGroup>

                    <Button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                    </Button>

                    <BackButton
                        type="button"
                        onClick={() => navigate('/')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <ArrowLeft size={20} />
                        Volver al Login
                    </BackButton>
                </Form>
            </Card>
        </Container>
    );
};

export default ForgotPassword;
