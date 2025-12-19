# 🎯 Configuración de SendGrid - Guía Visual Paso a Paso

## 📍 PASO 1: Crear Cuenta en SendGrid

### 1.1 Registro
```
🌐 Ir a: https://signup.sendgrid.com/

📝 Completar:
   ├─ Email
   ├─ Nombre completo
   ├─ Contraseña
   └─ Aceptar términos

📧 Verificar email (revisa tu bandeja de entrada)
```

### 1.2 Completar Perfil
```
Después de verificar tu email:
   ├─ Información de la empresa
   ├─ Tipo de uso (Transactional)
   └─ Volumen estimado (< 100 emails/día)
```

---

## 📍 PASO 2: Obtener API Key

### 2.1 Acceder a API Keys
```
🌐 Ir a: https://app.sendgrid.com/settings/api_keys

O navegar:
   Settings (⚙️) → API Keys
```

### 2.2 Crear Nueva API Key
```
1. Clic en "Create API Key"

2. Configurar:
   ┌─────────────────────────────────────┐
   │ API Key Name: GradeApp Production   │
   │                                     │
   │ API Key Permissions:                │
   │ ○ Full Access                       │
   │ ● Restricted Access                 │
   │   └─ ✓ Mail Send (Full Access)     │
   └─────────────────────────────────────┘

3. Clic en "Create & View"

4. ⚠️ COPIAR LA API KEY INMEDIATAMENTE
   (Solo se muestra una vez)
   
   Ejemplo:
   SG.abc123xyz789_tu_api_key_completa_aqui
```

---

## 📍 PASO 3: Verificar Email de Remitente

### 3.1 Acceder a Sender Authentication
```
🌐 Ir a: https://app.sendgrid.com/settings/sender_auth

O navegar:
   Settings (⚙️) → Sender Authentication
```

### 3.2 Verificar Single Sender (Opción Rápida)
```
1. Clic en "Verify a Single Sender"

2. Completar formulario:
   ┌─────────────────────────────────────────────┐
   │ From Name: GradeApp - Sistema Académico    │
   │ From Email: tucorreo@gmail.com             │
   │ Reply To: tucorreo@gmail.com               │
   │                                            │
   │ Nickname: GradeApp                         │
   │                                            │
   │ Company Address:                           │
   │ Street: Calle Principal 123                │
   │ City: Tu Ciudad                            │
   │ Country: Tu País                           │
   └─────────────────────────────────────────────┘

3. Clic en "Create"

4. Revisar tu email y hacer clic en el enlace de verificación

5. ✅ Estado cambiará a "Verified"
```

---

## 📍 PASO 4: Configurar la Aplicación

### Opción A: Script Automático (Recomendado)

```bash
# 1. Abrir terminal en la carpeta del proyecto
cd backend

# 2. Ejecutar script de configuración
node configurar-sendgrid.js

# 3. Seguir las instrucciones en pantalla:
   
   🔑 Ingresa tu SENDGRID_API_KEY: SG.tu_api_key_aqui
   📧 Ingresa el FROM_EMAIL: tucorreo@gmail.com
   👤 Ingresa el FROM_NAME: GradeApp - Sistema Académico
   ↩️  Ingresa el REPLY_TO_EMAIL: tucorreo@gmail.com
   
   ✅ ¿Es correcta esta configuración? (s/n): s

# 4. Archivo .env creado automáticamente
```

### Opción B: Configuración Manual

```bash
# 1. Crear archivo .env en la carpeta backend
cd backend
notepad .env

# 2. Copiar y pegar (reemplazar con tus datos):

SENDGRID_API_KEY=SG.tu_api_key_completa_aqui
FROM_EMAIL=tucorreo@gmail.com
FROM_NAME=GradeApp - Sistema Académico
REPLY_TO_EMAIL=tucorreo@gmail.com
PORT=3001

# 3. Guardar y cerrar
```

---

## 📍 PASO 5: Reiniciar el Backend

```bash
# 1. Si el backend está corriendo, detenerlo
   Presionar: Ctrl + C

# 2. Iniciar nuevamente
cd backend
npm start

# 3. Verificar mensaje de éxito
   Deberías ver:
   ✅ SendGrid configurado correctamente
   🚀 Backend corriendo en http://localhost:3001
```

---

## 📍 PASO 6: Probar el Envío

### Opción A: Script de Prueba

```bash
# 1. Ejecutar script de prueba
cd backend
node test-sendgrid.js

# 2. Ingresar email de prueba cuando se solicite
   📧 Ingresa un email para enviar una prueba: tucorreo@gmail.com

# 3. Verificar resultado
   ✅ ¡EMAIL ENVIADO EXITOSAMENTE!
   📬 Revisa tu bandeja de entrada
```

### Opción B: Desde la Aplicación

```
1. Abrir navegador: http://localhost:5173

2. Navegar a: Reportes

3. Seleccionar un estudiante

4. Clic en: "Enviar por Email"

5. Ingresar email de destino

6. Clic en: "Enviar"

7. ✅ Verificar mensaje de éxito

8. 📬 Revisar bandeja de entrada
```

---

## 📍 PASO 7: Verificar en SendGrid

```
🌐 Ir a: https://app.sendgrid.com/email_activity

Deberías ver:
   ┌────────────────────────────────────────────┐
   │ Email Activity                             │
   ├────────────────────────────────────────────┤
   │ ✅ Delivered | tucorreo@gmail.com          │
   │    Subject: Reporte de Calificaciones      │
   │    Date: Hace unos segundos                │
   └────────────────────────────────────────────┘
```

---

## ✅ Checklist Final

```
Marca cada paso completado:

□ Cuenta de SendGrid creada
□ Email verificado
□ API Key generada y copiada
□ Sender Identity verificado
□ Archivo .env creado
□ Backend reiniciado
□ Mensaje "✅ SendGrid configurado" visible
□ Script de prueba ejecutado
□ Email de prueba recibido
□ Prueba desde la aplicación exitosa
```

---

## 🎉 ¡Configuración Completada!

Tu sistema de emails está listo para:
- ✅ Enviar reportes de calificaciones
- ✅ Enviar emails individuales
- ✅ Enviar emails masivos
- ✅ Adjuntar PDFs automáticamente

---

## 📞 ¿Necesitas Ayuda?

### Problemas Comunes

**❌ "SendGrid no está configurado"**
```bash
# Verificar archivo .env
cd backend
dir .env

# Si no existe, ejecutar:
node configurar-sendgrid.js
```

**❌ "The from address does not match"**
```
1. Ir a: https://app.sendgrid.com/settings/sender_auth
2. Verificar que tu email aparece como "Verified"
3. Si no, hacer clic en "Verify a Single Sender"
```

**❌ "Email llega a spam"**
```
✓ Normal al principio
✓ Configura Domain Authentication para mejorar
✓ Evita palabras spam en el asunto
```

### Documentación Adicional

- 📘 `SENDGRID_RAPIDO.md` - Inicio rápido
- 📗 `CONFIGURAR_SENDGRID_COMPLETO.md` - Guía completa
- 📕 `SISTEMA_EMAILS_RESUMEN.md` - Resumen del sistema

---

**¡Éxito con tu sistema de gestión de calificaciones! 🎓**
