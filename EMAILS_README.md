# 📧 Sistema de Emails - GradeApp

## 🎯 Configuración Completada

Se ha configurado completamente el sistema de envío de emails con SendGrid para tu aplicación de gestión de calificaciones.

## 📚 Documentación Disponible

### 🚀 Para Empezar Rápido
- **`SENDGRID_RAPIDO.md`** - Configuración en 5 minutos
- **`SENDGRID_PASO_A_PASO.md`** - Guía visual detallada

### 📖 Documentación Completa
- **`CONFIGURAR_SENDGRID_COMPLETO.md`** - Guía exhaustiva con solución de problemas
- **`SISTEMA_EMAILS_RESUMEN.md`** - Resumen del sistema y recursos

### 🛠️ Herramientas Incluidas

#### 1. Configurador Automático
```bash
cd backend
node configurar-sendgrid.js
```
Script interactivo que te guía paso a paso para crear el archivo `.env`.

#### 2. Script de Prueba
```bash
cd backend
node test-sendgrid.js
```
Envía un email de prueba para verificar que todo funciona correctamente.

## ⚡ Inicio Rápido

### 1️⃣ Obtener Credenciales de SendGrid
1. Crea una cuenta en https://signup.sendgrid.com/
2. Obtén tu API Key en https://app.sendgrid.com/settings/api_keys
3. Verifica tu email en https://app.sendgrid.com/settings/sender_auth

### 2️⃣ Configurar la Aplicación
```bash
cd backend
node configurar-sendgrid.js
```

### 3️⃣ Reiniciar el Backend
```bash
# Detener el servidor (Ctrl+C)
npm start
```

### 4️⃣ Probar
```bash
node test-sendgrid.js
```

## ✨ Características

- ✅ Envío de reportes de calificaciones por email
- ✅ Adjuntos PDF automáticos
- ✅ Envío individual y masivo
- ✅ Plantillas HTML profesionales
- ✅ Verificación de configuración
- ✅ Manejo de errores robusto
- ✅ 100 emails gratis por día (plan gratuito de SendGrid)

## 🔧 Configuración Manual

Si prefieres configurar manualmente, crea el archivo `backend/.env`:

```env
SENDGRID_API_KEY=SG.tu_api_key_aqui
FROM_EMAIL=tucorreo@gmail.com
FROM_NAME=GradeApp - Sistema Académico
REPLY_TO_EMAIL=tucorreo@gmail.com
PORT=3001
```

## 📊 Rutas de API Disponibles

### Verificar Configuración
```http
GET /api/email/config
```

### Enviar Email Individual
```http
POST /api/email/send
Content-Type: application/json

{
  "to": "destinatario@email.com",
  "subject": "Asunto del email",
  "html": "<h1>Contenido HTML</h1>",
  "attachment": {
    "data": "base64_data",
    "name": "reporte.pdf",
    "type": "application/pdf"
  }
}
```

### Enviar Emails Masivos
```http
POST /api/email/send-bulk
Content-Type: application/json

{
  "emails": [
    {
      "to": "email1@example.com",
      "subject": "Asunto",
      "html": "<h1>Contenido</h1>"
    },
    {
      "to": "email2@example.com",
      "subject": "Asunto",
      "html": "<h1>Contenido</h1>"
    }
  ]
}
```

## 🧪 Pruebas

### Desde Terminal
```bash
cd backend
node test-sendgrid.js
```

### Desde la Aplicación Web
1. Abre http://localhost:5173
2. Ve a **Reportes**
3. Selecciona un estudiante
4. Haz clic en **Enviar por Email**

## ⚠️ Solución de Problemas

### Error: "SendGrid no está configurado"
```bash
cd backend
node configurar-sendgrid.js
```

### Error: "The from address does not match"
- Verifica tu email en https://app.sendgrid.com/settings/sender_auth

### Los emails llegan a spam
- Configura Domain Authentication en SendGrid
- Evita palabras spam en el asunto

## 📈 Límites del Plan Gratuito

- **100 emails por día** permanentemente
- Sin tarjeta de crédito requerida
- ~3,000 emails por mes
- Perfecto para instituciones pequeñas

## 🔒 Seguridad

- ⚠️ El archivo `.env` contiene información sensible
- ⚠️ **NUNCA** subas `.env` a GitHub
- ✅ Ya está incluido en `.gitignore`

## 📞 Soporte

Para más información, consulta:
- `CONFIGURAR_SENDGRID_COMPLETO.md` - Documentación completa
- `SENDGRID_PASO_A_PASO.md` - Guía visual
- https://docs.sendgrid.com/ - Documentación oficial

---

**Estado:** ✅ Sistema configurado y listo para usar

**Última actualización:** Diciembre 2025
