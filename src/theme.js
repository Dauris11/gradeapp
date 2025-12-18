// Theme configuration for styled-components
export const theme = {
  colors: {
    // Primary - Deep Indigo/Blue
    primary: {
      light: '#818CF8',
      main: '#6366F1',
      dark: '#4F46E5',
      contrast: '#FFFFFF'
    },
    // Secondary - Sleek Teal/Emerald
    secondary: {
      light: '#2DD4BF',
      main: '#14B8A6',
      dark: '#0D9488',
      contrast: '#FFFFFF'
    },
    // Accents
    success: {
      light: '#34D399',
      main: '#10B981',
      dark: '#059669',
    },
    warning: {
      light: '#FBBF24',
      main: '#F59E0B',
      dark: '#D97706',
    },
    danger: {
      light: '#FB7185',
      main: '#F43F5E',
      dark: '#E11D48',
    },
    info: {
      light: '#60A5FA',
      main: '#3B82F6',
      dark: '#2563EB',
    },
    
    // Modern Neutral Palette (Slate)
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
      950: '#020617',
    },
    
    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
      secondary: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      danger: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      purple: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
      surface: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%)',
      dark: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    },
    
    // UI Elements
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      muted: '#94A3B8',
      inverse: '#FFFFFF'
    },
    
    glass: {
      background: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(255, 255, 255, 0.2)',
      shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    gutter: 'clamp(1rem, 5vw, 2rem)'
  },
  
  borderRadius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
  },
  
  typography: {
    fontFamily: '"Outfit", "Inter", system-ui, -apple-system, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    }
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  glassmorphism: `
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(10px) saturate(120%);
    -webkit-backdrop-filter: blur(10px) saturate(120%);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 20px 0 rgba(31, 38, 135, 0.05);
  `,
  glassmorphismDark: `
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  `
};

export default theme;
