import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { Lock } from 'lucide-react';

const AccessDenied = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px;
`;

const Icon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: white;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.slate[600]};
  max-width: 400px;
`;

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, hasPermission } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && !hasPermission(requiredRole)) {
        return (
            <AccessDenied>
                <Icon>
                    <Lock size={40} />
                </Icon>
                <Title>Acceso Denegado</Title>
                <Message>
                    No tienes permisos suficientes para acceder a esta sección.
                    Contacta al administrador si necesitas acceso.
                </Message>
            </AccessDenied>
        );
    }

    return children;
};

export default ProtectedRoute;
