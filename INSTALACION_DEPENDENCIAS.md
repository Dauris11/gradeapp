# 🔧 Instalación de Dependencias - SQLite y Tauri

## 📅 Fecha: 15/12/2024 - 10:07 AM

## ✅ Estado Actual: EN PROGRESO

### **Completado:**

#### 1. **Dependencias de Node.js** ✅
```bash
✓ @tauri-apps/cli@2.9.6
✓ @tauri-apps/api@2.9.1
✓ @tauri-apps/plugin-sql@2.3.1
✓ better-sqlite3@12.5.0
```

**Verificado con:**
```bash
npm list @tauri-apps/cli @tauri-apps/api @tauri-apps/plugin-sql
npm list better-sqlite3
```

#### 2. **Rust Instalado** ✅
```
✓ rustc 1.92.0 (ded5c06cf 2025-12-08)
✓ cargo 1.92.0 (344c4567c 2025-10-21)
```

**Verificado con:**
```bash
rustc --version
cargo --version
```

#### 3. **Dependencias de Rust Descargadas** ✅
```
✓ 538 crates descargados
✓ 87.3 MB de dependencias
✓ Tiempo: 4m 35s
```

**Comando ejecutado:**
```bash
cd src-tauri
cargo fetch
```

### **En Progreso:**

#### 4. **Compilación de Dependencias de Rust** ⏳
```bash
cd src-tauri
cargo build
```

**Estado:** Compilando...
**Tiempo estimado:** 5-10 minutos (primera vez)
**Progreso:** Las dependencias se están compilando en segundo plano

---

## 📦 Dependencias Instaladas

### **Frontend (Node.js/npm)**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@tauri-apps/cli` | 2.9.6 | CLI de Tauri para desarrollo |
| `@tauri-apps/api` | 2.9.1 | API de Tauri para JavaScript |
| `@tauri-apps/plugin-sql` | 2.3.1 | Plugin SQL para Tauri |
| `better-sqlite3` | 12.5.0 | SQLite para Node.js/Electron |

### **Backend (Rust/Cargo)**

Configurado en `src-tauri/Cargo.toml`:

```toml
[dependencies]
serde_json = "1.0"
serde = { version = "1.0", features = ["derive"] }
log = "0.4"
tauri = { version = "2.9.5" }
tauri-plugin-log = "2"
tauri-plugin-sql = { version = "2", features = ["sqlite"] }
```

**Total de crates:** 538 paquetes

---

## 🎯 Próximos Pasos

### **1. Esperar Compilación** ⏳
La compilación de Rust está en progreso. Esto puede tomar:
- **Primera vez:** 5-10 minutos
- **Compilaciones posteriores:** 30 segundos - 2 minutos

### **2. Verificar Compilación** 
Una vez completada, verificar con:
```bash
cd src-tauri
cargo build --release
```

### **3. Probar Tauri en Desarrollo**
```bash
npm run tauri:dev
```

Esto:
- Iniciará Vite (frontend)
- Compilará Rust (si hay cambios)
- Abrirá ventana nativa con la aplicación
- Activará hot reload

### **4. Crear Instalador (Opcional)**
```bash
npm run tauri:build
```

Generará instalador en:
- `src-tauri/target/release/bundle/`

---

## 🔍 Verificación de Dependencias

### **Comandos de Verificación:**

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Rust
rustc --version
cargo --version

# Verificar dependencias de Node.js
npm list @tauri-apps/cli
npm list @tauri-apps/api
npm list @tauri-apps/plugin-sql
npm list better-sqlite3

# Verificar dependencias de Rust
cd src-tauri
cargo tree
```

---

## 📊 Resumen de Instalación

| Componente | Estado | Tiempo |
|------------|--------|--------|
| Dependencias npm | ✅ Instalado | < 1 min |
| Rust | ✅ Instalado | N/A |
| Cargo fetch | ✅ Completado | 4m 35s |
| Cargo build | ⏳ En progreso | ~5-10 min |

---

## ⚙️ Configuración de SQLite

### **Tauri SQLite (Recomendado para Producción)**
- **Plugin:** `tauri-plugin-sql`
- **Features:** `sqlite`
- **Ubicación BD:** `%APPDATA%\com.tauri.dev\grade_manager.db`
- **Ventajas:**
  - Base de datos real
  - Persistencia garantizada
  - Mejor rendimiento
  - Aplicación nativa

### **better-sqlite3 (Para Electron)**
- **Paquete:** `better-sqlite3@12.5.0`
- **Uso:** Node.js/Electron
- **Estado:** Instalado pero no configurado actualmente

---

## 🚀 Comandos Disponibles

```bash
# Desarrollo web (Vite)
npm run dev

# Desarrollo Tauri (ventana nativa)
npm run tauri:dev

# Build para producción
npm run tauri:build

# Solo compilar Rust
cd src-tauri
cargo build

# Compilar en modo release
cd src-tauri
cargo build --release

# Limpiar compilación
cd src-tauri
cargo clean
```

---

## 📝 Notas Importantes

### **Primera Compilación de Rust:**
- Es NORMAL que tarde 5-10 minutos
- Compila todas las dependencias (538 crates)
- Solo ocurre la primera vez
- Compilaciones posteriores son mucho más rápidas

### **Hot Reload:**
- **Cambios en React/JS:** Instantáneo
- **Cambios en Rust:** Requiere recompilación (~30 seg)

### **Base de Datos:**
- Se crea automáticamente al iniciar
- Persiste entre sesiones
- Ubicación: `%APPDATA%\com.tauri.dev\`

---

## ✨ Resultado Final

Una vez completada la compilación, tendrás:

- ✅ Aplicación de escritorio nativa
- ✅ Base de datos SQLite integrada
- ✅ Mejor rendimiento que localStorage
- ✅ Datos persistentes
- ✅ Instalador pequeño (~3-5 MB)
- ✅ Multiplataforma (Windows, Mac, Linux)

---

**Estado:** ⏳ Compilando dependencias de Rust
**Próximo paso:** Esperar a que termine `cargo build`
**Tiempo estimado:** 5-10 minutos
