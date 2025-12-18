import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Download,
    Mail,
    Users,
    BookOpen,
    CheckCircle,
    XCircle,
    Loader,
    X,
    Settings,
    MessageCircle,
    ChevronRight,
    Search,
    AlertCircle,
    Send,
    CheckCircle2
} from 'lucide-react';
import { studentsAPI, enrollmentsAPI, gradesAPI } from '../services/database';
import PDFService from '../services/pdfService';
import EmailService from '../services/emailService';
import WhatsAppService from '../services/whatsappService';
import { Toast, useToast } from '../components/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
  padding-bottom: 40px;
`;

const Header = styled.div`
    margin-bottom: ${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
  letter-spacing: -0.04em;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.slate[500]};
  font-weight: 500;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const ActionCard = styled(motion.div)`
  ${props => props.theme.glassmorphism}
  border-radius: 28px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 60px;
    height: 60px;
    background: ${props => props.$accent};
    filter: blur(40px);
    opacity: 0.15;
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  background: ${props => props.bg};
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const ActionTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
  letter-spacing: -0.02em;
`;

const ActionDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.slate[500]};
  line-height: 1.6;
  flex: 1;
`;

const MainButton = styled(motion.button)`
  background: ${props => props.bg || props.theme.colors.gradients.primary};
  color: white;
  padding: 14px;
  border-radius: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  cursor: pointer;
  box-shadow: ${props => props.shadow || '0 8px 20px rgba(99, 102, 241, 0.2)'};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const StudentsSection = styled.div`
  ${props => props.theme.glassmorphism}
  border-radius: 32px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const BulkBar = styled.div`
  background: ${props => props.theme.colors.gradients.primary};
  padding: 12px 24px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  margin-bottom: 8px;
`;

const SelectAllBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const StudentsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StudentRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: ${props => props.selected ? 'rgba(99, 102, 241, 0.05)' : 'white'};
  border: 1px solid ${props => props.selected ? props.theme.colors.primary.main + '40' : props.theme.colors.slate[100]};
  border-radius: 20px;
  transition: all 0.2s;

  &:hover {
    transform: translateX(8px);
    border-color: ${props => props.theme.colors.primary.main}40;
  }
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  background: ${props => props.theme.colors.gradients.purple};
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 18px;
`;

const NameChip = styled.div`
  flex: 1;
  margin-left: 16px;
  h4 { font-size: 15px; font-weight: 700; color: ${props => props.theme.colors.slate[800]}; }
  p { font-size: 12px; color: ${props => props.theme.colors.slate[400]}; }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SmallIconButton = styled(motion.button)`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${props => props.bg || '#F1F5F9'};
  color: ${props => props.color || '#64748B'};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
