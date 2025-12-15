# 🚀 GUÍA: Crear Repositorio en GitHub para GradeApp

## 📋 Pasos para Crear el Repositorio

### **Paso 1: Crear Repositorio en GitHub**

1. **Ve a GitHub:**
   - Abre tu navegador
   - Ve a: https://github.com
   - Inicia sesión con tu cuenta

2. **Crear Nuevo Repositorio:**
   - Haz clic en el botón **"+"** (arriba derecha)
   - Selecciona **"New repository"**

3. **Configurar el Repositorio:**
   ```
   Repository name: grade-manager
   Description: Sistema de Gestión de Calificaciones - GradeApp
   Visibility: ✅ Public (o Private si prefieres)
   
   ❌ NO marques "Initialize this repository with:"
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
   ```

4. **Haz clic en "Create repository"**

---

### **Paso 2: Inicializar Git Localmente**

Abre PowerShell en la carpeta del proyecto:

```powershell
cd c:\Users\Admind\OneDrive\Escritorio\calificaciiones\grade-manager
```

#### **2.1 Inicializar Git**
```bash
git init
```

#### **2.2 Agregar Archivos**
```bash
git add .
```

#### **2.3 Hacer el Primer Commit**
```bash
git commit -m "Initial commit: GradeApp - Sistema de Gestión de Calificaciones"
```

#### **2.4 Renombrar Rama a 'main'**
```bash
git branch -M main
```

---

### **Paso 3: Conectar con GitHub**

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub:

```bash
git remote add origin https://github.com/TU_USUARIO/grade-manager.git
```

**Ejemplo:**
```bash
git remote add origin https://github.com/johndoe/grade-manager.git
```

---

### **Paso 4: Subir el Código**

```bash
git push -u origin main
```

**Nota:** Si es la primera vez, te pedirá autenticación:
- Usa tu **Personal Access Token** (no tu contraseña)
- O configura **GitHub CLI** o **SSH keys**

---

## 🔑 Configurar Autenticación (Si es necesario)

### **Opción 1: Personal Access Token (Recomendado)**

1. **Crear Token:**
   - Ve a: https://github.com/settings/tokens
   - Haz clic en **"Generate new token"** → **"Generate new token (classic)"**
   - Nombre: `GradeApp-Token`
   - Scopes: Marca **`repo`** (todos los permisos de repositorio)
   - Haz clic en **"Generate token"**
   - **COPIA EL TOKEN** (solo se muestra una vez)

2. **Usar el Token:**
   Cuando hagas `git push`, usa el token como contraseña:
   ```
   Username: tu-usuario
   Password: ghp_xxxxxxxxxxxxxxxxxxxx (tu token)
   ```

---

### **Opción 2: GitHub CLI (Más Fácil)**

```bash
# Instalar GitHub CLI
winget install GitHub.cli

# Autenticarse
gh auth login

# Seguir las instrucciones en pantalla
```

---

## 📝 Comandos Git Útiles

### **Ver Estado**
```bash
git status
```

### **Ver Historial**
```bash
git log --oneline
```

### **Agregar Cambios**
```bash
# Agregar archivos específicos
git add archivo.js

# Agregar todos los cambios
git add .
```

### **Hacer Commit**
```bash
git commit -m "Descripción del cambio"
```

### **Subir Cambios**
```bash
git push
```

### **Descargar Cambios**
```bash
git pull
```

---

## 🌿 Trabajar con Ramas

### **Crear Nueva Rama**
```bash
git checkout -b feature/nueva-funcionalidad
```

### **Cambiar de Rama**
```bash
git checkout main
```

### **Fusionar Rama**
```bash
git checkout main
git merge feature/nueva-funcionalidad
```

### **Eliminar Rama**
```bash
git branch -d feature/nueva-funcionalidad
```

---

## 📦 Archivos Importantes Creados

1. **`.gitignore`** ✅
   - Excluye `node_modules/`, `dist/`, `.env`, etc.
   - Ya está configurado correctamente

2. **`README.md`** ✅
   - Documentación profesional del proyecto
   - Incluye instalación, uso, API, etc.

---

## 🎯 Flujo de Trabajo Recomendado

### **Desarrollo Diario**

```bash
# 1. Asegúrate de estar en main y actualizado
git checkout main
git pull

# 2. Crea una rama para tu feature
git checkout -b feature/mi-nueva-funcionalidad

# 3. Haz cambios y commits
git add .
git commit -m "Agrega nueva funcionalidad X"

# 4. Sube tu rama
git push -u origin feature/mi-nueva-funcionalidad

# 5. En GitHub, crea un Pull Request
# 6. Después de aprobar, fusiona a main
```

---

## 🔍 Verificar que Todo Está Bien

### **1. Verificar Archivos Ignorados**
```bash
git status
```

Deberías ver:
- ✅ `src/`, `public/`, `backend/`, etc.
- ❌ NO deberías ver `node_modules/`, `dist/`, `.env`

### **2. Verificar Conexión con GitHub**
```bash
git remote -v
```

Deberías ver:
```
origin  https://github.com/TU_USUARIO/grade-manager.git (fetch)
origin  https://github.com/TU_USUARIO/grade-manager.git (push)
```

---

## 🎉 ¡Listo!

Tu repositorio está creado y configurado. Ahora puedes:

1. ✅ Ver tu código en GitHub
2. ✅ Compartir el enlace con otros
3. ✅ Colaborar con tu equipo
4. ✅ Hacer seguimiento de cambios
5. ✅ Crear releases y versiones

---

## 📌 Comandos Completos (Resumen)

```bash
# En la carpeta del proyecto
cd c:\Users\Admind\OneDrive\Escritorio\calificaciiones\grade-manager

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: GradeApp - Sistema de Gestión de Calificaciones"

# Renombrar rama
git branch -M main

# Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/grade-manager.git

# Subir código
git push -u origin main
```

---

## 🆘 Solución de Problemas

### **Error: "fatal: remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/grade-manager.git
```

### **Error: "failed to push some refs"**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### **Error: "Authentication failed"**
- Usa un **Personal Access Token** en lugar de tu contraseña
- O configura **GitHub CLI**: `gh auth login`

---

## 📚 Recursos Adicionales

- [Documentación de Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitHub CLI](https://cli.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**¡Tu proyecto GradeApp está listo para ser compartido con el mundo!** 🚀
