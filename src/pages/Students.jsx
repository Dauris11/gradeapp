import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  X,
  UserPlus,
  Filter,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { studentsAPI } from '../services/database';
import { Toast, useToast } from '../components/Toast';
import { useLanguage } from '../i18n/LanguageContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${props => props.theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${props => props.theme.colors.slate[900]};
  }
  p {
    color: ${props => props.theme.colors.slate[500]};
    font-size: 15px;
  }
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.theme.colors.primary.main};
  color: white;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
  border: none;
  cursor: pointer;
`;

const TopBar = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background: white;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: 14px;
  padding: 12px 16px 12px 44px;
  font-size: 15px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05);
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.slate[400]};
`;

const FilterButton = styled.button`
  background: white;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: 12px;
  border-radius: 14px;
  color: ${props => props.theme.colors.slate[600]};
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.theme.colors.slate[50]};
  }
`;

const StudentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const StudentCard = styled(motion.div)`
  ${props => props.theme.glassmorphism}
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  background: ${props => props.theme.colors.gradients.primary};
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: white;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2);
`;

const StudentInfo = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
    color: ${props => props.theme.colors.slate[900]};
  }
  p {
    font-size: 13px;
    color: ${props => props.theme.colors.slate[500]};
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const Badge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${props => props.bg};
  color: ${props => props.color};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const MiniStat = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.colors.slate[400]};
  text-transform: uppercase;
  
  span {
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.theme.colors.slate[800]};
    margin-top: 2px;
  }
`;

const ViewProfileBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[100]};
  border-radius: 12px;
  color: ${props => props.theme.colors.slate[600]};
  font-size: 13px;
  font-weight: 600;
  margin-top: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: white;
    border-color: ${props => props.theme.colors.primary.main};
    color: ${props => props.theme.colors.primary.main};
  }
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  background: white;
  color: ${props => props.color || props.theme.colors.slate[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.color ? props.color + '10' : props.theme.colors.slate[50]};
    border-color: ${props => props.color || props.theme.colors.slate[300]};
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 28px;
  width: 100%;
  max-width: 500px;
  padding: 40px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeaderWrapper = styled.div`
  margin-bottom: 32px;
  h2 { font-size: 24px; font-weight: 800; }
  p { color: ${props => props.theme.colors.slate[500]}; font-size: 14px; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label { font-size: 13px; font-weight: 600; color: ${props => props.theme.colors.slate[700]}; }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: 12px;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05);
  }
`;

const SubmitBtn = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.primary};
  color: white;
  padding: 16px;
  border-radius: 14px;
  font-weight: 700;
  margin-top: 12px;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  border: none;
  cursor: pointer;
`;

const Students = () => {
  const toast = useToast();
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', enrollmentDate: '' });

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try {
      const data = await studentsAPI.getAll();
      setStudents(data);
    } catch (error) {
      toast.error(t('common.error'), t('common.error'));
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone,
        enrollmentDate: student.enrollmentDate
      });
    } else {
      setEditingStudent(null);
      setFormData({ name: '', email: '', phone: '', enrollmentDate: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentsAPI.update(editingStudent.id, formData);
        toast.success(t('common.success'), t('common.success'));
      } else {
        await studentsAPI.create(formData);
        toast.success(t('common.success'), t('common.success'));
      }
      loadStudents();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(t('common.error'), t('common.error'));
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(t('common.confirm'))) {
      try {
        await studentsAPI.delete(id);
        toast.success(t('common.success'), t('common.success'));
        loadStudents();
      } catch (error) {
        toast.error(t('common.error'), t('common.error'));
      }
    }
  };

  return (
    <Container>
      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />

      <PageHeader>
        <HeaderTitle>
          <h1>{t('students.title')}</h1>
          <p>{t('students.subtitle')}</p>
        </HeaderTitle>
        <ActionButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal()}
        >
          <UserPlus size={20} />
          {t('students.newStudent')}
        </ActionButton>
      </PageHeader>

      <TopBar>
        <SearchBox>
          <SearchIconWrapper><Search size={18} /></SearchIconWrapper>
          <SearchInput
            placeholder={t('common.search') + "..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        <FilterButton><Filter size={18} /> {t('common.filter')}</FilterButton>
      </TopBar>

      <StudentsGrid>
        {filteredStudents.map((s, i) => (
          <StudentCard
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <CardHeader>
              <UserAvatar>{s.name.charAt(0)}</UserAvatar>
              <div style={{ display: 'flex', gap: '8px' }}>
                <IconButton onClick={() => handleOpenModal(s)}><Edit size={16} /></IconButton>
                <IconButton onClick={() => handleDelete(s.id, s.name)} color="#ef4444"><Trash2 size={16} /></IconButton>
              </div>
            </CardHeader>

            <StudentInfo>
              <BadgeContainer>
                {s.matricula && <Badge bg="rgba(99, 102, 241, 0.1)" color="#6366F1">#{s.matricula}</Badge>}
                <Badge bg="rgba(16, 185, 129, 0.1)" color="#10B981">{t('students.active')}</Badge>
              </BadgeContainer>
              <h3>{s.name}</h3>
              <p><Mail size={14} /> {s.email}</p>
              <p><Phone size={14} /> {s.phone}</p>
            </StudentInfo>

            <StatsRow>
              <MiniStat>{t('students.status')}<span>2025</span></MiniStat>
              <MiniStat>{t('dashboard.averageGrade')}<span>8.5</span></MiniStat>
            </StatsRow>

            <ViewProfileBtn>
              {t('periods.viewDetails')} <ChevronRight size={16} />
            </ViewProfileBtn>
          </StudentCard>
        ))}
      </StudentsGrid>

      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeaderWrapper>
                <h2>{editingStudent ? t('common.edit') : t('students.newStudent')}</h2>
                <p>{t('students.subtitle')}</p>
              </ModalHeaderWrapper>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <label>{t('students.name')}</label>
                  <Input
                    placeholder="Ej. Juan Manuel Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>{t('students.email')}</label>
                  <Input
                    type="email"
                    placeholder="usuario@institucion.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <label>{t('students.phone')}</label>
                    <Input
                      placeholder="809-000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Fecha Ingreso</label>
                    <Input
                      type="date"
                      value={formData.enrollmentDate}
                      onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                    />
                  </FormGroup>
                </div>

                <SubmitBtn
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('common.save')}
                </SubmitBtn>
              </Form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Students;
