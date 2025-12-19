import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Bell } from 'lucide-react';

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

const TodayBadge = styled.div`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.primary.main}20;
  color: ${props => props.theme.colors.primary.main};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ClassesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ClassCard = styled(motion.div)`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  border-left: 4px solid ${props => props.$color || props.theme.colors.primary.main};
  display: flex;
  gap: ${props => props.theme.spacing.md};
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const ClassTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.$color || props.theme.colors.primary.main}20;
  border-radius: ${props => props.theme.borderRadius.md};
`;

const TimeText = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  line-height: 1;
`;

const AmPm = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.muted};
  text-transform: uppercase;
`;

const ClassInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ClassName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const ClassDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};

  svg {
    width: 14px;
    height: 14px;
  }
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

const TodayClassesWidget = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTodayClasses();
    }, []);

    const loadTodayClasses = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/calendar/events/today');
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error('Error cargando clases:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return { time: '--:--', period: '' };

        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

        return {
            time: `${displayHour}:${minutes}`,
            period
        };
    };

    const getTodayDate = () => {
        return new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Widget
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <WidgetHeader>
                <WidgetTitle>
                    <Calendar size={20} />
                    Clases de Hoy
                </WidgetTitle>
                <TodayBadge>{getTodayDate()}</TodayBadge>
            </WidgetHeader>

            {loading ? (
                <EmptyState>
                    <Clock size={48} />
                    <p>Cargando clases...</p>
                </EmptyState>
            ) : classes.length > 0 ? (
                <ClassesList>
                    {classes.map((classItem, index) => {
                        const { time, period } = formatTime(classItem.startTime);

                        return (
                            <ClassCard
                                key={classItem.id}
                                $color={classItem.subjectColor}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ClassTime $color={classItem.subjectColor}>
                                    <TimeText>{time}</TimeText>
                                    <AmPm>{period}</AmPm>
                                </ClassTime>

                                <ClassInfo>
                                    <ClassName>{classItem.title || classItem.subjectName}</ClassName>
                                    <ClassDetails>
                                        {classItem.location && (
                                            <DetailItem>
                                                <MapPin />
                                                {classItem.location}
                                            </DetailItem>
                                        )}
                                        {classItem.endTime && (
                                            <DetailItem>
                                                <Clock />
                                                Hasta {formatTime(classItem.endTime).time} {formatTime(classItem.endTime).period}
                                            </DetailItem>
                                        )}
                                    </ClassDetails>
                                </ClassInfo>
                            </ClassCard>
                        );
                    })}
                </ClassesList>
            ) : (
                <EmptyState>
                    <Calendar size={48} />
                    <p>No hay clases programadas para hoy</p>
                </EmptyState>
            )}
        </Widget>
    );
};

export default TodayClassesWidget;
