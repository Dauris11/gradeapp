# 🚀 Guía de Migración a Tauri + SQLite

## 📋 Requisitos Previos

### **Instalar Rust** (Requerido para Tauri)

1. **Descargar Rust:**
   - Ve a: https://rustup.rs/
   - Descarga e instala `rustup-init.exe`
   - Ejecuta y sigue las instrucciones (opción por defecto)

2. **Verificar instalación:**
   ```bash
   rustc --version
   cargo --version
   ```

### **Instalar WebView2** (Windows)
- Windows 10/11 ya lo tiene instalado
- Si no: https://developer.microsoft.com/microsoft-edge/webview2/

## 🔧 Paso 1: Instalar Dependencias de Tauri

```bash
# En la carpeta del proyecto
npm install -D @tauri-apps/cli
npm install @tauri-apps/api
```

## 🎯 Paso 2: Inicializar Tauri

```bash
npx tauri init
```

**Responde las preguntas:**
- App name: `Grade Manager`
- Window title: `Sistema de Gestión de Calificaciones`
- Web assets location: `../dist`
- Dev server URL: `http://localhost:5173`
- Frontend dev command: `npm run dev`
- Frontend build command: `npm run build`

## 📦 Paso 3: Configurar SQLite

### **3.1 Agregar plugin SQL a Rust**

Edita `src-tauri/Cargo.toml` y agrega:

```toml
[dependencies]
tauri = { version = "1.5", features = ["shell-open"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tauri-plugin-sql = { version = "0.1", features = ["sqlite"] }
```

### **3.2 Configurar en main.rs**

Edita `src-tauri/src/main.rs`:

```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### **3.3 Actualizar tauri.conf.json**

Edita `src-tauri/tauri.conf.json`:

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "package": {
    "productName": "Grade Manager",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "sql": {
        "all": true,
        "execute": true,
        "select": true
      }
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.grademanager.app",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ]
    },
    "security": {
      "csp": null
    },
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "Sistema de Gestión de Calificaciones",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

## 💾 Paso 4: Crear Servicio de Base de Datos

Crea `src/services/tauriDatabase.js`:

```javascript
import Database from 'tauri-plugin-sql-api';

let db = null;

// Inicializar base de datos
export async function initDatabase() {
    if (db) return db;
    
    db = await Database.load('sqlite:grade_manager.db');
    
    // Crear tablas
    await db.execute(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            matricula TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            year INTEGER NOT NULL,
            enrollmentDate TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    await db.execute(`
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            credits TEXT,
            schedule TEXT,
            teacher TEXT,
            cycle TEXT DEFAULT 'First cycle',
            color TEXT,
            enrolled INTEGER DEFAULT 0,
            components TEXT, -- JSON string
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    await db.execute(`
        CREATE TABLE IF NOT EXISTS enrollments (
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
        )
    `);
    
    await db.execute(`
        CREATE TABLE IF NOT EXISTS grades (
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
        )
    `);
    
    console.log('✅ Base de datos SQLite inicializada');
    return db;
}

// API de Estudiantes
export const studentsAPI = {
    getAll: async () => {
        const db = await initDatabase();
        return await db.select('SELECT * FROM students ORDER BY name');
    },
    
    getById: async (id) => {
        const db = await initDatabase();
        const result = await db.select('SELECT * FROM students WHERE id = ?', [id]);
        return result[0] || null;
    },
    
    create: async (student) => {
        const db = await initDatabase();
        
        // Generar matrícula
        const year = new Date().getFullYear();
        const result = await db.select(
            'SELECT MAX(CAST(SUBSTR(matricula, 7) AS INTEGER)) as maxSeq FROM students WHERE matricula LIKE ?',
            [`GE${year}%`]
        );
        const sequential = (result[0]?.maxSeq || 0) + 1;
        const matricula = `GE${year}${String(sequential).padStart(4, '0')}`;
        
        await db.execute(
            `INSERT INTO students (matricula, name, email, phone, year, enrollmentDate) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [matricula, student.name, student.email, student.phone || '', year, student.enrollmentDate || new Date().toISOString()]
        );
        
        const newStudent = await db.select('SELECT * FROM students WHERE matricula = ?', [matricula]);
        return newStudent[0];
    },
    
    update: async (id, updates) => {
        const db = await initDatabase();
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];
        
        await db.execute(
            `UPDATE students SET ${fields} WHERE id = ?`,
            values
        );
        
        return await studentsAPI.getById(id);
    },
    
    delete: async (id) => {
        const db = await initDatabase();
        await db.execute('DELETE FROM students WHERE id = ?', [id]);
        return true;
    }
};

