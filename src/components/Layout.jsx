import React, { useState } from 'react';
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
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.colors.slate[50]};
  overflow: hidden;
  font-family: ${props => props.theme.typography.fontFamily};
`;

const Sidebar = styled(motion.div)`
  width: 280px;
  background: white;
  border-right: 1px solid ${props => props.theme.colors.slate[200]};
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: 40;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
  }
`;

const Overlay = styled(motion.div)`
  display: none;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 45;
  }
`;

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.slate[200]};
  text-align: center;
`;

const AppTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.slate[800]};
  margin-bottom: ${props => props.theme.spacing.xs};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.lg};
  }
`;

const AppSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.slate[500]};
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const LogoImage = styled.img`
  width: 2rem;
  height: 2rem;
  object-fit: contain;
`;

const LogoText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[600]};
`;

const Nav = styled.nav`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  overflow-y: auto;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const NavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.xl};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  background: ${props => props.active ? props.theme.colors.primary.main : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.slate[600]};
  box-shadow: ${props => props.active ? `0 10px 15px -3px ${props.theme.colors.primary.main}30` : 'none'};
  font-weight: ${props => props.active ? props.theme.typography.fontWeight.semibold : props.theme.typography.fontWeight.medium};

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary.main : props.theme.colors.slate[100]};
    transform: ${props => props.active ? 'scale(1)' : 'translateX(5px)'};
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

const SidebarFooter = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.slate[200]};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.slate[50]};
  border-radius: ${props => props.theme.borderRadius.xl};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.theme.colors.gradients.purple};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[800]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.slate[500]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LogoutButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.danger.light}15;
  color: ${props => props.theme.colors.danger.main};
  border: none;
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.danger.light}25;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid ${props => props.theme.colors.slate[200]};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${props => props.theme.shadows.sm};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  }
`;

const MenuToggle = styled(motion.button)`
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.theme.colors.slate[100]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.slate[600]};

  &:hover {
    background: ${props => props.theme.colors.slate[200]};
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: ${props => props.alwaysShow ? 'flex' : 'none'};
  }
`;

const HeaderTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[800]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.background};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.lg};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Detectar cambios de tamaño de pantalla
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar sidebar en móvil al cambiar de ruta
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Estudiantes', path: '/students' },
    { icon: BookOpen, label: 'Materias', path: '/subjects' },
    { icon: UserCheck, label: 'Inscripciones', path: '/enrollments' },
    { icon: Edit, label: 'Gestión de Notas', path: '/grade-management' },
    { icon: GraduationCap, label: 'Calificaciones', path: '/grades' },
    { icon: Calendar, label: 'Calendario', path: '/calendar' },
    { icon: FileText, label: 'Reportes', path: '/reports' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Container>
      <AnimatePresence mode="wait">
        {isSidebarOpen && isMobile && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <Sidebar
            initial={isMobile ? { x: -280, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: -280, opacity: 0 } : {}}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <SidebarHeader>
              <AppTitle>GradeApp</AppTitle>
              <AppSubtitle>Sistema de Gestión Académica</AppSubtitle>
            </SidebarHeader>

            <Nav>
              <NavList>
                {menuItems.map((item) => (
                  <NavItem
                    key={item.path}
                    active={location.pathname === item.path}
                    onClick={() => handleNavigation(item.path)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavItem>
                ))}
              </NavList>
            </Nav>

            <SidebarFooter>
              <UserInfo>
                <UserAvatar>A</UserAvatar>
                <UserDetails>
                  <UserName>Administrador</UserName>
                  <UserEmail>admin@gradeapp.com</UserEmail>
                </UserDetails>
              </UserInfo>
              <LogoutButton
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={18} />
                Cerrar Sesión
              </LogoutButton>
              <FooterLogo>
                <LogoImage src="/imagenes/logo-principal.png" alt="GradeApp Logo" />
                <LogoText>GradeApp</LogoText>
              </FooterLogo>
            </SidebarFooter>
          </Sidebar>
        )}
      </AnimatePresence>

      <MainContent>
        <Header>
          <MenuToggle
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            alwaysShow={isMobile}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </MenuToggle>
          <HeaderTitle>GradeApp</HeaderTitle>
        </Header>

        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </Container>
  );
};

export default Layout;
