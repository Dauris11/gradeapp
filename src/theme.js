// Theme configuration for styled-components
// Soporta modo claro y oscuro

// Tema Claro (Light Mode)
export const lightTheme = {
  mode: 'light',
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
};

// Tema Oscuro (Dark Mode) - Tonos morado y azul elegantes
export const darkTheme = {
  mode: 'dark',
  colors: {
    // Primary - Purple/Indigo más vibrante para modo oscuro
    primary: {
      light: '#A78BFA',
      main: '#8B5CF6',
      dark: '#7C3AED',
      contrast: '#FFFFFF'
    },
    // Secondary - Blue más suave
    secondary: {
      light: '#60A5FA',
      main: '#3B82F6',
      dark: '#2563EB',
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
    
    // Dark Mode Palette - Mantiene la misma estructura que light mode
    slate: {
      50: '#0F0D1A',   // Fondo más oscuro (equivalente a 950 en light)
      100: '#1A1825',  // Muy oscuro con tinte morado
      200: '#2D2845',  // Oscuro morado para bordes
      300: '#3D3558',  // Morado grisáceo para elementos deshabilitados
      400: '#6B6B8D',  // Gris morado medio para texto muted
      500: '#9090B0',  // Gris morado para texto secundario
      600: '#B4B4D4',  // Claro morado para texto normal
      700: '#D4D4E8',  // Muy claro para texto importante
      800: '#E8E8F4',  // Casi blanco para títulos
      900: '#F4F4FA',  // Blanco para texto principal
      950: '#FAFAFF',  // Blanco puro para máximo contraste
    },
    
    // Gradients para modo oscuro
    gradients: {
      primary: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
      secondary: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      danger: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      purple: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
      surface: 'linear-gradient(135deg, #1E1B2E 0%, #252238 100%)',
      glass: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
    },
    
    // UI Elements para modo oscuro
    background: '#0F0D1A',      // Fondo principal muy oscuro con tinte morado
    surface: '#1A1825',         // Superficie oscura con tinte morado (más claro que background)
    border: '#2D2845',          // Bordes sutiles morado oscuro
    text: {
      primary: '#F4F4FA',       // Texto principal casi blanco (slate 900)
      secondary: '#B4B4D4',     // Texto secundario gris morado claro (slate 600)
      muted: '#9090B0',         // Texto apagado gris morado (slate 500)
      inverse: '#0F0D1A'        // Texto inverso (oscuro)
    },
    
    glass: {
      background: 'rgba(26, 24, 37, 0.7)',
      border: 'rgba(139, 92, 246, 0.2)',
      shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
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
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    base: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.6), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.7)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)',
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
    glow: '0 0 20px rgba(139, 92, 246, 0.3)'
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
    background: rgba(26, 24, 37, 0.7);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(139, 92, 246, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
  `,
};

// Exportar tema por defecto (claro)
export const theme = lightTheme;

export default theme;