`;

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalBox = styled(motion.div)`
  background: white;
  border-radius: 32px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  font-size: 15px;
  outline: none;
  transition: all 0.2s;
  margin-top: 8px;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const Reports = () => {
    const toast = useToast();
    const [students, setStudents] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState([]);
    const [showProgress, setShowProgress] = useState(false);
    const [showEmailConfig, setShowEmailConfig] = useState(false);
    const [emailConfig, setEmailConfig] = useState({
        fromEmail: 'noreply@gradeapp.com',
        fromName: 'GradeApp - Sistema Académico',
        replyTo: 'soporte@gradeapp.com'
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [s, e, g] = await Promise.all([
                studentsAPI.getAll(), enrollmentsAPI.getAll(), gradesAPI.getAll()
            ]);
            setStudents(s);
            setEnrollments(e.map(item => ({ ...item, accumulated: gradesAPI.calculateAccumulated?.(item.id)?.accumulated || null })));
            setGrades(g);
        } catch (err) { toast.error('Error al cargar datos'); }
    };

    const handleGenerateConsolidatedPDF = async () => {
        try {
            setIsProcessing(true);
            const doc = await PDFService.generateConsolidatedReport(students, enrollments, grades);
            PDFService.downloadPDF(doc, `Reporte_Consolidado_${Date.now()}.pdf`);
            toast.success('Reporte consolidado generado');
        } catch (error) { toast.error('Error al generar PDF'); }
        finally { setIsProcessing(false); }
    };

    const handleSendBulkEmails = async () => {
        if (selectedStudents.length === 0) return toast.warning('Selecciona estudiantes');
        setIsProcessing(true); setShowProgress(true); setProgress([]);
        const reports = [];
        for (const id of selectedStudents) {
            const student = students.find(s => s.id === id);
            try {
                const doc = await PDFService.generateStudentReport(student, enrollments.filter(e => e.studentId === id), grades);
                reports.push({ student, pdfBlob: PDFService.getPDFBlob(doc) });
                setProgress(p => [...p, { name: student.name, status: 'generated' }]);
            } catch (err) { setProgress(p => [...p, { name: student.name, status: 'error' }]); }
        }
        const results = await EmailService.sendBulkReports(reports);
        results.forEach(res => setProgress(p => p.map(it => it.name === res.student ? { ...it, status: res.success ? 'sent' : 'error' } : it)));
        toast.success('Envío completado');
        setIsProcessing(false);
    };

    const handleSendBulkWhatsApp = async () => {
        if (selectedStudents.length === 0) return toast.warning('Selecciona estudiantes');
        setIsProcessing(true); setShowProgress(true); setProgress([]);
        const selected = students.filter(s => selectedStudents.includes(s.id));
        const messages = selected.filter(s => s.phone).map(s => ({
            to: s.phone, message: WhatsAppService.generateReportMessage(s), student: s.name
        }));
        await WhatsAppService.sendBulkMessages(messages, (pData) => {
            setProgress(prev => {
                const existing = prev.find(x => x.name === pData.student);
                if (existing) return prev.map(x => x.name === pData.student ? { ...x, status: pData.status === 'success' ? 'sent' : 'error' } : x);
                return [...prev, { name: pData.student, status: pData.status === 'success' ? 'sent' : 'error' }];
            });
        });
        toast.success('Envío WhatsApp completado');
        setIsProcessing(false);
    };

    const toggleSelection = (id) => setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    return (
        <Container>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
            <Header>
                <Title>Centro de Reportes</Title>
                <Subtitle>Generación de boletines, envíos masivos y reportes administrativos</Subtitle>
            </Header>

            <ActionsGrid>
                <ActionCard $accent="#6366F1" whileHover={{ y: -5 }}>
                    <IconWrapper bg="rgba(99, 102, 241, 0.1)" color="#6366F1"><FileText size={26} /></IconWrapper>
                    <ActionTitle>Consolidado General</ActionTitle>
                    <ActionDescription>Exporta una tabla dinámica con el rendimiento de todos los alumnos inscritos actualmente.</ActionDescription>
                    <MainButton onClick={handleGenerateConsolidatedPDF} disabled={isProcessing}>
                        {isProcessing ? <Loader className="animate-spin" size={18} /> : <Download size={18} />} Descargar Tabla
                    </MainButton>
                </ActionCard>

                <ActionCard $accent="#10B981" whileHover={{ y: -5 }}>
                    <IconWrapper bg="rgba(16, 185, 129, 0.1)" color="#10B981"><Mail size={26} /></IconWrapper>
                    <ActionTitle>Envío por Correo</ActionTitle>
                    <ActionDescription>Envía los boletines individuales en formato PDF directamente a los correos de los padres.</ActionDescription>
                    <MainButton bg="linear-gradient(135deg, #10B981 0%, #059669 100%)" shadow="0 8px 20px rgba(16, 185, 129, 0.2)"
                        onClick={handleSendBulkEmails} disabled={isProcessing || selectedStudents.length === 0}>
                        <Send size={18} /> Enviar Emails ({selectedStudents.length})
                    </MainButton>
                </ActionCard>

                <ActionCard $accent="#F59E0B" whileHover={{ y: -5 }}>
                    <IconWrapper bg="rgba(245, 158, 11, 0.1)" color="#F59E0B"><MessageCircle size={26} /></IconWrapper>
                    <ActionTitle>WhatsApp Masivo</ActionTitle>
                    <ActionDescription>Comunícate directamente con los tutores enviando el resumen de notas por WhatsApp.</ActionDescription>
                    <MainButton bg="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" shadow="0 8px 20px rgba(245, 158, 11, 0.2)"
                        onClick={handleSendBulkWhatsApp} disabled={isProcessing || selectedStudents.length === 0}>
                        <MessageCircle size={18} /> WhatsApp ({selectedStudents.length})
                    </MainButton>
                </ActionCard>

                <ActionCard $accent="#8B5CF6" whileHover={{ y: -5 }}>
                    <IconWrapper bg="rgba(139, 92, 246, 0.1)" color="#8B5CF6"><Settings size={26} /></IconWrapper>
                    <ActionTitle>Configuración</ActionTitle>
                    <ActionDescription>Personaliza los datos del remitente y el contenido de los mensajes automáticos.</ActionDescription>
                    <MainButton bg="#F1F5F9" color="#475569" shadow="none" onClick={() => setShowEmailConfig(true)}>
                        <Settings size={18} /> Ajustes
                    </MainButton>
                </ActionCard>
            </ActionsGrid>

            <StudentsSection>
                <SectionHeader>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>Listado de Estudiantes</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <Input placeholder="Buscar alumno..." style={{ width: '240px', padding: '10px 12px 10px 40px', marginTop: 0 }} />
                    </div>
                </SectionHeader>

                {students.length > 0 && (
                    <BulkBar>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                            <CheckCircle2 size={16} /> {selectedStudents.length} seleccionados
                        </div>
                        <SelectAllBtn onClick={() => setSelectedStudents(selectedStudents.length === students.length ? [] : students.map(s => s.id))}>
                            {selectedStudents.length === students.length ? 'Deseleccionar' : 'Seleccionar Todo'}
                        </SelectAllBtn>
                    </BulkBar>
                )}

                <StudentsGrid>
                    {students.map(s => (
                        <StudentRow key={s.id} selected={selectedStudents.includes(s.id)} onClick={() => toggleSelection(s.id)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <input type="checkbox" checked={selectedStudents.includes(s.id)} readOnly style={{ width: '18px', height: '18px' }} />
                                <Avatar>{s.name.charAt(0)}</Avatar>
                                <NameChip>
                                    <h4>{s.name}</h4>
                                    <p>{s.email || 'Sin correo registrado'}</p>
                                </NameChip>
                            </div>
                            <ActionGroup onClick={e => e.stopPropagation()}>
                                <SmallIconButton color="#6366F1" bg="#EEF2FF" onClick={() => PDFService.downloadPDF(PDFService.generateStudentReport(s, enrollments.filter(e => e.studentId === s.id), grades), `Reporte_${s.name}.pdf`)}><Download size={16} /></SmallIconButton>
                                <SmallIconButton color="#10B981" bg="#ECFDF5" onClick={() => WhatsAppService.sendMessage(s.phone, WhatsAppService.generateReportMessage(s))}><MessageCircle size={16} /></SmallIconButton>
                            </ActionGroup>
                        </StudentRow>
                    ))}
                </StudentsGrid>
            </StudentsSection>

            <AnimatePresence>
                {showProgress && (
                    <Modal initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isProcessing && setShowProgress(false)}>
                        <ModalBox initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
                            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>Procesando Solicitudes</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {progress.map((p, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '14px' }}>
                                        {p.status === 'sent' ? <CheckCircle2 size={18} color="#10B981" /> : p.status === 'error' ? <XCircle size={18} color="#EF4444" /> : <Loader size={18} className="animate-spin" color="#6366F1" />}
                                        <div style={{ flex: 1, fontSize: '14px', fontWeight: '600' }}>{p.name}</div>
                                        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: p.status === 'sent' ? '#10B981' : '#94a3b8' }}>{p.status}</div>
                                    </div>
                                ))}
                            </div>
                            {!isProcessing && <MainButton style={{ width: '100%', marginTop: '32px' }} onClick={() => setShowProgress(false)}>Finalizar</MainButton>}
                        </ModalBox>
                    </Modal>
                )}

                {showEmailConfig && (
                    <Modal initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEmailConfig(false)}>
                        <ModalBox initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '22px', fontWeight: '800' }}>Configuración</h3>
                                <IconButton onClick={() => setShowEmailConfig(false)}><X size={20} /></IconButton>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div><label style={{ fontSize: '14px', fontWeight: '700' }}>Remitente</label><Input value={emailConfig.fromName} onChange={e => setEmailConfig({ ...emailConfig, fromName: e.target.value })} /></div>
                                <div><label style={{ fontSize: '14px', fontWeight: '700' }}>Email de origen</label><Input value={emailConfig.fromEmail} onChange={e => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })} /></div>
                                <MainButton style={{ marginTop: '12px' }} onClick={() => { EmailService.setInstitutionalEmail(emailConfig.fromEmail, emailConfig.fromName, emailConfig.replyTo); setShowEmailConfig(false); toast.success('Ajustes guardados'); }}>Guardar Cambios</MainButton>
                            </div>
                        </ModalBox>
                    </Modal>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default Reports;