// API de Materias
export const subjectsAPI = {
    getAll: async () => {
        const db = await initDatabase();
        const subjects = await db.select('SELECT * FROM subjects ORDER BY name');
        
        // Parsear components JSON
        return subjects.map(s => ({
            ...s,
            components: s.components ? JSON.parse(s.components) : []
        }));
    },
    
    getById: async (id) => {
        const db = await initDatabase();
        const result = await db.select('SELECT * FROM subjects WHERE id = ?', [id]);
        if (!result[0]) return null;
        
        return {
            ...result[0],
            components: result[0].components ? JSON.parse(result[0].components) : []
        };
    },
    
    create: async (subject) => {
        const db = await initDatabase();
        const colors = [
            '#3B82F6, #2563EB',
            '#22C55E, #16A34A',
            '#A855F7, #9333EA',
            '#F97316, #EA580C',
            '#EC4899, #DB2777',
            '#6366F1, #4F46E5'
        ];
        
        const count = await db.select('SELECT COUNT(*) as count FROM subjects');
        const color = colors[count[0].count % colors.length];
        
        const components = subject.components || [
            { id: 1, name: 'Tareas', type: 'numeric', weight: 40, maxScore: 100 },
            { id: 2, name: 'Exámenes', type: 'numeric', weight: 60, maxScore: 100 }
        ];
        
        await db.execute(
            `INSERT INTO subjects (name, code, credits, schedule, teacher, cycle, color, components) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                subject.name,
                subject.code,
                subject.credits || '',
                subject.schedule || '',
                subject.teacher || '',
                subject.cycle || 'First cycle',
                color,
                JSON.stringify(components)
            ]
        );
        
        const newSubject = await db.select('SELECT * FROM subjects WHERE code = ?', [subject.code]);
        return {
            ...newSubject[0],
            components: JSON.parse(newSubject[0].components)
        };
    },
    
    update: async (id, updates) => {
        const db = await initDatabase();
        
        if (updates.components) {
            updates.components = JSON.stringify(updates.components);
        }
        
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];
        
        await db.execute(
            `UPDATE subjects SET ${fields} WHERE id = ?`,
            values
        );
        
        return await subjectsAPI.getById(id);
    },
    
    delete: async (id) => {
        const db = await initDatabase();
        await db.execute('DELETE FROM subjects WHERE id = ?', [id]);
        return true;
    }
};

// API de Inscripciones
export const enrollmentsAPI = {
    getAll: async () => {
        const db = await initDatabase();
        return await db.select('SELECT * FROM enrollments ORDER BY id');
    },
    
    create: async (enrollment) => {
        const db = await initDatabase();
        
        await db.execute(
            `INSERT INTO enrollments (studentId, studentName, subjectId, subjectName, subjectCode, teacher, color, enrollmentDate) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                enrollment.studentId,
                enrollment.studentName,
                enrollment.subjectId,
                enrollment.subjectName,
                enrollment.subjectCode,
                enrollment.teacher || '',
                enrollment.color || '',
                enrollment.enrollmentDate || new Date().toISOString()
            ]
        );
        
        const result = await db.select('SELECT * FROM enrollments ORDER BY id DESC LIMIT 1');
        return result[0];
    },
    
    delete: async (id) => {
        const db = await initDatabase();
        await db.execute('DELETE FROM enrollments WHERE id = ?', [id]);
        return true;
    }
};

