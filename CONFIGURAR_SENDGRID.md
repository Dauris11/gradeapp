# 🚀 CONFIGURACIÓN DE SENDGRID - GUÍA COMPLETA

## ✅ Sistema Configurado

El sistema de envío de correos con SendGrid está completamente configurado y listo para usar.

---

## 📋 PASO 1: Crear Cuenta en SendGrid

### **1.1 Registrarse**
1. Ve a: https://signup.sendgrid.com/
2. Completa el formulario de registro
3. Verifica tu correo electrónico
4. Completa el perfil de tu cuenta

### **1.2 Plan Gratuito**
SendGrid ofrece un plan gratuito con:
- ✅ **100 emails por día**
- ✅ **Sin tarjeta de crédito requerida**
- ✅ Perfecto para empezar

---

## 🔑 PASO 2: Obtener API Key

### **2.1 Crear API Key**
1. Inicia sesión en SendGrid
2. Ve a **Settings** → **API Keys**
3. Haz clic en **"Create API Key"**
4. Configuración:
   ```
   API Key Name: GradeApp
   API Key Permissions: Full Access
   ```
5. Haz clic en **"Create & View"**
6. **COPIA LA API KEY** (solo se muestra una vez)
   ```
   SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### **2.2 Guardar API Key**
⚠️ **MUY IMPORTANTE:** Guarda la API Key en un lugar seguro. No la compartas.

---

## ⚙️ PASO 3: Configurar el Backend

### **3.1 Crear archivo .env**

En la carpeta `backend`, crea un archivo llamado `.env`:

```bash
cd backend
# En Windows PowerShell:
New-Item .env -ItemType File
```

### **3.2 Agregar configuración**

Abre el archivo `.env` y agrega:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.tu_api_key_aqui

# Email Configuration
FROM_EMAIL=noreply@tudominio.com
FROM_NAME=Tu Institución Educativa
REPLY_TO_EMAIL=soporte@tudominio.com

# Server Configuration
PORT=3001
```

**Reemplaza:**
- `SG.tu_api_key_aqui` → Tu API Key de SendGrid
- `noreply@tudominio.com` → Tu correo institucional
- `Tu Institución Educativa` → Nombre de tu institución
- `soporte@tudominio.com` → Correo de soporte

### **3.3 Ejemplo Real**

```env
SENDGRID_API_KEY=SG.abc123xyz789...
FROM_EMAIL=noreply@colegio-ejemplo.edu
FROM_NAME=Colegio Ejemplo - Sistema Académico
REPLY_TO_EMAIL=academico@colegio-ejemplo.edu
PORT=3001
```

---

## 📧 PASO 4: Verificar Dominio (Opcional pero Recomendado)

### **4.1 ¿Por qué verificar?**
- ✅ Mejora la entrega de emails
- ✅ Evita que lleguen a spam
- ✅ Permite usar tu dominio real

### **4.2 Cómo verificar**
1. En SendGrid, ve a **Settings** → **Sender Authentication**
2. Haz clic en **"Authenticate Your Domain"**
3. Sigue las instrucciones para agregar registros DNS
4. Espera la verificación (puede tomar hasta 48 horas)

### **4.3 Mientras tanto**
Puedes usar el correo de verificación de SendGrid:
```
FROM_EMAIL=tu-email@example.com
```
(Reemplaza con el email que usaste para registrarte en SendGrid)

---

## 🧪 PASO 5: Probar el Sistema

### **5.1 Reiniciar el Backend**

```bash
# Detén el servidor (Ctrl+C)
# Inicia de nuevo
cd backend
npm start
```

Deberías ver:
```
✅ SendGrid configurado correctamente
🚀 Backend corriendo en http://localhost:3001
```

### **5.2 Verificar Configuración**

Abre en tu navegador:
```
http://localhost:3001/api/email/config
```

Deberías ver:
```json
{
  "configured": true,
  "fromEmail": "noreply@tudominio.com",
  "fromName": "Tu Institución",
  "replyTo": "soporte@tudominio.com",
  "message": "SendGrid está configurado y listo para usar"
}
```

### **5.3 Enviar Email de Prueba**

1. Ve a la aplicación: http://localhost:5173
2. Navega a **Reportes**
3. Haz clic en **"Configurar Correo"**
4. Verifica la configuración
5. Selecciona un estudiante
6. Haz clic en **"Enviar Seleccionados"**

---

## 📊 PASO 6: Monitorear Envíos

### **6.1 Dashboard de SendGrid**
1. Ve a: https://app.sendgrid.com/
2. Haz clic en **"Activity"**
3. Verás todos los emails enviados

### **6.2 Estadísticas**
SendGrid te muestra:
- ✅ Emails enviados
- ✅ Emails entregados
- ✅ Emails abiertos
- ✅ Clicks en enlaces
- ❌ Emails rebotados

---

## 🔒 SEGURIDAD

### **Proteger tu API Key**

1. **NUNCA** subas el archivo `.env` a Git
   - Ya está en `.gitignore` ✅

2. **NUNCA** compartas tu API Key
   - Es como una contraseña

3. **Si la expones accidentalmente:**
   - Ve a SendGrid → Settings → API Keys
   - Elimina la API Key comprometida
   - Crea una nueva

---

## 🆘 Solución de Problemas

### **Error: "SendGrid no está configurado"**

**Causa:** No hay API Key en `.env`

**Solución:**
1. Verifica que el archivo `.env` existe en `backend/`
2. Verifica que tiene `SENDGRID_API_KEY=...`
3. Reinicia el servidor

---

### **Error: "Unauthorized"**

**Causa:** API Key inválida

**Solución:**
1. Verifica que copiaste la API Key completa
2. Verifica que no tiene espacios al inicio/final
3. Crea una nueva API Key en SendGrid

---

### **Error: "The from email does not match a verified Sender Identity"**

**Causa:** El correo remitente no está verificado

**Solución:**
1. Usa el email con el que te registraste en SendGrid
2. O verifica tu dominio (Paso 4)

---

### **Los emails llegan a spam**

**Solución:**
1. Verifica tu dominio en SendGrid
2. Configura SPF y DKIM
3. Usa un correo real (no noreply@...)

---

## 📈 Límites del Plan Gratuito

| Característica | Límite |
|----------------|--------|
| Emails por día | 100 |
| Emails por mes | ~3,000 |
| Validez de API Key | Ilimitada |
| Soporte | Email |

### **Si necesitas más:**
- **Essentials:** $19.95/mes - 50,000 emails/mes
- **Pro:** $89.95/mes - 100,000 emails/mes

---

## ✅ Checklist de Configuración

- [ ] Cuenta de SendGrid creada
- [ ] API Key obtenida
- [ ] Archivo `.env` creado en `backend/`
- [ ] API Key agregada a `.env`
- [ ] Correos configurados en `.env`
- [ ] Backend reiniciado
- [ ] Configuración verificada en `/api/email/config`
- [ ] Email de prueba enviado exitosamente
- [ ] Dominio verificado (opcional)

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu sistema de envío de correos estará **100% funcional** con SendGrid.

**Los estudiantes recibirán:**
- ✅ Correos profesionales con tu logo
- ✅ Reportes PDF adjuntos
- ✅ Desde tu correo institucional
- ✅ Con opción de responder

---

## 📞 Soporte

**SendGrid:**
- Documentación: https://docs.sendgrid.com/
- Soporte: https://support.sendgrid.com/

**GradeApp:**
- Revisa la consola del backend para errores
- Revisa la consola del navegador para errores del frontend

---

**¡Ahora puedes enviar correos reales a tus estudiantes!** 🚀
