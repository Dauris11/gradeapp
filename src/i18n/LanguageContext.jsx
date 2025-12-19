import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        // Cargar idioma guardado o usar español por defecto
        const savedLanguage = localStorage.getItem('appLanguage');
        return savedLanguage || 'es';
    });

    useEffect(() => {
        // Guardar idioma seleccionado
        localStorage.setItem('appLanguage', language);
    }, [language]);

    const changeLanguage = (newLanguage) => {
        if (translations[newLanguage]) {
            setLanguage(newLanguage);
        }
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Retornar la key si no se encuentra la traducción
            }
        }

        return value || key;
    };

    const value = {
        language,
        changeLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
