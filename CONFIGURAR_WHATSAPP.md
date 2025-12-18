# 📱 SISTEMA DE WHATSAPP - CONFIGURACIÓN COMPLETA

## ✅ Sistema Implementado

El sistema de envío de mensajes por WhatsApp está completamente configurado usando Twilio.

---

## 🎯 Características Principales

### **1. Envío de Mensajes por WhatsApp**
- ✅ Mensajes de texto formateados
- ✅ Envío masivo a múltiples estudiantes
- ✅ Progreso en tiempo real
- ✅ Validación de números de teléfono
- ✅ Manejo de errores

### **2. Plantilla de Mensaje Profesional**
```
🎓 *GradeApp - Reporte Académico*

¡Hola [Estudiante]! 👋

Te enviamos tu reporte académico actualizado...

📊 *Tu reporte incluye:*
• Calificaciones detalladas por materia
• Promedio de asignaciones y exámenes
• Calificación acumulada actualizada
• Estado de aprobación de cada materia

💡 *Recuerda:* Tu esfuerzo y dedicación...
```

### **3. Cuarto Botón en Reportes**
- 🟢 **Color:** Verde (#10B981)
- 📱 **Icono:** MessageCircle
- 🎯 **Función:** Envío masivo por WhatsApp

---

## 📋 PASO 1: Crear Cuenta en Twilio

### **1.1 Registrarse**
1. Ve a: https://www.twilio.com/try-twilio
2. Completa el formulario de registro
3. Verifica tu correo electrónico
4. Verifica tu número de teléfono

### **1.2 Plan Gratuito**
Twilio ofrece crédito de prueba:
- ✅ **$15 USD de crédito gratis**
- ✅ Perfecto para pruebas
- ✅ ~1,000 mensajes de WhatsApp

---

## 🔑 PASO 2: Configurar WhatsApp en Twilio

### **2.1 Activar WhatsApp Sandbox**

1. **Ir a WhatsApp Sandbox:**
   - En Twilio Console, ve a: **Messaging** → **Try it out** → **Send a WhatsApp message**

2. **Configurar Sandbox:**
   - Verás un número de WhatsApp de Twilio (ej: +1 415 523 8886)
   - Verás un código de activación (ej: "join [código]")

3. **Activar desde tu WhatsApp:**
   - Abre WhatsApp en tu teléfono
   - Envía un mensaje al número de Twilio
   - Mensaje: `join [código]` (ej: "join abc-123")
   - Recibirás confirmación

### **2.2 Obtener Credenciales**

1. **Account SID y Auth Token:**
   - Ve a: https://console.twilio.com/
   - En el Dashboard, verás:
     - **Account SID:** ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     - **Auth Token:** [Haz clic en "Show" para ver]

2. **Número de WhatsApp:**
   - En WhatsApp Sandbox, copia el número
   - Formato: +14155238886

---

## ⚙️ PASO 3: Configurar el Backend

### **3.1 Editar archivo `.env`**

Abre `backend/.env` y agrega:

```env
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Reemplaza:**
- `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` → Tu Account SID
- `tu_auth_token_aqui` → Tu Auth Token
- `+14155238886` → Tu número de WhatsApp Sandbox

### **3.2 Ejemplo Real**

```env
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=1234567890abcdef1234567890abcdef
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### **3.3 Reiniciar el Backend**

```bash
# Detén el servidor (Ctrl+C)
# Inicia de nuevo
cd backend
npm start
```

Deberías ver:
```
✅ Twilio WhatsApp configurado correctamente
```

---

## 📱 PASO 4: Agregar Números de Teléfono a Estudiantes

### **4.1 Formato de Números**

Los números deben incluir el código de país:
```
Formato: +[código país][número]
Ejemplo: +18091234567 (República Dominicana)
```

### **4.2 Códigos de País Comunes**

| País | Código |
|------|--------|
| República Dominicana | +1809, +1829, +1849 |
| Estados Unidos | +1 |
| México | +52 |
| España | +34 |
| Colombia | +57 |
| Argentina | +54 |

### **4.3 Agregar Teléfonos en la App**

1. Ve a **Estudiantes**
2. Edita un estudiante
3. En el campo **Teléfono**, ingresa: `+18091234567`
4. Guarda

---

## 🧪 PASO 5: Probar el Sistema

### **5.1 Verificar Configuración**

Abre en el navegador:
```
http://localhost:3001/api/whatsapp/config
```

Deberías ver:
```json
{
  "configured": true,
  "accountSid": "***cdef",
  "whatsappNumber": "+14155238886",
  "message": "Twilio WhatsApp está configurado y listo para usar"
}
```

### **5.2 Activar tu Número en Sandbox**

**IMPORTANTE:** Para recibir mensajes, debes activar tu número:

1. Abre WhatsApp
2. Envía al número de Twilio: `join [código]`
3. Espera confirmación

### **5.3 Enviar Mensaje de Prueba**

1. Ve a la aplicación: http://localhost:5173
2. Navega a **Reportes**
3. Selecciona un estudiante (que tenga teléfono)
4. Haz clic en **"Enviar por WhatsApp (1)"**
5. El estudiante recibirá el mensaje en WhatsApp

---

## 📊 Los 4 Botones en Reportes

| # | Botón | Color | Icono | Función |
|---|-------|-------|-------|---------|
| 1 | **Reporte Consolidado** | 🔵 Azul | 📄 | PDF de todos |
| 2 | **Envío Masivo** | 🟢 Verde | ✉️ | Emails masivos |
| 3 | **Configurar Correo** | 🟣 Púrpura | ⚙️ | Config email |
| 4 | **Envío por WhatsApp** | 🟢 Verde | 💬 | WhatsApp masivo |

---

## 💬 Ejemplo de Mensaje WhatsApp

```
🎓 *GradeApp - Reporte Académico*

¡Hola Juan Pérez! 👋

Te enviamos tu reporte académico actualizado 
correspondiente a lunes, 16 de diciembre de 2024.

📊 *Tu reporte incluye:*
• Calificaciones detalladas por materia
• Promedio de asignaciones y exámenes
• Calificación acumulada actualizada
• Estado de aprobación de cada materia

💡 *Recuerda:* Tu esfuerzo y dedicación son 
la clave del éxito. ¡Sigue trabajando con constancia!

Si tienes alguna pregunta sobre tus calificaciones, 
no dudes en contactarnos.

---
_GradeApp - Sistema de Gestión Académica_
📧 soporte@gradeapp.com
```

---

## 🔒 Limitaciones del Sandbox

### **Sandbox (Pruebas):**
- ⚠️ Solo puedes enviar a números que se unieron al sandbox
- ⚠️ Los mensajes incluyen "Sent from your Twilio trial account"
- ✅ Gratis para pruebas
- ✅ Perfecto para desarrollo

### **Producción (Requiere aprobación):**
- ✅ Envía a cualquier número
- ✅ Sin mensaje de prueba
- ✅ Número de WhatsApp propio
- 💰 Requiere cuenta de pago
- 📝 Requiere aprobación de Facebook

---

## 💰 Costos de Twilio WhatsApp

### **Sandbox (Gratis):**
- $0 - Ilimitado para pruebas
- Solo números que se unieron

### **Producción:**
- **Conversaciones iniciadas por negocio:**
  - $0.005 - $0.04 por mensaje (según país)
- **Conversaciones iniciadas por usuario:**
  - Gratis las primeras 24 horas

---

## 🚀 Pasar a Producción (Opcional)

### **Requisitos:**
1. Cuenta de pago en Twilio
2. Número de teléfono verificado
3. Plantilla de mensaje aprobada por Facebook
4. Perfil de negocio de Facebook

### **Proceso:**
1. **Solicitar número de WhatsApp:**
   - Twilio Console → WhatsApp → Request to enable
   
2. **Crear plantilla de mensaje:**
   - Debe ser aprobada por Facebook
   - Proceso toma 1-3 días

3. **Configurar webhook:**
   - Para recibir respuestas

---

## 🆘 Solución de Problemas

### **Error: "Twilio no está configurado"**

**Causa:** Credenciales faltantes

**Solución:**
1. Verifica que `.env` tenga las 3 variables
2. Reinicia el backend

---

### **Error: "The number +1234567890 is not a valid WhatsApp number"**

**Causa:** Número no activado en sandbox

**Solución:**
1. Abre WhatsApp
2. Envía `join [código]` al número de Twilio
3. Espera confirmación

---

### **Error: "Permission denied"**

**Causa:** Auth Token incorrecto

**Solución:**
1. Verifica el Auth Token en Twilio Console
2. Cópialo de nuevo al `.env`

---

### **Los mensajes no llegan**

**Solución:**
1. Verifica que el número tenga código de país (+)
2. Verifica que el número esté activado en sandbox
3. Revisa la consola del backend para errores

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Twilio creada
- [ ] WhatsApp Sandbox activado
- [ ] Tu número unido al sandbox (`join [código]`)
- [ ] Account SID obtenido
- [ ] Auth Token obtenido
- [ ] Número de WhatsApp copiado
- [ ] Variables agregadas a `.env`
- [ ] Backend reiniciado
- [ ] Configuración verificada en `/api/whatsapp/config`
- [ ] Estudiantes con teléfonos agregados
- [ ] Mensaje de prueba enviado exitosamente

---

## 📚 Recursos

**Twilio:**
- Console: https://console.twilio.com/
- Documentación: https://www.twilio.com/docs/whatsapp
- Precios: https://www.twilio.com/whatsapp/pricing

**WhatsApp Business API:**
- Políticas: https://www.whatsapp.com/legal/business-policy

---

## 🎉 ¡Listo!

Una vez completados los pasos:
- ✅ Los mensajes se enviarán **REALMENTE**
- ✅ Los estudiantes recibirán mensajes en WhatsApp
- ✅ Con formato profesional
- ✅ Progreso en tiempo real

**¡Ahora puedes enviar reportes por WhatsApp!** 🚀
