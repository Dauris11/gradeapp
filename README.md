# 🎓 GradePro - Sistema de Gestión Académica

Sistema moderno de gestión académica con interfaz premium, diseñado para instituciones educativas que buscan digitalizar y optimizar el control de calificaciones, estudiantes y reportes.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

##  Características Principales

###  Gestión Académica Completa
- **Dashboard Interactivo**: Visualización en tiempo real de estadísticas clave
- **Gestión de Estudiantes**: CRUD completo con información detallada
- **Gestión de Materias**: Control de asignaturas, créditos y componentes de evaluación
- **Sistema de Inscripciones**: Vinculación estudiante-materia con seguimiento
- **Calificaciones Avanzadas**: Registro de notas por tipo (tareas, exámenes, proyectos)
- **Cálculo Automático**: Promedios ponderados y acumulados en tiempo real

###  Comunicación Integrada
- **Reportes PDF**: Generación automática de boletines individuales y consolidados
- **WhatsApp Gratuito**: Envío de reportes vía WhatsApp Web (sin costos)
- **Email Masivo**: Distribución de reportes por correo electrónico
- **Notificaciones**: Sistema de alertas en tiempo real

###  Diseño Premium
- **Glassmorphism**: Efectos modernos de vidrio esmerilado
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Responsive**: Adaptable a cualquier dispositivo
- **Tema Personalizable**: Paleta de colores profesional

## Tecnologías

### Frontend
- **React 18** - Framework de UI
- **Vite** - Build tool ultrarrápido
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animaciones
- **React Router** - Navegación
- **Lucide React** - Iconografía moderna

### Backend
- **Node.js + Express** - Servidor REST API
- **SQLite** - Base de datos embebida
- **Better-SQLite3** - Driver de alto rendimiento

### Desktop
- **Tauri** - Aplicación nativa multiplataforma
- **Rust** - Backend de alto rendimiento

### Servicios
- **WhatsApp Web.js** - Integración WhatsApp gratuita
- **jsPDF + AutoTable** - Generación de PDFs
- **SendGrid** - Servicio de emails (opcional)

##  Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Rust (para build de Tauri)

### Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/Dauris11/gradeapp.git
cd gradeapp

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..
```

##  Uso

### Modo Desarrollo Web

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

Accede a `http://localhost:5173`

### Modo Desktop (Tauri)

```bash
# Desarrollo
npm run tauri:dev

# Build para producción
npm run tauri:build
```

##  Credenciales por Defecto

- **Usuario**: `admin`
- **Contraseña**: `admin123`

 **Importante**: Cambia estas credenciales en producción.

##  Configuración de WhatsApp

1. Inicia el backend: `cd backend && npm start`
2. Escanea el código QR que aparece en la terminal
3. Alternativamente, usa el modal de WhatsApp en la app
4. Una vez conectado, puedes enviar reportes masivos

##  Configuración de Email (Opcional)

Crea un archivo `.env` en la carpeta `backend`:

```env
SENDGRID_API_KEY=tu_api_key_aqui
FROM_EMAIL=noreply@tudominio.com
FROM_NAME=Tu Institución
REPLY_TO_EMAIL=soporte@tudominio.com
```

##  Estructura del Proyecto

```
grade-manager/
├── src/                    # Código fuente React
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios y APIs
│   └── theme.js           # Configuración de tema
├── backend/               # Servidor Node.js
│   ├── server.js          # Servidor Express
│   ├── database.js        # Configuración SQLite
│   └── whatsappServiceFree.js  # Servicio WhatsApp
├── src-tauri/            # Configuración Tauri
├── public/               # Archivos estáticos
└── electron-main/        # Configuración Electron (legacy)
```

##  Capturas de Pantalla

### Dashboard
Panel principal con estadísticas en tiempo real y accesos rápidos.

### Gestión de Notas
Interfaz intuitiva para registro y seguimiento de calificaciones.

### Reportes
Generación automática de PDFs con diseño profesional.

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Vite dev server
npm run tauri:dev        # Tauri desktop app

# Build
npm run build            # Build producción web
npm run tauri:build      # Build desktop app

# Backend
cd backend && npm start  # Iniciar servidor
```

##  Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

##  Autor

**Dauris Reyes**
- GitHub: [@Dauris11](https://github.com/Dauris11)



---


"# gradeapp" 
