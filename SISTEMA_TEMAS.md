# 🎨 Sistema de Temas - Modo Claro y Oscuro

## ✅ Implementación Completada

Se ha implementado un sistema completo de temas con soporte para modo claro y oscuro en la aplicación GradeApp.

## 🌟 Características

### Modo Claro
- Diseño limpio y brillante
- Fondo blanco con tonos slate suaves
- Ideal para ambientes bien iluminados
- Colores vibrantes: Indigo (#6366F1) y Teal (#14B8A6)

### Modo Oscuro
- Elegante con tonos morado y azul
- Fondo oscuro (#0F0D1A) con matices morados
- Tonos principales:
  - **Morado**: #8B5CF6 (Purple)
  - **Azul**: #3B82F6 (Blue)
- Diseño no saturado, elegante y profesional
- Perfecto para uso nocturno o ambientes con poca luz

## 🎯 Cómo Usar

### Cambiar el Tema

1. Haz clic en el ícono de **Configuración** (⚙️) en la barra superior
2. Selecciona entre:
   - **☀️ Claro**: Diseño limpio y brillante
   - **🌙 Oscuro**: Elegante con tonos morado y azul
3. El tema se aplicará inmediatamente con una transición suave
4. Tu preferencia se guarda automáticamente

### Persistencia

- El tema seleccionado se guarda en `localStorage`
- Se mantiene entre sesiones
- Se aplica automáticamente al volver a la aplicación

## 🛠️ Archivos Creados/Modificados

### Nuevos Archivos

1. **`src/theme.js`**
   - Definición completa de `lightTheme` y `darkTheme`
   - Paleta de colores para cada modo
   - Gradientes, sombras y estilos

2. **`src/contexts/ThemeContext.jsx`**
   - Contexto de React para manejar el tema
   - Hook `useTheme()` para acceder al tema actual
   - Funciones `toggleTheme()` y `setTheme(mode)`

3. **`src/components/SettingsModal.jsx`**
   - Modal de configuración con selector de tema
   - Vista previa de colores
   - Diseño elegante y responsive

### Archivos Modificados

4. **`src/App.jsx`**
   - Integración del `ThemeProvider`
   - Envuelve toda la aplicación

5. **`src/GlobalStyles.js`**
   - Transiciones suaves entre temas
   - Soporte para `color-scheme`

6. **`src/components/Layout.jsx`**
   - Integración del modal de configuración
   - Actualización de colores para soportar tema oscuro
   - Botón de configuración en la barra superior

## 🎨 Paleta de Colores

### Modo Claro
```javascript
{
  primary: '#6366F1',      // Indigo
  secondary: '#14B8A6',    // Teal
  background: '#F8FAFC',   // Slate 50
  surface: '#FFFFFF',      // White
  text: '#0F172A'          // Slate 900
}
```

### Modo Oscuro
```javascript
{
  primary: '#8B5CF6',      // Purple
  secondary: '#3B82F6',    // Blue
  background: '#0F0D1A',   // Muy oscuro con tinte morado
  surface: '#1E1B2E',      // Oscuro con tinte morado
  text: '#F4F4FA'          // Casi blanco
}
```

## 💻 Uso en Componentes

### Hook useTheme

```javascript
import { useTheme } from '../contexts/ThemeContext';

function MiComponente() {
  const { themeMode, isDark, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Tema actual: {themeMode}</p>
      <p>¿Es oscuro?: {isDark ? 'Sí' : 'No'}</p>
      
      {/* Cambiar tema */}
      <button onClick={toggleTheme}>Alternar Tema</button>
      <button onClick={() => setTheme('dark')}>Modo Oscuro</button>
      <button onClick={() => setTheme('light')}>Modo Claro</button>
    </div>
  );
}
```

### Acceder a Colores del Tema

```javascript
import styled from 'styled-components';

const MiComponente = styled.div`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border};
`;
```

## 🌈 Transiciones Suaves

Todos los elementos tienen transiciones suaves al cambiar de tema:
- Duración: 200ms
- Propiedades: `background-color`, `color`, `border-color`
- Curva: `cubic-bezier(0.4, 0, 0.2, 1)`

## 📱 Responsive

El modal de configuración es completamente responsive:
- Desktop: Modal centrado
- Tablet: Modal adaptado
- Mobile: Modal de ancho completo

## 🔧 Personalización

### Agregar Nuevos Colores

Edita `src/theme.js`:

```javascript
export const darkTheme = {
  colors: {
    // Agregar nuevo color
    custom: {
      light: '#...',
      main: '#...',
      dark: '#...'
    }
  }
};
```

### Crear Nuevos Temas

1. Define un nuevo tema en `src/theme.js`
2. Actualiza `ThemeContext.jsx` para incluirlo
3. Agrega la opción en `SettingsModal.jsx`

## ✨ Características Técnicas

- ✅ Persistencia en localStorage
- ✅ Transiciones CSS suaves
- ✅ Soporte para `prefers-color-scheme` (futuro)
- ✅ TypeScript-ready (tipos inferidos)
- ✅ Glassmorphism adaptado a cada tema
- ✅ Sombras optimizadas por tema
- ✅ Accesibilidad mejorada

## 🎯 Próximas Mejoras (Opcional)

- [ ] Detección automática del tema del sistema
- [ ] Más variantes de tema (High Contrast, etc.)
- [ ] Personalización de colores por usuario
- [ ] Exportar/Importar temas personalizados

## 📚 Recursos

- [Styled Components Theming](https://styled-components.com/docs/advanced#theming)
- [React Context API](https://react.dev/reference/react/useContext)
- [Color Palette Generator](https://coolors.co/)

---

**Estado:** ✅ Completamente funcional y listo para usar

**Última actualización:** Diciembre 2025
