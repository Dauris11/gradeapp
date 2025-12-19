import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Bell, Calendar, BookOpen, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Widget = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.xl};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const WidgetTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UnreadBadge = styled.div`
  padding: 2px 8px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.danger.main};
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  min-width: 20px;
  text-align: center;
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }
`;

const NotificationCard = styled(motion.div)`
  background: ${props => props.$isRead
        ? props.theme.colors.background
        : props.theme.colors.primary.main + '10'};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  border-left: 3px solid ${props => {
        switch (props.$type) {
            case 'class': return props.theme.colors.primary.main;
            case 'success': return props.theme.colors.success.main;
            case 'warning': return props.theme.colors.warning.main;
            case 'error': return props.theme.colors.danger.main;
            default: return props.theme.colors.info.main;
        }
    }};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: 4px;
`;

const NotificationIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => {
        switch (props.$type) {
            case 'class': return props.theme.colors.primary.main + '20';
            case 'success': return props.theme.colors.success.main + '20';
            case 'warning': return props.theme.colors.warning.main + '20';
            case 'error': return props.theme.colors.danger.main + '20';
            default: return props.theme.colors.info.main + '20';
        }
    }};
  color: ${props => {
        switch (props.$type) {
            case 'class': return props.theme.colors.primary.main;
            case 'success': return props.theme.colors.success.main;
            case 'warning': return props.theme.colors.warning.main;
            case 'error': return props.theme.colors.danger.main;
            default: return props.theme.colors.info.main;
        }
    }};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 2px;
`;

const NotificationMessage = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.4;
`;

const NotificationTime = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.muted};
  margin-top: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl} 0;
  color: ${props => props.theme.colors.text.muted};
  
  svg {
    margin: 0 auto ${props => props.theme.spacing.md};
    opacity: 0.5;
  }
`;

const NotificationsWidget = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.id) {
            loadNotifications();
        }
    }, [user]);

    const loadNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/calendar/notifications/${user.id}`);
            const data = await response.json();
            setNotifications(data.slice(0, 10)); // Mostrar solo las últimas 10
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            try {
                await fetch(`http://localhost:3001/api/calendar/notifications/${notification.id}/read`, {
                    method: 'PUT'
                });
                loadNotifications();
            } catch (error) {
                console.error('Error marcando notificación:', error);
            }
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'class': return <Calendar size={16} />;
            case 'success': return <CheckCircle size={16} />;
            case 'warning': return <AlertCircle size={16} />;
            case 'error': return <AlertCircle size={16} />;
            default: return <Info size={16} />;
        }
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return date.toLocaleDateString('es-ES');
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <Widget
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            <WidgetHeader>
                <WidgetTitle>
                    <Bell size={20} />
                    Notificaciones
                </WidgetTitle>
                {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
            </WidgetHeader>

            {loading ? (
                <EmptyState>
                    <Bell size={48} />
                    <p>Cargando notificaciones...</p>
                </EmptyState>
            ) : notifications.length > 0 ? (
                <NotificationsList>
                    {notifications.map((notification, index) => (
                        <NotificationCard
                            key={notification.id}
                            $type={notification.type}
                            $isRead={notification.isRead}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <NotificationHeader>
                                <NotificationIcon $type={notification.type}>
                                    {getNotificationIcon(notification.type)}
                                </NotificationIcon>
                                <NotificationContent>
                                    <NotificationTitle>{notification.title}</NotificationTitle>
                                    <NotificationMessage>{notification.message}</NotificationMessage>
                                    <NotificationTime>{getTimeAgo(notification.createdAt)}</NotificationTime>
                                </NotificationContent>
                            </NotificationHeader>
                        </NotificationCard>
                    ))}
                </NotificationsList>
            ) : (
                <EmptyState>
                    <Bell size={48} />
                    <p>No tienes notificaciones</p>
                </EmptyState>
            )}
        </Widget>
    );
};

export default NotificationsWidget;
