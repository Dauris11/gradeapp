import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Subjects from './pages/Subjects';
import Grades from './pages/Grades';
import CalendarPage from './pages/Calendar';
import Reports from './pages/Reports';
import Enrollments from './pages/Enrollments';
import GradeManagement from './pages/GradeManagement';
import Users from './pages/Users';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AcademicPeriods from './pages/AcademicPeriods';
import StudentHistory from './pages/StudentHistory';

// Error Boundary para capturar errores de renderizado
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#EF4444', background: '#FEF2F2', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️ Algo salió mal</h1>
          <p style={{ marginBottom: '20px' }}>Ocurrió un error al cargar esta vista.</p>
          <details style={{ whiteSpace: 'pre-wrap', padding: '15px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', maxWidth: '800px', width: '100%', overflow: 'auto' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Ver detalles del error</summary>
            <div style={{ marginTop: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '30px', padding: '12px 24px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Recargar Aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <GlobalStyles />
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route element={<Layout />}>
                  {/* Rutas accesibles para todos los usuarios autenticados */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />

                  {/* Rutas para teachers y admins */}
                  <Route path="/students" element={
                    <ProtectedRoute requiredRole="teacher">
                      <Students />
                    </ProtectedRoute>
                  } />

                  <Route path="/subjects" element={
                    <ProtectedRoute requiredRole="teacher">
                      <Subjects />
                    </ProtectedRoute>
                  } />

                  <Route path="/enrollments" element={
                    <ProtectedRoute requiredRole="teacher">
                      <Enrollments />
                    </ProtectedRoute>
                  } />

                  <Route path="/grade-management" element={
                    <ProtectedRoute requiredRole="teacher">
                      <GradeManagement />
                    </ProtectedRoute>
                  } />

                  <Route path="/grades" element={
                    <ProtectedRoute requiredRole="teacher">
                      <Grades />
                    </ProtectedRoute>
                  } />

                  <Route path="/calendar" element={
                    <ProtectedRoute requiredRole="teacher">
                      <CalendarPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/reports" element={
                    <ProtectedRoute requiredRole="teacher">
                      <Reports />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de registro histórico */}
                  <Route path="/academic-periods" element={
                    <ProtectedRoute requiredRole="teacher">
                      <AcademicPeriods />
                    </ProtectedRoute>
                  } />

                  <Route path="/student-history" element={
                    <ProtectedRoute requiredRole="teacher">
                      <StudentHistory />
                    </ProtectedRoute>
                  } />

                  {/* Ruta solo para admins */}
                  <Route path="/users" element={
                    <ProtectedRoute requiredRole="admin">
                      <Users />
                    </ProtectedRoute>
                  } />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </ErrorBoundary>
    </LanguageProvider>
  );
}

export default App;
