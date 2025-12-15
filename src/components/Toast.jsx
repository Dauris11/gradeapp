import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  max-width: 400px;
`;

const ToastItem = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xl};
  border-left: 4px solid ${props => props.color};
  padding: ${props => props.theme.spacing.md};
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
  min-width: 300px;
  max-width: 400px;
`;

const IconWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.bgColor};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    color: ${props => props.color};
  }
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Message = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[600]};
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.slate[400]};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    color: ${props => props.theme.colors.slate[600]};
  }
`;

const toastConfig = {
    success: {
        icon: CheckCircle,
        color: '#22C55E',
        bgColor: 'rgba(34, 197, 94, 0.1)',
        title: 'Éxito'
    },
    error: {
        icon: XCircle,
        color: '#EF4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        title: 'Error'
    },
    warning: {
        icon: AlertCircle,
        color: '#F97316',
        bgColor: 'rgba(249, 115, 22, 0.1)',
        title: 'Advertencia'
    },
    info: {
        icon: Info,
        color: '#3B82F6',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        title: 'Información'
    }
};

export const Toast = ({ toasts, removeToast }) => {
    return (
        <ToastContainer>
            <AnimatePresence>
                {toasts.map(toast => {
                    const config = toastConfig[toast.type] || toastConfig.info;
                    const Icon = config.icon;

                    return (
                        <ToastItem
                            key={toast.id}
                            color={config.color}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <IconWrapper color={config.color} bgColor={config.bgColor}>
                                <Icon size={20} />
                            </IconWrapper>
                            <Content>
                                <Title>{toast.title || config.title}</Title>
                                <Message>{toast.message}</Message>
                            </Content>
                            <CloseButton onClick={() => removeToast(toast.id)}>
                                <X size={18} />
                            </CloseButton>
                        </ToastItem>
                    );
                })}
            </AnimatePresence>
        </ToastContainer>
    );
};

// Hook personalizado para usar toasts
export const useToast = () => {
    const [toasts, setToasts] = React.useState([]);

    const addToast = React.useCallback((type, message, title = null, duration = 4000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, type, message, title };

        setToasts(prev => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = React.useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = React.useCallback((message, title = null) => {
        return addToast('success', message, title);
    }, [addToast]);

    const error = React.useCallback((message, title = null) => {
        return addToast('error', message, title);
    }, [addToast]);

    const warning = React.useCallback((message, title = null) => {
        return addToast('warning', message, title);
    }, [addToast]);

    const info = React.useCallback((message, title = null) => {
        return addToast('info', message, title);
    }, [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info
    };
};

export default Toast;