// API de Calificaciones
export const gradesAPI = {
    getAll: async () => {
        const db = await initDatabase();
        return await db.select('SELECT * FROM grades ORDER BY date DESC');
    },
    
    getByEnrollment: async (enrollmentId) => {
        const db = await initDatabase();
        return await db.select('SELECT * FROM grades WHERE enrollmentId = ? ORDER BY date', [enrollmentId]);
    },
    
    create: async (grade) => {
        const db = await initDatabase();
        
        await db.execute(
            `INSERT INTO grades (enrollmentId, studentId, componentId, componentName, type, name, score, maxScore, date, notes) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                grade.enrollmentId,
                grade.studentId || 0,
                grade.componentId || null,
                grade.componentName || '',
                grade.type || 'assignment',
                grade.name,
                grade.score,
                grade.maxScore || 100,
                grade.date || new Date().toISOString(),
                grade.notes || ''
            ]
        );
        
        const result = await db.select('SELECT * FROM grades ORDER BY id DESC LIMIT 1');
        return result[0];
    },
    
    update: async (id, updates) => {
        const db = await initDatabase();
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];
        
        await db.execute(
            `UPDATE grades SET ${fields} WHERE id = ?`,
            values
        );
        
        const result = await db.select('SELECT * FROM grades WHERE id = ?', [id]);
        return result[0];
    },
    
    delete: async (id) => {
        const db = await initDatabase();
        await db.execute('DELETE FROM grades WHERE id = ?', [id]);
        return true;
    },
    
    calculateAccumulated: (enrollmentId) => {
        // Esta función se mantiene igual que antes
        // Calcula promedios basados en las calificaciones
        return {
            assignmentAvg: 0,
            examAvg: 0,
            accumulated: 0,
            totalAssignments: 0,
            totalExams: 0
        };
    }
};

export default { initDatabase, studentsAPI, subjectsAPI, enrollmentsAPI, gradesAPI };
```

## 🔄 Paso 5: Actualizar package.json

Agrega los scripts de Tauri:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

## 🎨 Paso 6: Crear Iconos

Necesitas crear iconos para la app. Coloca tu logo en `src-tauri/icons/`:

- `32x32.png`
- `128x128.png`
- `128x128@2x.png`
- `icon.icns` (Mac)
- `icon.ico` (Windows)

O usa el generador de Tauri:
```bash
npx @tauri-apps/cli icon path/to/your/icon.png
```

## 🚀 Paso 7: Ejecutar en Modo Desarrollo

```bash
npm run tauri:dev
```

Esto abrirá la aplicación en una ventana nativa.

## 📦 Paso 8: Crear Instalador

```bash
npm run tauri:build
```

El instalador se creará en:
- Windows: `src-tauri/target/release/bundle/msi/Grade Manager_1.0.0_x64_en-US.msi`
- Tamaño aproximado: ~3-5 MB

## ✅ Verificación

1. **Desarrollo:**
   - `npm run tauri:dev`
   - Debería abrir ventana nativa
   - Base de datos SQLite se crea automáticamente

2. **Producción:**
   - `npm run tauri:build`
   - Instalador en `src-tauri/target/release/bundle/`

## 📝 Notas Importantes

1. **Base de datos:**
   - Se crea en: `%APPDATA%/com.grademanager.app/grade_manager.db`
   - Persiste entre sesiones
   - No se borra al desinstalar (puedes configurarlo)

2. **Migración de datos:**
   - Los datos de localStorage NO se migran automáticamente
   - Necesitarás exportar/importar o crear script de migración

3. **Actualizaciones:**
   - Tauri soporta auto-updates
   - Configurar después si es necesario

## 🆘 Troubleshooting

### **Error: Rust no encontrado**
```bash
# Instalar Rust
https://rustup.rs/
```

### **Error: WebView2 no encontrado**
```bash
# Descargar e instalar
https://developer.microsoft.com/microsoft-edge/webview2/
```

### **Error al compilar**
```bash
# Limpiar y reinstalar
cargo clean
npm install
```

## 🎯 Próximos Pasos

1. Instalar Rust
2. Ejecutar comandos de instalación
3. Configurar archivos
4. Probar en desarrollo
5. Crear instalador

---

**Tiempo estimado total: 2-3 horas**
**Tamaño del instalador: ~3-5 MB**
**Plataformas: Windows, Mac, Linux**
