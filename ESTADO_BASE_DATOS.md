# 📊 Estado Actual de la Base de Datos

## 🔍 Situación Actual

**Base de Datos SQLite:** ❌ No existe todavía
**Ubicación esperada:** `C:\Users\Admind\AppData\Roaming\com.tauri.dev\grade_manager.db`
**Estado:** Archivo no encontrado

---

## 📝 ¿Por Qué No Existe?

La base de datos SQLite **solo se crea cuando ejecutas la aplicación en modo Tauri**.

### **Lo que has estado usando:**
- ✅ Navegador web (`npm run dev`)
- ✅ localStorage (almacenamiento del navegador)
- ✅ Datos en: Navegador Chrome/Edge

### **Lo que necesitas para SQLite:**
- 🔄 Aplicación Tauri (`npm run tauri:dev`)
- 🗄️ Base de datos SQLite real
- 💾 Datos en: Archivo `.db` en AppData

---

## 🎯 Opciones Disponibles

### **Opción 1: Continuar con localStorage (Actual)**

**Ventajas:**
- ✅ Ya funciona
- ✅ Desarrollo rápido
- ✅ Hot reload instantáneo
- ✅ No requiere compilación

**Desventajas:**
- ❌ Limitado a ~10MB
- ❌ Datos solo en el navegador
- ❌ Se pierden al limpiar caché
- ❌ No es una aplicación nativa

**Comando:**
```bash
npm run dev
```

---

### **Opción 2: Usar Tauri con SQLite (Recomendado para Producción)**

**Ventajas:**
- ✅ Base de datos real
- ✅ Capacidad ilimitada
- ✅ Aplicación nativa de escritorio
- ✅ Datos persistentes
- ✅ Instalador profesional

**Desventajas:**
- ⏱️ Primera compilación tarda ~2-3 minutos
- ⏱️ Cambios en Rust requieren recompilación

**Comando:**
```bash
npm run tauri:dev
```

---

## 🚀 Cómo Crear la Base de Datos SQLite

### **Paso 1: Ejecutar Tauri**

```bash
cd c:\Users\Admind\OneDrive\Escritorio\calificaciiones\grade-manager
npm run tauri:dev
```

**Qué pasará:**
1. Vite compilará el frontend (~10 segundos)
2. Rust compilará el backend (~30 segundos si ya compilaste antes)
3. Se abrirá una ventana nativa
4. **Se creará automáticamente** `grade_manager.db`

### **Paso 2: Verificar que se Creó**

```powershell
Test-Path "$env:APPDATA\com.tauri.dev\grade_manager.db"
# Debería retornar: True
```

### **Paso 3: Ver la Base de Datos**

#### **Opción A: DB Browser for SQLite**
1. Descarga: https://sqlitebrowser.org/dl/
2. Instala
3. Abre la base de datos en:
   ```
   C:\Users\Admind\AppData\Roaming\com.tauri.dev\grade_manager.db
   ```

#### **Opción B: VS Code con SQLite Viewer**
1. Instala extensión "SQLite Viewer"
2. Abre el archivo `.db`
3. Explora las tablas

#### **Opción C: Línea de Comandos**
```bash
cd C:\Users\Admind\AppData\Roaming\com.tauri.dev
sqlite3 grade_manager.db
.tables
SELECT * FROM students;
```

---

## 📊 Poblar la Base de Datos con Datos

Una vez que la base de datos esté creada, puedes poblarla:

### **Método 1: Desde la Aplicación Tauri**

1. Ejecuta `npm run tauri:dev`
2. Abre DevTools en la ventana de Tauri (F12)
3. Ve a Console
4. Ejecuta:

```javascript
import { populateDatabase } from './utils/populateDatabase';
const result = await populateDatabase();
console.log(result);
```

Esto creará:
- 8 estudiantes
- 6 materias
- 24-32 inscripciones
- 200+ calificaciones

### **Método 2: Script SQL**

Crea un archivo `seed.sql` y ejecútalo:

```bash
sqlite3 grade_manager.db < seed.sql
```

---

## 🔄 Comparación: localStorage vs SQLite

| Característica | localStorage | SQLite (Tauri) |
|----------------|--------------|----------------|
| **Ubicación** | Navegador | Archivo .db |
| **Capacidad** | ~10 MB | Ilimitada |
| **Persistencia** | Se pierde al limpiar caché | Permanente |
| **Tipo** | Aplicación web | Aplicación nativa |
| **Velocidad** | Muy rápida | Rápida |
| **Instalador** | No | Sí (~3-5 MB) |
| **Desarrollo** | Instantáneo | Requiere compilación |
| **Producción** | No recomendado | ✅ Recomendado |

---

## 📁 Estructura de Archivos

### **localStorage (Actual):**
```
Navegador Chrome/Edge
└── localStorage
    ├── students: [...]
    ├── subjects: [...]
    ├── enrollments: [...]
    └── grades: [...]
```

### **SQLite (Tauri):**
```
C:\Users\Admind\AppData\Roaming\com.tauri.dev\
└── grade_manager.db
    ├── students (tabla)
    ├── subjects (tabla)
    ├── enrollments (tabla)
    └── grades (tabla)
```

---

## 🎯 Recomendación

### **Para Desarrollo:**
- Usa `npm run dev` (localStorage)
- Es más rápido y cómodo

### **Para Probar Tauri:**
- Usa `npm run tauri:dev` (SQLite)
- Verás cómo funciona la aplicación nativa

### **Para Producción:**
- Usa `npm run tauri:build` (SQLite)
- Crea instalador para distribuir

---

## 📝 Comandos Útiles

### **Ver si existe la BD:**
```powershell
Test-Path "$env:APPDATA\com.tauri.dev\grade_manager.db"
```

### **Abrir carpeta de la BD:**
```powershell
explorer "$env:APPDATA\com.tauri.dev"
```

### **Ver tamaño de la BD:**
```powershell
(Get-Item "$env:APPDATA\com.tauri.dev\grade_manager.db").Length / 1KB
```

### **Eliminar la BD (empezar de cero):**
```powershell
Remove-Item "$env:APPDATA\com.tauri.dev\grade_manager.db"
```

---

## ✅ Próximos Pasos

### **Si quieres ver la base de datos SQLite:**

1. **Ejecuta:**
   ```bash
   npm run tauri:dev
   ```

2. **Espera:** 2-3 minutos (primera vez)

3. **Verifica:**
   ```powershell
   Test-Path "$env:APPDATA\com.tauri.dev\grade_manager.db"
   ```

4. **Abre con:** DB Browser for SQLite

### **Si prefieres seguir con localStorage:**

1. **Ejecuta:**
   ```bash
   npm run dev
   ```

2. **Continúa desarrollando** normalmente

3. **Los datos están en:** localStorage del navegador

---

**Estado Actual:** ✅ localStorage funcionando
**Base de Datos SQLite:** ❌ No creada (requiere ejecutar Tauri)
**Recomendación:** Continúa con localStorage para desarrollo, usa Tauri cuando quieras probar la versión nativa
