# 🗄️ Cómo Ver la Base de Datos SQLite

## 📍 Ubicación de la Base de Datos

Cuando ejecutas la aplicación con Tauri, la base de datos SQLite se crea en:

### **Windows:**
```
C:\Users\Admind\AppData\Roaming\com.tauri.dev\grade_manager.db
```

### **Ruta Completa:**
```
%APPDATA%\com.tauri.dev\grade_manager.db
```

---

## 🚀 Paso 1: Crear la Base de Datos

Primero necesitas ejecutar la aplicación en modo Tauri para que se cree la base de datos:

### **Detener el servidor actual:**
En la terminal donde está corriendo `npm run dev`, presiona `Ctrl+C`

### **Iniciar Tauri:**
```bash
cd c:\Users\Admind\OneDrive\Escritorio\calificaciiones\grade-manager
npm run tauri:dev
```

**Nota:** La primera vez puede tardar 2-3 minutos en compilar.

---

## 📊 Paso 2: Ver la Base de Datos

### **Opción 1: DB Browser for SQLite (Recomendado)**

#### **Descargar:**
1. Ve a: https://sqlitebrowser.org/dl/
2. Descarga "DB Browser for SQLite" para Windows
3. Instala el programa

#### **Abrir la Base de Datos:**
1. Abre DB Browser for SQLite
2. Click en "Open Database"
3. Navega a: `C:\Users\Admind\AppData\Roaming\com.tauri.dev\`
4. Selecciona `grade_manager.db`
5. ✅ Verás todas las tablas y datos

#### **Explorar:**
- **Browse Data**: Ver contenido de las tablas
- **Execute SQL**: Ejecutar consultas SQL
- **Database Structure**: Ver estructura de tablas

---

### **Opción 2: SQLite Viewer (Extensión VS Code)**

#### **Instalar Extensión:**
1. Abre VS Code
2. Ve a Extensions (Ctrl+Shift+X)
3. Busca "SQLite Viewer"
4. Instala la extensión

#### **Abrir Base de Datos:**
1. En VS Code, presiona `Ctrl+O`
2. Navega a: `C:\Users\Admind\AppData\Roaming\com.tauri.dev\grade_manager.db`
3. Abre el archivo
4. ✅ Verás las tablas en el explorador

---

### **Opción 3: Línea de Comandos (SQLite CLI)**

#### **Instalar SQLite:**
1. Descarga de: https://www.sqlite.org/download.html
2. Busca "Precompiled Binaries for Windows"
3. Descarga `sqlite-tools-win32-x86-*.zip`
4. Extrae `sqlite3.exe`

#### **Abrir Base de Datos:**
```bash
cd C:\Users\Admind\AppData\Roaming\com.tauri.dev
sqlite3 grade_manager.db
```

#### **Comandos Útiles:**
```sql
-- Ver todas las tablas
.tables

-- Ver estructura de una tabla
.schema students

-- Ver datos de estudiantes
SELECT * FROM students;

-- Ver datos de materias
SELECT * FROM subjects;

-- Ver inscripciones
SELECT * FROM enrollments;

-- Ver calificaciones
SELECT * FROM grades;

-- Contar registros
SELECT COUNT(*) FROM students;

-- Salir
.quit
```

---

### **Opción 4: Explorador de Archivos de Windows**

#### **Navegar a la Base de Datos:**
1. Presiona `Win+R`
2. Escribe: `%APPDATA%\com.tauri.dev`
3. Presiona Enter
4. Verás el archivo `grade_manager.db`

**Nota:** Para ver el contenido necesitas una de las opciones anteriores.

---

## 📋 Estructura de la Base de Datos

### **Tabla: students**
```sql
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    year INTEGER NOT NULL,
    enrollmentDate TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### **Tabla: subjects**
```sql
CREATE TABLE subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    credits TEXT,
    schedule TEXT,
    teacher TEXT,
    cycle TEXT DEFAULT 'First cycle',
    color TEXT,
    enrolled INTEGER DEFAULT 0,
    components TEXT,  -- JSON
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### **Tabla: enrollments**
```sql
CREATE TABLE enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER NOT NULL,
    studentName TEXT,
    subjectId INTEGER NOT NULL,
    subjectName TEXT,
    subjectCode TEXT,
    teacher TEXT,
    color TEXT,
    enrollmentDate TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
);
```

### **Tabla: grades**
```sql
CREATE TABLE grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollmentId INTEGER NOT NULL,
    studentId INTEGER NOT NULL,
    componentId INTEGER,
    componentName TEXT,
    type TEXT,
    name TEXT,
    score REAL,
    maxScore REAL DEFAULT 100,
    date TEXT,
    notes TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollmentId) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);
```

---

## 🔍 Consultas SQL Útiles

### **Ver Estudiantes con sus Inscripciones:**
```sql
SELECT 
    s.name AS estudiante,
    s.email,
    COUNT(e.id) AS total_materias
FROM students s
LEFT JOIN enrollments e ON s.id = e.studentId
GROUP BY s.id;
```

### **Ver Materias con Estudiantes Inscritos:**
```sql
SELECT 
    sub.name AS materia,
    sub.code,
    sub.teacher,
    COUNT(e.id) AS estudiantes_inscritos
