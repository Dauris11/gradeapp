import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, BookOpen, AlertCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { calendarAPI, subjectsAPI } from '../services/database';
import { Toast, useToast } from '../components/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  height: 100%;
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
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
  text-transform: capitalize;
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
  text-transform: capitalize;
`;

const DayCell = styled(motion.div)`
  aspect-ratio: 1;
  background: ${props => props.$isCurrentMonth ? 'white' : props.theme.colors.slate[50]};
  border: 1px solid ${props => props.$isSelected ? props.theme.colors.primary.main : props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.sm};
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  box-shadow: ${props => props.$isSelected ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none'};

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

const EventDots = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 4px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${props => props.color || props.theme.colors.primary.main};
`;

const SidePanel = styled.div`
  background: white;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  height: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 { font-size: 18px; font-weight: 800; color: ${props => props.theme.colors.slate[800]}; }
`;

const AddEventBtn = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
`;

const EventItem = styled(motion.div)`
  padding: 16px;
  background: ${props => props.bg || '#F8FAFC'};
  border-left: 4px solid ${props => props.color || props.theme.colors.slate[400]};
  border-radius: 12px;
  cursor: pointer;
  position: relative;

  h4 { font-size: 15px; font-weight: 700; color: ${props => props.theme.colors.slate[800]}; margin-bottom: 4px; }
  p { font-size: 13px; color: ${props => props.theme.colors.slate[500]}; margin-bottom: 8px; line-height: 1.4; }
  
  .meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: ${props => props.theme.colors.slate[400]};
    align-items: center;
  }
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #EF4444;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s;

  ${EventItem}:hover & {
    opacity: 1;
  }
`;

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 6px; }
  input, select, textarea {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
    font-size: 14px;
    &:focus { outline: none; border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
  }
  textarea { resize: vertical; min-height: 80px; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: ${props => props.primary ? props.theme.colors.gradients.primary : '#F1F5F9'};
  color: ${props => props.primary ? 'white' : '#475569'};
`;

const CalendarPage = () => {
    const { t, language } = useLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        startTime: '08:00',
        endTime: '09:00',
        eventType: 'assignment',
        subjectId: ''
    });
    const toast = useToast();

    useEffect(() => {
        loadData();
    }, [currentDate]);

    const loadData = async () => {
        try {
            const subs = await subjectsAPI.getAll();
            setSubjects(Array.isArray(subs) ? subs : []);
            // Cargar eventos del mes
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const start = new Date(year, month - 1, 1).toISOString();
            const end = new Date(year, month + 2, 0).toISOString();
            const evs = await calendarAPI.getAllEvents({ startDate: start, endDate: end });
            setEvents(Array.isArray(evs) ? evs : []);
        } catch (error) {
            console.error('Error loading calendar data:', error);
        }
    };

    // Helper para formato YYYY-MM-DD local
    const toLocalISOString = (date) => {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().split('T')[0];
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const subject = subjects.find(s => s.id === parseInt(newEvent.subjectId));
            const dateStr = toLocalISOString(selectedDate);

            const eventData = {
                ...newEvent,
                startDate: dateStr,
                endDate: dateStr,
                subjectName: subject ? subject.name : null,
                subjectColor: subject ? subject.color : '#6366F1'
            };

            await calendarAPI.createEvent(eventData);
            toast.success(t('common.success'));
            setIsModalOpen(false);
            setNewEvent({ title: '', description: '', startTime: '08:00', endTime: '09:00', eventType: 'assignment', subjectId: '' });
            loadData();
        } catch (error) {
            toast.error(t('common.error'));
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm(t('common.confirm'))) {
            try {
                await calendarAPI.deleteEvent(id);
                toast.success(t('common.success'));
                loadData();
            } catch (error) {
                toast.error(t('common.error'));
            }
        }
    };

    const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: prevMonthLastDay - i,
                isCurrentMonth: false,
                fullDate: new Date(year, month - 1, prevMonthLastDay - i)
            });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: i,
                isCurrentMonth: true,
                fullDate: new Date(year, month, i)
            });
        }
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: i,
                isCurrentMonth: false,
                fullDate: new Date(year, month + 1, i)
            });
        }
        return days;
    };

    const days = getDaysInMonth(currentDate);

    // Listado filtrado con fechas locales
    const selectedDayEvents = events.filter(e => {
        if (!e.startDate) return false;
        const selStr = toLocalISOString(selectedDate);
        const evStr = e.startDate.split('T')[0];
        return selStr === evStr;
    });

    const monthName = currentDate.toLocaleString(language, { month: 'long' });
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay() + i);
        return d.toLocaleString(language, { weekday: 'short' });
    });

    return (
        <Container>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
            <div>
                <Title>{t('calendar.title')}</Title>
                <Subtitle>{t('calendar.subtitle')}</Subtitle>
            </div>

            <ContentGrid>
                <CalendarCard>
                    <CalendarHeader>
                        <NavButton onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}><ChevronLeft size={20} /></NavButton>
                        <MonthYear>{monthName} {currentDate.getFullYear()}</MonthYear>
                        <NavButton onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}><ChevronRight size={20} /></NavButton>
                    </CalendarHeader>

                    <DaysGrid>
                        {dayNames.map((day, i) => <DayHeader key={i}>{day}</DayHeader>)}
                        {days.map((day, index) => {
                            const dayEvents = events.filter(e => {
                                const evStr = e.startDate.split('T')[0];
                                const dStr = toLocalISOString(day.fullDate);
                                return evStr === dStr;
                            });

                            return (
                                <DayCell
                                    key={index}
                                    $isCurrentMonth={day.isCurrentMonth}
                                    $isSelected={isSameDay(day.fullDate, selectedDate)}
                                    onClick={() => setSelectedDate(day.fullDate)}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <DayNumber $isCurrentMonth={day.isCurrentMonth}>{day.date}</DayNumber>
                                    <EventDots>
                                        {dayEvents.slice(0, 4).map((ev, i) => (
                                            <Dot key={i} color={ev.subjectColor || '#6366F1'} />
                                        ))}
                                    </EventDots>
                                </DayCell>
                            );
                        })}
                    </DaysGrid>
                </CalendarCard>

                <SidePanel>
                    <PanelHeader>
                        <h3>{selectedDate.toLocaleDateString(language, { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                        <AddEventBtn onClick={() => setIsModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Plus size={16} /> {t('common.add')}
                        </AddEventBtn>
                    </PanelHeader>

                    {selectedDayEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                            <Clock size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>{t('common.noData')}</p>
                        </div>
                    ) : (
                        <EventsList>
                            {selectedDayEvents.map(event => (
                                <EventItem key={event.id} bg={event.subjectColor + '15'} color={event.subjectColor} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <DeleteBtn onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}><Trash2 size={16} /></DeleteBtn>
                                    <h4>{event.title}</h4>
                                    <p>{event.description}</p>
                                    <div className="meta">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} /> {event.startTime} - {event.endTime}
                                        </div>
                                        {event.subjectName && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <BookOpen size={12} /> {event.subjectName}
                                            </div>
                                        )}
                                    </div>
                                </EventItem>
                            ))}
                        </EventsList>
                    )}
                </SidePanel>
            </ContentGrid>

            <AnimatePresence>
                {isModalOpen && (
                    <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}>
                        <ModalContent onClick={e => e.stopPropagation()} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{t('common.add')} Evento</h2>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleCreateEvent}>
                                <FormGroup>
                                    <label>Título</label>
                                    <input required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Examen parcial..." />
                                </FormGroup>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <FormGroup>
                                        <label>Inicio</label>
                                        <input type="time" required value={newEvent.startTime} onChange={e => setNewEvent({ ...newEvent, startTime: e.target.value })} />
                                    </FormGroup>
                                    <FormGroup>
                                        <label>Fin</label>
                                        <input type="time" required value={newEvent.endTime} onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })} />
                                    </FormGroup>
                                </div>

                                <FormGroup>
                                    <label>Tipo</label>
                                    <select value={newEvent.eventType} onChange={e => setNewEvent({ ...newEvent, eventType: e.target.value })}>
                                        <option value="assignment">Tarea / Asignación</option>
                                        <option value="exam">Examen</option>
                                        <option value="class">Clase extra</option>
                                        <option value="reminder">Recordatorio</option>
                                    </select>
                                </FormGroup>

                                <FormGroup>
                                    <label>{t('subjects.title')}</label>
                                    <select value={newEvent.subjectId} onChange={e => setNewEvent({ ...newEvent, subjectId: e.target.value })}>
                                        <option value="">(Opcional) Seleccionar materia...</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </FormGroup>

                                <FormGroup>
                                    <label>Descripción</label>
                                    <textarea value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Detalles adicionales..." />
                                </FormGroup>

                                <ButtonGroup>
                                    <Button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                    <Button type="submit" primary>Guardar Evento</Button>
                                </ButtonGroup>
                            </form>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default CalendarPage;
