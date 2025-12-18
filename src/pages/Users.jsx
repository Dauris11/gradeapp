import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCog,
    Plus,
    Edit,
    Trash2,
    Shield,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    X,
    Check,
    AlertCircle
} from 'lucide-react';
import { usersAPI } from '../services/usersAPI';
import { Toast, useToast } from '../components/Toast';

const Container = styled.div`
  padding: ${props => props.theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[900]};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.slate[600]};
  font-size: ${props => props.theme.typography.fontSize.base};
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Button = styled(motion.button)`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.$variant === 'secondary'
        ? props.theme.colors.slate[100]
        : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'};
  color: ${props => props.$variant === 'secondary' ? props.theme.colors.slate[700] : 'white'};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  box-shadow: ${props => props.theme.shadows.md};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Table = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1fr 1fr;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.slate[50]};
  border-bottom: 1px solid ${props => props.theme.colors.slate[200]};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[700]};
  font-size: ${props => props.theme.typography.fontSize.sm};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1fr 1fr;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.slate[100]};
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.theme.colors.slate[50]};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.md};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[900]};
`;

const UserEmail = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.slate[600]};
`;

const RoleBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  background: ${props => {
        switch (props.$role) {
            case 'admin': return 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
            case 'teacher': return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
            default: return 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
        }
    }};
  color: white;
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const StatusBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  background: ${props => props.$active
        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
        : 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'};
  color: white;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  justify-content: flex-end;
`;

const IconButton = styled(motion.button)`
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.$variant === 'danger'
        ? 'rgba(239, 68, 68, 0.1)'
        : 'rgba(59, 130, 246, 0.1)'};
  color: ${props => props.$variant === 'danger'
        ? props.theme.colors.danger.main
        : props.theme.colors.primary.main};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.md};
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.xl};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[900]};
  margin: 0;
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[700]};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.slate[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.base};
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.slate[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.base};
  outline: none;
  transition: all 0.2s;
  background: white;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.slate[400]};
  padding: 0;
  display: flex;
  align-items: center;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.xl};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']};
  color: ${props => props.theme.colors.slate[500]};
`;

const Users = () => {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'user',
        fullName: '',
        isActive: 1
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await usersAPI.getAll();
            setUsers(data);
        } catch (error) {
            toast.error('Error al cargar usuarios', 'Error');
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                password: '',
                email: user.email,
                role: user.role,
                fullName: user.fullName || '',
                isActive: user.isActive
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                password: '',
                email: '',
                role: 'user',
                fullName: '',
                isActive: 1
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setShowPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingUser) {
                await usersAPI.update(editingUser.id, formData);
                toast.success('Usuario actualizado exitosamente', 'Éxito');
            } else {
                await usersAPI.create(formData);
                toast.success('Usuario creado exitosamente', 'Éxito');
            }

            loadUsers();
            handleCloseModal();
        } catch (error) {
            toast.error(error.error || 'Error al guardar usuario', 'Error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await usersAPI.delete(id);
                toast.success('Usuario eliminado exitosamente', 'Éxito');
                loadUsers();
            } catch (error) {
                toast.error(error.error || 'Error al eliminar usuario', 'Error');
            }
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield size={14} />;
            case 'teacher': return <UserCog size={14} />;
            default: return <User size={14} />;
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'teacher': return 'Profesor';
            default: return 'Usuario';
        }
    };

    return (
        <Container>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />

            <Header>
                <Title>
                    <UserCog size={32} />
                    Gestión de Usuarios
                </Title>
                <Subtitle>Administra usuarios, roles y permisos del sistema</Subtitle>
            </Header>

            <Actions>
                <Button
                    onClick={() => handleOpenModal()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus size={20} />
                    Nuevo Usuario
                </Button>
            </Actions>

            <Table>
                <TableHeader>
                    <div>Usuario</div>
                    <div>Email</div>
                    <div>Rol</div>
                    <div>Estado</div>
                    <div style={{ textAlign: 'right' }}>Acciones</div>
                </TableHeader>

                {users.length === 0 ? (
                    <EmptyState>
                        <UserCog size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                        <p>No hay usuarios registrados</p>
                    </EmptyState>
                ) : (
                    users.map(user => (
                        <TableRow
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <UserInfo>
                                <Avatar>
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <UserDetails>
                                    <UserName>{user.fullName || user.username}</UserName>
                                    <UserEmail>@{user.username}</UserEmail>
                                </UserDetails>
                            </UserInfo>

                            <UserEmail>{user.email}</UserEmail>

                            <div>
                                <RoleBadge $role={user.role}>
                                    {getRoleIcon(user.role)}
                                    {getRoleLabel(user.role)}
                                </RoleBadge>
                            </div>

                            <div>
                                <StatusBadge $active={user.isActive}>
                                    {user.isActive ? 'Activo' : 'Inactivo'}
                                </StatusBadge>
                            </div>

                            <ActionButtons>
                                <IconButton
                                    onClick={() => handleOpenModal(user)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Edit size={18} />
                                </IconButton>
                                <IconButton
                                    $variant="danger"
                                    onClick={() => handleDelete(user.id)}
                                    disabled={user.username === 'admin'}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Trash2 size={18} />
                                </IconButton>
                            </ActionButtons>
                        </TableRow>
                    ))
                )}
            </Table>

            <AnimatePresence>
                {showModal && (
                    <Modal
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseModal}
                    >
                        <ModalContent
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ModalHeader>
                                <ModalTitle>
                                    {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                                </ModalTitle>
                                <IconButton onClick={handleCloseModal}>
                                    <X size={20} />
                                </IconButton>
                            </ModalHeader>

                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label>Nombre Completo</Label>
                                    <Input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Juan Pérez"
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Nombre de Usuario</Label>
                                    <Input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="juanperez"
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="juan@ejemplo.com"
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Contraseña {editingUser && '(dejar en blanco para no cambiar)'}</Label>
                                    <PasswordInputWrapper>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            required={!editingUser}
                                        />
                                        <PasswordToggle
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </PasswordToggle>
                                    </PasswordInputWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Rol</Label>
                                    <Select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        required
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="teacher">Profesor</option>
                                        <option value="admin">Administrador</option>
                                    </Select>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Estado</Label>
                                    <Select
                                        value={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: parseInt(e.target.value) })}
                                        required
                                    >
                                        <option value={1}>Activo</option>
                                        <option value={0}>Inactivo</option>
                                    </Select>
                                </FormGroup>

                                <ModalActions>
                                    <Button
                                        type="button"
                                        $variant="secondary"
                                        onClick={handleCloseModal}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Check size={20} />
                                        {editingUser ? 'Actualizar' : 'Crear'}
                                    </Button>
                                </ModalActions>
                            </form>
                        </ModalContent>
                    </Modal>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default Users;
