# 📚 GradeApp - Sistema de Gestión de Calificaciones

<div align="center">
  <img src="public/imagenes/logo-principal.png" alt="GradeApp Logo" width="200"/>
  
  ### Sistema integral de gestión académica para instituciones educativas modernas
  
  [![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
  [![SQLite](https://img.shields.io/badge/SQLite-3.x-lightgrey.svg)](https://www.sqlite.org/)
  [![Electron](https://img.shields.io/badge/Electron-33.x-purple.svg)](https://www.electronjs.org/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

---

## 🌟 Características Principales

- ✅ **Gestión de Estudiantes** - CRUD completo con búsqueda avanzada
- ✅ **Gestión de Materias** - Configuración flexible de componentes de evaluación
- ✅ **Inscripciones** - Sistema de matriculación por materia
- ✅ **Calificaciones** - Registro y cálculo automático de notas
- ✅ **Reportes PDF** - Generación de reportes individuales y consolidados
- ✅ **Dashboard Interactivo** - Estadísticas en tiempo real
- ✅ **Calendario Académico** - Visualización de eventos y actividades
- ✅ **Aplicación de Escritorio** - Versión nativa con Electron
- ✅ **Responsive Design** - Funciona en móviles, tablets y desktop

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool ultrarrápido
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animaciones fluidas
- **React Router** - Navegación SPA
- **Lucide React** - Iconos modernos

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **SQLite** - Base de datos embebida
- **bcryptjs** - Encriptación de contraseñas

### Desktop
- **Electron** - Aplicación de escritorio
- **Electron Builder** - Creación de instaladores

### PDF & Reports
- **jsPDF** - Generación de PDFs
- **jsPDF-AutoTable** - Tablas en PDFs

---

## 📋 Requisitos Previos

- **Node.js** 18.x o superior
- **npm** 9.x o superior
- **Git** (para clonar el repositorio)

---

## 🔧 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/TU_USUARIO/grade-manager.git
cd grade-manager
```

### 2. Instalar Dependencias

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
cd ..
```

---

## 🎯 Uso

### Modo Desarrollo (Web)

#### Terminal 1 - Backend
```bash
cd backend
npm start
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

---

### Modo Desktop (Electron)

#### Desarrollo
```bash
# Asegúrate de que el backend esté corriendo
cd backend
npm start

# En otra terminal
npm run electron:dev
```

#### Crear Instalador Windows
```bash
npm run build
npm run electron:build
```

El instalador estará en: `dist-electron/GradeApp-0.0.0-x64.exe`

---

## 📁 Estructura del Proyecto

```
grade-manager/
├── backend/                    # Servidor Node.js/Express
│   ├── server.js              # Punto de entrada del backend
│   ├── routes/                # Rutas de la API
│   ├── database.js            # Configuración de SQLite
│   └── grade_manager.db       # Base de datos SQLite
├── electron/                   # Configuración de Electron
│   └── main.cjs               # Proceso principal de Electron
├── public/                     # Archivos estáticos
│   └── imagenes/              # Imágenes y logos
├── src/                        # Código fuente del frontend
│   ├── components/            # Componentes reutilizables
│   ├── pages/                 # Páginas de la aplicación
│   ├── services/              # Servicios (API, PDF, Email)
│   ├── theme.js               # Configuración de tema
│   ├── App.jsx                # Componente principal
│   └── main.jsx               # Punto de entrada
├── .gitignore                 # Archivos ignorados por Git
├── electron-builder.json      # Configuración de Electron Builder
├── package.json               # Dependencias y scripts
├── vite.config.js             # Configuración de Vite
└── README.md                  # Este archivo
```

---

## 🎨 Capturas de Pantalla

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Gestión de Estudiantes
![Estudiantes](docs/screenshots/students.png)

### Gestión de Materias
![Materias](docs/screenshots/subjects.png)

### Reportes PDF
![Reportes](docs/screenshots/reports.png)

---

## 📊 API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión

### Estudiantes
- `GET /api/students` - Listar estudiantes
- `POST /api/students` - Crear estudiante
- `PUT /api/students/:id` - Actualizar estudiante
- `DELETE /api/students/:id` - Eliminar estudiante

### Materias
- `GET /api/subjects` - Listar materias
- `POST /api/subjects` - Crear materia
- `PUT /api/subjects/:id` - Actualizar materia
- `DELETE /api/subjects/:id` - Eliminar materia

### Inscripciones
- `GET /api/enrollments` - Listar inscripciones
- `POST /api/enrollments` - Crear inscripción
- `DELETE /api/enrollments/:id` - Eliminar inscripción

### Calificaciones
- `GET /api/grades` - Listar calificaciones
- `POST /api/grades` - Crear calificación
- `PUT /api/grades/:id` - Actualizar calificación
- `DELETE /api/grades/:id` - Eliminar calificación

---

## 🔐 Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Validación de datos en backend
- ✅ Context isolation en Electron
- ✅ Prevención de inyección SQL

---

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (Vite) |
| `npm run build` | Construye para producción |
| `npm run preview` | Vista previa del build |
| `npm run electron` | Ejecuta Electron |
| `npm run electron:dev` | Desarrollo con Electron |
| `npm run electron:build` | Crea instalador Windows |

---

## 🐛 Solución de Problemas

### Error: "Port 5173 already in use"
```bash
# Mata el proceso en el puerto 5173
npx kill-port 5173
```

### Error: "Cannot find module"
```bash
# Reinstala dependencias
rm -rf node_modules
npm install
```

### Base de datos corrupta
```bash
# Elimina la base de datos y reinicia el backend
cd backend
rm grade_manager.db
npm start
```

---

## 📝 Roadmap

- [ ] Sistema de notificaciones por email
- [ ] Exportación a Excel
- [ ] Gráficos de rendimiento
- [ ] Modo oscuro
- [ ] Multi-idioma (i18n)
- [ ] Aplicación móvil (React Native)
- [ ] Integración con Google Classroom

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

---

## 🙏 Agradecimientos

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Electron](https://www.electronjs.org/)
- [Styled Components](https://styled-components.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">
  <p>Hecho con ❤️ para la educación</p>
  <p>⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐</p>
</div>
