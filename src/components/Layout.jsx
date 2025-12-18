import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  FileText,
  LogOut,
  Menu,
  X,
  UserCheck,
  Edit,
  UserCog,
  Bell,
  Settings,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppQRModal from './WhatsAppQRModal';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.colors.background};
  overflow: hidden;
  font-family: ${props => props.theme.typography.fontFamily};
`;

const Sidebar = styled(motion.div)`
  width: 280px;
  background: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${props => props.theme.colors.slate[200]};
  z-index: 40;
  position: relative;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  }
`;

const SidebarOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 45;
  display: none;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
  }
`;

const SidebarHeader = styled.div`
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.slate[100]};
`;

const LogoContainer = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  background: white;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const AppTitle = styled.h1`
  font-size: 20px;
  font-weight: 800;
  color: ${props => props.theme.colors.slate[900]};
  letter-spacing: -0.02em;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.slate[200]};
    border-radius: 10px;
  }
`;

const NavGroupLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.colors.slate[400]};
  text-transform: uppercase;
  margin: 20px 12px 8px;
  letter-spacing: 0.05em;
`;

const NavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 2px;
  transition: all 0.2s;
  color: ${props => props.active ? props.theme.colors.primary.main : props.theme.colors.slate[600]};
  background: ${props => props.active ? 'rgba(99, 102, 241, 0.08)' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 14px;

  &:hover {
    background: ${props => props.active ? 'rgba(99, 102, 241, 0.08)' : props.theme.colors.slate[50]};
    color: ${props => props.theme.colors.slate[900]};
  }

  svg {
    flex-shrink: 0;
  }
`;

const SidebarFooter = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.theme.colors.slate[100]};
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.slate[50]};
  border-radius: 12px;
  margin-bottom: 12px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${props => props.theme.colors.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.slate[900]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.p`
  font-size: 11px;
  color: ${props => props.theme.colors.slate[500]};
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: ${props => props.theme.colors.slate[100]};
  color: ${props => props.theme.colors.slate[700]};
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.slate[200]};
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const Navbar = styled.header`
  height: 64px;
  background: white;
  border-bottom: 1px solid ${props => props.theme.colors.slate[200]};
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 30;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 16px;
  }
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuButton = styled.button`
  padding: 8px;
  border-radius: 8px;
  background: ${props => props.theme.colors.slate[100]};
  color: ${props => props.theme.colors.slate[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.slate[200]};
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.slate[900]};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button`
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.slate[600]};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.slate[100]};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.danger.main};
  border-radius: 50%;
  border: 2px solid white;
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: ${props => props.theme.colors.slate[50]};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.slate[300]};
    border-radius: 10px;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 16px;
  }
`;

const NotificationPanel = styled(motion.div)`
  position: absolute;
  top: 70px;
  right: 24px;
  width: 360px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme.colors.slate[200]};
  z-index: 100;
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.slate[100]};
  font-weight: 700;
  font-size: 15px;
  color: ${props => props.theme.colors.slate[900]};
`;

const NotificationItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.slate[50]};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.slate[50]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.slate[900]};
  margin-bottom: 4px;
`;

const NotificationText = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.slate[500]};
`;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWhatsAppQR, setShowWhatsAppQR] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  // Verificar estado de WhatsApp al cargar
  useEffect(() => {
    const checkWhatsAppStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/whatsapp/status');
        const data = await response.json();
        if (!data.connected) {
          // Mostrar modal después de 2 segundos si no está conectado
          setTimeout(() => setShowWhatsAppQR(true), 2000);
        }
      } catch (err) {
        console.log('WhatsApp service not available');
      }
    };

    checkWhatsAppStatus();
  }, []);

  const navItems = [
    {
      label: 'Principal', items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Estudiantes', path: '/students' },
        { icon: BookOpen, label: 'Materias', path: '/subjects' },
      ]
    },
    {
      label: 'Académico', items: [
        { icon: UserCheck, label: 'Inscripciones', path: '/enrollments' },
        { icon: Edit, label: 'Gestión de Notas', path: '/grade-management' },
      ]
    },
    {
      label: 'Sistema', items: [
        { icon: FileText, label: 'Reportes', path: '/reports' },
        { icon: UserCog, label: 'Usuarios', path: '/users' },
      ]
    }
  ];

  const getPageTitle = () => {
    const item = navItems.flatMap(g => g.items).find(i => i.path === location.pathname);
    return item?.label || 'GradePro';
  };

  const notifications = [
    { title: 'Nueva inscripción', text: 'Juan Pérez se inscribió en Matemáticas' },
    { title: 'Calificación agregada', text: 'Se agregó nota para el examen final' },
    { title: 'Reporte generado', text: 'Reporte consolidado disponible' },
  ];

  return (
    <Container>
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <SidebarOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : {}}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <SidebarHeader>
              <LogoContainer>
                <img src="/imagenes/logo-principal.png" alt="GradePro Logo" />
              </LogoContainer>
              <AppTitle>GradePro</AppTitle>
            </SidebarHeader>

            <Nav>
              {navItems.map((group, idx) => (
                <div key={idx}>
                  <NavGroupLabel>{group.label}</NavGroupLabel>
                  {group.items.map((item) => (
                    <NavItem
                      key={item.path}
                      active={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </NavItem>
                  ))}
                </div>
              ))}
            </Nav>

            <SidebarFooter>
              <UserProfile>
                <Avatar>AD</Avatar>
                <UserInfo>
                  <UserName>Administrador</UserName>
                  <UserRole>Admin Principal</UserRole>
                </UserInfo>
              </UserProfile>
              <LogoutButton onClick={() => navigate('/')}>
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </LogoutButton>
            </SidebarFooter>
          </Sidebar>
        )}
      </AnimatePresence>

      <MainContent>
        <Navbar>
          <NavLeft>
            <MenuButton onClick={() => setSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </MenuButton>
            <PageTitle>{getPageTitle()}</PageTitle>
          </NavLeft>

          <NavRight>
            <IconButton onClick={() => setShowWhatsAppQR(true)} title="Conectar WhatsApp">
              <MessageCircle size={20} />
            </IconButton>
            <IconButton onClick={() => setShowNotifications(!showNotifications)} title="Notificaciones">
              <Bell size={20} />
              <Badge />
            </IconButton>
            <IconButton onClick={() => navigate('/users')} title="Configuración">
              <Settings size={20} />
            </IconButton>
          </NavRight>
        </Navbar>

        <AnimatePresence>
          {showNotifications && (
            <NotificationPanel
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <NotificationHeader>Notificaciones</NotificationHeader>
              {notifications.map((notif, idx) => (
                <NotificationItem key={idx}>
                  <NotificationTitle>{notif.title}</NotificationTitle>
                  <NotificationText>{notif.text}</NotificationText>
                </NotificationItem>
              ))}
            </NotificationPanel>
          )}
        </AnimatePresence>

        <ContentArea>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </ContentArea>
      </MainContent>

      <WhatsAppQRModal
        isOpen={showWhatsAppQR}
        onClose={() => setShowWhatsAppQR(false)}
      />
    </Container>
  );
};

export default Layout;
