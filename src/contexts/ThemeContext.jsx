import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../theme';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Obtener tema guardado o usar 'light' por defecto
    const [themeMode, setThemeMode] = useState(() => {
        const savedTheme = localStorage.getItem('themeMode');
        return savedTheme || 'light';
    });

    // Aplicar el tema correspondiente
    const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

    // Guardar preferencia en localStorage
    useEffect(() => {
        localStorage.setItem('themeMode', themeMode);

        // Actualizar el atributo data-theme en el body para transiciones suaves
        document.body.setAttribute('data-theme', themeMode);
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setTheme = (mode) => {
        if (mode === 'light' || mode === 'dark') {
            setThemeMode(mode);
        }
    };

    const value = {
        themeMode,
        theme: currentTheme,
        toggleTheme,
        setTheme,
        isDark: themeMode === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            <StyledThemeProvider theme={currentTheme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
