# 🖥️ GRADEAPP - APLICACIÓN DE ESCRITORIO

## 📋 Configuración Completada

Se ha configurado GradeApp para ejecutarse como una aplicación de escritorio usando Electron.

---

## 🚀 Cómo Ejecutar la Aplicación de Escritorio

### **Opción 1: Modo Desarrollo (Recomendado para pruebas)**

1. **Asegúrate de que el backend esté corriendo:**
   ```bash
   npm start
   ```
   (En la carpeta `backend`)

2. **En otra terminal, ejecuta:**
   ```bash
   npm run electron:dev
   ```

Esto abrirá:
- ✅ El servidor de desarrollo de Vite (puerto 5173)
- ✅ La aplicación de Electron con DevTools abierto
- ✅ Recarga automática cuando cambies código

---

### **Opción 2: Ejecutar Electron Solo (sin desarrollo)**

Si ya tienes Vite corriendo (`npm run dev`):

```bash
npm run electron
```

---

## 📦 Crear Instalador para Windows

### **Paso 1: Construir la Aplicación**

```bash
npm run build
```

### **Paso 2: Crear el Instalador**

```bash
npm run electron:build
```

Esto creará:
- ✅ **Instalador NSIS** (`.exe` con asistente de instalación)
- ✅ **Versión Portable** (`.exe` sin instalación)

**Ubicación:** `dist-electron/`

---

## 📁 Archivos Creados

### 1. `electron/main.cjs`
Archivo principal de Electron que:
- Crea la ventana de la aplicación
- Configura el tamaño (1400x900)
- Carga el logo principal
- Maneja desarrollo y producción

### 2. `electron-builder.json`
Configuración para crear el instalador:
- Nombre: GradeApp
- Icono: logo-principal.png
- Targets: NSIS + Portable
- Incluye backend automáticamente

### 3. `package.json` (actualizado)
Scripts nuevos:
- `electron` - Ejecutar Electron
- `electron:dev` - Desarrollo con recarga automática
- `electron:build` - Crear instalador

---

## ⚙️ Características de la Aplicación de Escritorio

### **Ventana Principal**
- 📐 Tamaño: 1400x900 px
- 📏 Tamaño mínimo: 1024x768 px
- 🎨 Icono: Logo principal (libros con flecha)
- 🔒 Seguridad: Context isolation activado
- 🎯 Auto-hide menu bar

### **Desarrollo**
- 🔄 Recarga automática
- 🛠️ DevTools abierto
- 🌐 Conecta a localhost:5173

### **Producción**
- 📦 Build optimizado
- 🚀 Sin DevTools
- 📂 Carga desde archivos locales

---

## 🎯 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (web) |
| `npm run electron` | Ejecutar Electron |
| `npm run electron:dev` | Desarrollo Electron + Vite |
| `npm run build` | Construir para producción |
| `npm run electron:build` | Crear instalador Windows |

---

## 📝 Notas Importantes

### **Backend**
El backend debe estar corriendo para que la aplicación funcione:
```bash
cd backend
npm start
```

### **Puerto**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### **Icono**
El icono se toma de: `/public/imagenes/logo-principal.png`

---

## 🔧 Solución de Problemas

### **Error: "electron no se reconoce"**
```bash
npm install
```

### **Error: "Cannot find module 'electron'"**
```bash
npm install electron --save-dev
```

### **La ventana no se abre**
1. Verifica que Vite esté corriendo en puerto 5173
2. Revisa la consola de Electron para errores
3. Asegúrate de que el backend esté corriendo

### **El build falla**
1. Ejecuta `npm run build` primero
2. Verifica que `dist/` exista
3. Revisa que `electron-builder.json` esté correcto

---

## 📊 Estructura de Archivos

```
grade-manager/
├── electron/
│   └── main.cjs              ← Archivo principal de Electron
├── dist/                     ← Build de producción (después de npm run build)
├── dist-electron/            ← Instaladores (después de electron:build)
│   ├── GradeApp-0.0.0-x64.exe        ← Instalador NSIS
│   └── GradeApp-0.0.0-portable.exe   ← Versión portable
├── electron-builder.json     ← Configuración del builder
└── package.json              ← Scripts actualizados
```

---

## 🎉 ¡Listo para Usar!

### **Para Desarrollo:**
```bash
# Terminal 1 (Backend)
cd backend
npm start

# Terminal 2 (Electron + Frontend)
npm run electron:dev
```

### **Para Crear Instalador:**
```bash
npm run electron:build
```

El instalador estará en: `dist-electron/GradeApp-0.0.0-x64.exe`

---

## 🚀 Próximos Pasos

1. ✅ **Probar en modo desarrollo** con `npm run electron:dev`
2. ✅ **Verificar que todo funcione** correctamente
3. ✅ **Crear el instalador** con `npm run electron:build`
4. ✅ **Distribuir** el archivo `.exe` a los usuarios

**¡GradeApp está listo para ejecutarse como aplicación de escritorio!** 🎉