FROM subjects sub
LEFT JOIN enrollments e ON sub.id = e.subjectId
GROUP BY sub.id;
```

### **Ver Calificaciones de un Estudiante:**
```sql
SELECT 
    s.name AS estudiante,
    sub.name AS materia,
    g.name AS evaluacion,
    g.score AS nota,
    g.type AS tipo
FROM grades g
JOIN enrollments e ON g.enrollmentId = e.id
JOIN students s ON e.studentId = s.id
JOIN subjects sub ON e.subjectId = sub.id
WHERE s.id = 1;
```

### **Promedio por Estudiante:**
```sql
SELECT 
    s.name AS estudiante,
    AVG(g.score) AS promedio
FROM students s
JOIN enrollments e ON s.id = e.studentId
JOIN grades g ON e.id = g.enrollmentId
GROUP BY s.id;
```

---

## 🛠️ Poblar la Base de Datos con Datos de Ejemplo

Si la base de datos está vacía, puedes poblarla:

### **Opción 1: Desde la Aplicación Tauri**

1. Ejecuta `npm run tauri:dev`
2. Abre DevTools en la ventana de Tauri (F12)
3. Ve a Console
4. Ejecuta:

```javascript
import { populateDatabase } from './utils/populateDatabase';
const result = await populateDatabase();
console.log(result);
```

### **Opción 2: Script SQL Directo**

Crea un archivo `populate.sql`:

```sql
-- Insertar estudiantes
INSERT INTO students (matricula, name, email, phone, year, enrollmentDate) VALUES
('GE20250001', 'Juan Pérez', 'juan.perez@email.com', '809-555-0001', 2025, '2024-01-15'),
('GE20250002', 'María González', 'maria.gonzalez@email.com', '809-555-0002', 2025, '2024-01-15'),
('GE20250003', 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '809-555-0003', 2025, '2024-01-20');

-- Insertar materias
INSERT INTO subjects (name, code, credits, schedule, teacher, cycle, color, components) VALUES
('Matemáticas Avanzadas', 'MAT101', '4', 'Lun-Mié-Vie 8:00-10:00', 'Dr. Roberto Fernández', 'First cycle', '#3B82F6, #2563EB', '[{"id":1,"name":"Tareas","type":"numeric","weight":30,"maxScore":100}]'),
('Historia Universal', 'HIS201', '3', 'Mar-Jue 10:00-12:00', 'Lic. Patricia Morales', 'First cycle', '#22C55E, #16A34A', '[{"id":1,"name":"Investigaciones","type":"numeric","weight":35,"maxScore":100}]');

-- Insertar inscripciones
INSERT INTO enrollments (studentId, studentName, subjectId, subjectName, subjectCode, teacher, color, enrollmentDate) VALUES
(1, 'Juan Pérez', 1, 'Matemáticas Avanzadas', 'MAT101', 'Dr. Roberto Fernández', '#3B82F6, #2563EB', '2024-01-15'),
(2, 'María González', 1, 'Matemáticas Avanzadas', 'MAT101', 'Dr. Roberto Fernández', '#3B82F6, #2563EB', '2024-01-15');

-- Insertar calificaciones
INSERT INTO grades (enrollmentId, studentId, componentId, componentName, type, name, score, maxScore, date) VALUES
(1, 1, 1, 'Tareas', 'assignment', 'Tarea 1', 95, 100, '2024-09-15'),
(1, 1, 1, 'Tareas', 'assignment', 'Tarea 2', 88, 100, '2024-09-22');
```

Ejecutar:
```bash
sqlite3 grade_manager.db < populate.sql
```

---

## 📊 Exportar Datos

### **Exportar a CSV:**
```sql
.mode csv
.output students.csv
SELECT * FROM students;
.output stdout
```

### **Exportar a JSON:**
```sql
.mode json
.output students.json
SELECT * FROM students;
.output stdout
```

### **Backup Completo:**
```bash
sqlite3 grade_manager.db .dump > backup.sql
```

---

## 🔄 Estado Actual

**Actualmente estás usando:**
- ✅ Navegador con `npm run dev`
- ✅ localStorage (no SQLite)
- ✅ Datos en: `localStorage` del navegador

**Para usar SQLite necesitas:**
1. Detener `npm run dev`
2. Ejecutar `npm run tauri:dev`
3. La base de datos se creará automáticamente
4. Usar cualquiera de las opciones anteriores para verla

---

## 🎯 Resumen Rápido

### **Para Ver la Base de Datos:**

1. **Ejecutar Tauri:**
   ```bash
   npm run tauri:dev
   ```

2. **Ubicación:**
   ```
   C:\Users\Admind\AppData\Roaming\com.tauri.dev\grade_manager.db
   ```

3. **Herramienta Recomendada:**
   - DB Browser for SQLite: https://sqlitebrowser.org/dl/

4. **Poblar Datos:**
   - Desde la consola de Tauri con `populateDatabase()`

---

**¿Quieres que ejecute Tauri ahora para crear la base de datos?** 🗄️
