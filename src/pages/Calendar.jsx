import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.slate[500]};
`;

const CalendarCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: ${props => props.theme.spacing.lg};
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const MonthYear = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
`;

const NavButton = styled(motion.button)`
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.theme.colors.slate[100]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.slate[200]};
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${props => props.theme.spacing.sm};
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[600]};
  padding: ${props => props.theme.spacing.sm};
`;

const DayCell = styled(motion.div)`
  aspect-ratio: 1;
  background: ${props => props.$isCurrentMonth ? 'white' : props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.sm};
  cursor: pointer;
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.primary.light}10;
    border-color: ${props => props.theme.colors.primary.light};
  }
`;

const DayNumber = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.$isCurrentMonth ? props.theme.colors.slate[800] : props.theme.colors.slate[400]};
`;

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: prevMonthLastDay - i,
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: i,
                isCurrentMonth: true
            });
        }

        // Next month days to complete grid
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: i,
                isCurrentMonth: false
            });
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const days = getDaysInMonth(currentDate);

    return (
        <Container>
            <div>
                <Title>Calendario</Title>
                <Subtitle>Visualiza fechas importantes y eventos académicos</Subtitle>
            </div>

            <CalendarCard>
                <CalendarHeader>
                    <NavButton
                        onClick={handlePrevMonth}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft size={20} />
                    </NavButton>

                    <MonthYear>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </MonthYear>

                    <NavButton
                        onClick={handleNextMonth}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronRight size={20} />
                    </NavButton>
                </CalendarHeader>

                <DaysGrid>
                    {dayNames.map(day => (
                        <DayHeader key={day}>{day}</DayHeader>
                    ))}
                    {days.map((day, index) => (
                        <DayCell
                            key={index}
                            $isCurrentMonth={day.isCurrentMonth}
                            whileHover={{ scale: 1.05 }}
                        >
                            <DayNumber $isCurrentMonth={day.isCurrentMonth}>
                                {day.date}
                            </DayNumber>
                        </DayCell>
                    ))}
                </DaysGrid>
            </CalendarCard>
        </Container>
    );
};

export default CalendarPage;
