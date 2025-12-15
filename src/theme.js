// Theme configuration for styled-components
export const theme = {
  colors: {
    // Primary colors
    primary: {
      light: '#60A5FA',
      main: '#3B82F6',
      dark: '#2563EB',
    },
    success: {
      light: '#4ADE80',
      main: '#22C55E',
      dark: '#16A34A',
    },
    warning: {
      light: '#FB923C',
      main: '#F97316',
      dark: '#EA580C',
    },
    danger: {
      light: '#F87171',
      main: '#EF4444',
      dark: '#DC2626',
    },
    info: {
      light: '#A78BFA',
      main: '#A855F7',
      dark: '#9333EA',
    },
    
    // Neutral colors
    slate: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    
    // Gradients
    gradients: {
      blue: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      green: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      purple: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
      orange: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      pink: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      indigo: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    },
    
    // Background
    background: '#F5F5F5',
    backgroundDark: '#0F172A',
    surface: '#FFFFFF',
    surfaceDark: '#1E293B',
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
};

export default theme;
