# 🚀 GUÍA RÁPIDA: Subir GradeApp a GitHub

## 👤 Usuario: Dauris11

---

## ✅ PASO 1: Crear Repositorio en GitHub

### **1.1 Ir a GitHub**
Abre tu navegador y ve a:
```
https://github.com/new
```

### **1.2 Configurar el Repositorio**
Completa el formulario:

```
Repository name: grade-manager
Description: 📚 Sistema de Gestión de Calificaciones - GradeApp
```

**Opciones:**
- ✅ **Public** (recomendado para portafolio)
- O **Private** (si prefieres que sea privado)

**NO marques:**
- ❌ Add a README file
- ❌ Add .gitignore  
- ❌ Choose a license

### **1.3 Crear**
Haz clic en **"Create repository"**

---

## ✅ PASO 2: Conectar y Subir (Ejecuta estos comandos)

### **2.1 Configurar Remote**
```bash
git remote add origin https://github.com/Dauris11/grade-manager.git
```

### **2.2 Renombrar Rama a 'main'**
```bash
git branch -M main
```

### **2.3 Subir el Código**
```bash
git push -u origin main
```

**Nota:** Te pedirá autenticación:
- **Username:** `Dauris11`
- **Password:** Tu **Personal Access Token** (NO tu contraseña de GitHub)

---

## 🔑 PASO 3: Crear Personal Access Token (Si no tienes uno)

### **3.1 Ir a Configuración de Tokens**
```
https://github.com/settings/tokens
```

### **3.2 Generar Nuevo Token**
1. Haz clic en **"Generate new token"**
2. Selecciona **"Generate new token (classic)"**

### **3.3 Configurar Token**
```
Note: GradeApp Repository Access
Expiration: 90 days (o el que prefieras)
```

**Scopes (Permisos):**
- ✅ Marca **`repo`** (todos los permisos de repositorio)

### **3.4 Generar y Copiar**
1. Haz clic en **"Generate token"**
2. **COPIA EL TOKEN** (solo se muestra una vez)
3. Guárdalo en un lugar seguro

**Ejemplo de token:**
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📝 COMANDOS COMPLETOS (Copia y Pega)

```bash
# 1. Conectar con tu repositorio
git remote add origin https://github.com/Dauris11/grade-manager.git

# 2. Renombrar rama
git branch -M main

# 3. Subir código
git push -u origin main
```

Cuando te pida credenciales:
```
Username: Dauris11
Password: [pega tu token aquí]
```

---

## ✅ VERIFICAR QUE TODO FUNCIONÓ

Después de hacer `git push`, ve a:
```
https://github.com/Dauris11/grade-manager
```

Deberías ver:
- ✅ Tu código
- ✅ README.md con la documentación
- ✅ Todos los archivos del proyecto

---

## 🎯 ESTADO ACTUAL

- ✅ Git inicializado
- ✅ Archivos agregados (`git add .`)
- ✅ Commit realizado
- ⏳ Pendiente: Crear repositorio en GitHub
- ⏳ Pendiente: Conectar remote
- ⏳ Pendiente: Push a GitHub

---

## 🆘 Solución de Problemas

### **Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/Dauris11/grade-manager.git
```

### **Error: "Authentication failed"**
- Asegúrate de usar un **Personal Access Token**, NO tu contraseña
- Crea uno nuevo en: https://github.com/settings/tokens

### **Error: "failed to push"**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 📚 URLs Importantes

- **Tu perfil:** https://github.com/Dauris11
- **Nuevo repo:** https://github.com/new
- **Tokens:** https://github.com/settings/tokens
- **Tu repositorio (después de crear):** https://github.com/Dauris11/grade-manager

---

## 🎉 ¡Siguiente Paso!

1. **Abre tu navegador**
2. **Ve a:** https://github.com/new
3. **Crea el repositorio** con el nombre `grade-manager`
4. **Ejecuta los comandos** de arriba
5. **¡Listo!** Tu código estará en GitHub

---

**¿Necesitas ayuda? Avísame y te guío paso a paso.** 🚀
