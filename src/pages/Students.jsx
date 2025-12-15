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
  X
} from 'lucide-react';
import { studentsAPI } from '../services/database';
import { Toast, useToast } from '../components/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};

  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const HeaderInfo = styled.div``;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.slate[500]};
`;

const AddButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradients.blue};
  color: white;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.4);
  }
`;

const SearchCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: ${props => props.theme.spacing.lg};
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.slate[400]};
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md};
  padding-left: 2.5rem;
  color: ${props => props.theme.colors.slate[800]};
  outline: none;
  transition: all ${props => props.theme.transitions.base};

  &::placeholder {
    color: ${props => props.theme.colors.slate[400]};
  }

  &:focus {
    border-color: ${props => props.theme.colors.primary.light};
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const StudentsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StudentCard = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  padding: ${props => props.theme.spacing.lg};
  position: relative;
  overflow: hidden;
`;

const CardBg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 8rem;
  height: 8rem;
  background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 50%;
  margin-right: -4rem;
  margin-top: -4rem;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 10;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${props => props.theme.colors.gradients.blue};
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-center;
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.xl};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const IconButton = styled(motion.button)`
  width: 2rem;
  height: 2rem;
  background: ${props => props.bgColor};
  color: ${props => props.color};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    opacity: 0.8;
  }
`;

const StudentName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Matricula = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.primary.main};
  background: rgba(59, 130, 246, 0.1);
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  display: inline-block;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Badge = styled.div`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  background: rgba(34, 197, 94, 0.1);
  color: #16A34A;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.slate[600]};
  font-size: ${props => props.theme.typography.fontSize.sm};

  svg {
    color: ${props => props.theme.colors.slate[400]};
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: ${props => props.theme.spacing.md};
`;

const Modal = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  max-width: 28rem;
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
`;

const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  background: ${props => props.theme.colors.slate[100]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.slate[200]};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.slate[700]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.slate[800]};
  outline: none;
  transition: all ${props => props.theme.transitions.base};

  &::placeholder {
    color: ${props => props.theme.colors.slate[400]};
  }

  &:focus {
    border-color: ${props => props.theme.colors.primary.light};
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
`;

const CancelButton = styled(motion.button)`
  flex: 1;
  background: ${props => props.theme.colors.slate[200]};
  color: ${props => props.theme.colors.slate[800]};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.slate[300]};
  }
`;

const SubmitButton = styled(motion.button)`
  flex: 1;
  background: ${props => props.theme.colors.gradients.blue};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
`;

const Students = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrollmentDate: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentsAPI.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Error cargando estudiantes:', error);
      toast.error('No se pudieron cargar los estudiantes. Por favor, recarga la página.', 'Error de Carga');
      setStudents([]);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingStudent(null);
    setFormData({ name: '', email: '', phone: '', enrollmentDate: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      enrollmentDate: student.enrollmentDate
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (confirm(`¿Está seguro de eliminar a "${name}"?`)) {
      try {
        await studentsAPI.delete(id);
        toast.success(`El estudiante "${name}" fue eliminado del sistema`, 'Eliminación Exitosa');
        await loadStudents();
      } catch (error) {
        console.error('Error eliminando estudiante:', error);
        toast.error('No se pudo eliminar el estudiante. Puede tener inscripciones activas.', 'Error al Eliminar');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.email || !formData.email.includes('@')) {
      toast.warning('Por favor ingresa un email válido', 'Email Inválido');
      return;
    }

    if (!formData.name || !formData.name.trim()) {
      toast.warning('El nombre es obligatorio', 'Campo Requerido');
      return;
    }

    try {
      if (editingStudent) {
        await studentsAPI.update(editingStudent.id, formData);
        toast.success('Los datos del estudiante fueron actualizados correctamente', 'Actualización Exitosa');
      } else {
        await studentsAPI.create(formData);
        toast.success('Estudiante registrado exitosamente en el sistema', 'Registro Exitoso');
      }
      await loadStudents();
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        enrollmentDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error guardando estudiante:', error);
      toast.error(error.message || 'No se pudo guardar el estudiante. Por favor, intenta nuevamente.', 'Error al Guardar');
    }
  };

  return (
    <Container>
      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
      <Header>
        <HeaderInfo>
          <Title>Estudiantes</Title>
          <Subtitle>Gestiona la información de los estudiantes</Subtitle>
        </HeaderInfo>
        <AddButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
        >
          <Plus size={20} />
          <span>Nuevo Estudiante</span>
        </AddButton>
      </Header>

      <SearchCard>
        <SearchWrapper>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar estudiante por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
      </SearchCard>

      <StudentsGrid>
        {filteredStudents.map((student, index) => (
          <StudentCard
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <CardBg />
            <CardContent>
              <CardHeader>
                <Avatar>{student.name.charAt(0)}</Avatar>
                <Actions>
                  <IconButton
                    bgColor="rgba(59, 130, 246, 0.1)"
                    color="#2563EB"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(student)}
                  >
                    <Edit size={16} />
                  </IconButton>
                  <IconButton
                    bgColor="rgba(239, 68, 68, 0.1)"
                    color="#DC2626"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(student.id, student.name)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Actions>
              </CardHeader>

              {student.matricula && <Matricula>📋 {student.matricula}</Matricula>}
              <StudentName>{student.name}</StudentName>
              <Badge>Promedio: N/A</Badge>

              <InfoList>
                <InfoItem>
                  <Mail size={16} />
                  <span>{student.email}</span>
                </InfoItem>
                <InfoItem>
                  <Phone size={16} />
                  <span>{student.phone}</span>
                </InfoItem>
                <InfoItem>
                  <Calendar size={16} />
                  <span>Inscrito: {new Date(student.enrollmentDate).toLocaleDateString('es-ES')}</span>
                </InfoItem>
              </InfoList>
            </CardContent>
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
            <Modal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                </ModalTitle>
                <CloseButton onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Nombre Completo</Label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="juan.perez@email.com"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Teléfono</Label>
                  <Input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="555-0000"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Fecha de Inscripción</Label>
                  <Input
                    type="date"
                    required
                    value={formData.enrollmentDate}
                    onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  />
                </FormGroup>

                <ButtonGroup>
                  <CancelButton
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </CancelButton>
                  <SubmitButton
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingStudent ? 'Guardar' : 'Crear'}
                  </SubmitButton>
                </ButtonGroup>
              </Form>
            </Modal>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Students;
