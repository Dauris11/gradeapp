# ============================================
# GUÍA DE CONFIGURACIÓN DE SENDGRID
# ============================================

## 📧 ¿Qué es SendGrid?

SendGrid es un servicio de envío de correos electrónicos transaccionales que permite enviar reportes de calificaciones por email de forma profesional y confiable.

## 🚀 Pasos para Configurar SendGrid

### 1. Crear una Cuenta en SendGrid

1. Ve a [https://signup.sendgrid.com/](https://signup.sendgrid.com/)
2. Completa el formulario de registro:
   - **Email**: Tu correo electrónico
   - **Nombre completo**
   - **Contraseña**
3. Verifica tu correo electrónico
4. Completa el cuestionario inicial de SendGrid

### 2. Obtener tu API Key

1. Inicia sesión en [https://app.sendgrid.com/](https://app.sendgrid.com/)
2. Ve a **Settings** → **API Keys** (en el menú lateral izquierdo)
3. Haz clic en **Create API Key**
4. Configura la API Key:
   - **API Key Name**: `GradeApp Production` (o el nombre que prefieras)
   - **API Key Permissions**: Selecciona **Full Access** (o **Restricted Access** con permisos de Mail Send)
5. Haz clic en **Create & View**
6. **¡IMPORTANTE!** Copia la API Key inmediatamente (solo se muestra una vez)
   - Formato: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Verificar tu Dominio o Email de Remitente

#### Opción A: Single Sender Verification (Más Rápido - Recomendado para empezar)

1. Ve a **Settings** → **Sender Authentication**
2. Haz clic en **Verify a Single Sender**
3. Completa el formulario:
   - **From Name**: `GradeApp - Sistema Académico`
   - **From Email Address**: Tu email verificado (ej: `tucorreo@gmail.com`)
   - **Reply To**: El mismo email o uno diferente
   - **Company Address**: Dirección de tu institución
4. Haz clic en **Create**
5. Revisa tu correo y haz clic en el enlace de verificación
6. Una vez verificado, podrás usar ese email como remitente

#### Opción B: Domain Authentication (Profesional - Requiere acceso a DNS)

1. Ve a **Settings** → **Sender Authentication**
2. Haz clic en **Authenticate Your Domain**
3. Sigue el asistente para configurar los registros DNS de tu dominio
4. Una vez verificado, podrás usar cualquier email de ese dominio

### 4. Configurar el Archivo .env

1. En la carpeta `backend`, crea un archivo llamado `.env` (sin extensión)
2. Copia el contenido del archivo `.env.example`
3. Completa con tus datos:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.tu_api_key_completa_aqui

# Email Configuration
FROM_EMAIL=tucorreo@gmail.com
FROM_NAME=GradeApp - Sistema Académico
REPLY_TO_EMAIL=tucorreo@gmail.com

# Server Configuration
PORT=3001
```

**Ejemplo completo:**
```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.abc123xyz789_tu_api_key_real_aqui

# Email Configuration
FROM_EMAIL=noreply@miescuela.com
FROM_NAME=Sistema de Calificaciones - Mi Escuela
REPLY_TO_EMAIL=soporte@miescuela.com

# Server Configuration
PORT=3001
```

### 5. Reiniciar el Backend

Después de configurar el archivo `.env`:

```bash
# Detener el servidor actual (Ctrl+C en la terminal)
# Luego reiniciar:
cd backend
npm start
```

Deberías ver el mensaje:
```
✅ SendGrid configurado correctamente
```

## 🧪 Probar el Envío de Emails

### Desde la Aplicación:

1. Ve a la página de **Reportes**
2. Selecciona un estudiante
3. Haz clic en **Enviar por Email**
4. Ingresa el correo del destinatario
5. Haz clic en **Enviar**

### Verificar en SendGrid:

1. Ve a **Activity** en el panel de SendGrid
2. Verás todos los emails enviados con su estado:
   - ✅ **Delivered**: Email entregado exitosamente
   - ⏳ **Processed**: Email en proceso
   - ❌ **Bounced**: Email rebotado (dirección inválida)
   - ❌ **Dropped**: Email descartado

## 📊 Límites del Plan Gratuito

SendGrid ofrece un plan gratuito con:
- **100 emails por día** de forma permanente
- Sin tarjeta de crédito requerida
- Perfecto para instituciones pequeñas o pruebas

## ⚠️ Solución de Problemas

### Error: "SendGrid no está configurado"
- Verifica que el archivo `.env` existe en la carpeta `backend`
- Verifica que `SENDGRID_API_KEY` está correctamente escrita (sin espacios)
- Reinicia el servidor backend

### Error: "The from address does not match a verified Sender Identity"
- Verifica que el email en `FROM_EMAIL` está verificado en SendGrid
- Ve a Settings → Sender Authentication y verifica tu email

### Error: "Forbidden"
- Verifica que tu API Key tiene permisos de Mail Send
- Crea una nueva API Key con Full Access

### Los emails llegan a spam
- Configura Domain Authentication (Opción B)
- Evita palabras spam en el asunto
- Usa un dominio profesional en lugar de Gmail/Hotmail

## 🔒 Seguridad

**IMPORTANTE:**
- ⚠️ **NUNCA** compartas tu API Key públicamente
- ⚠️ **NUNCA** subas el archivo `.env` a GitHub
- ✅ El archivo `.env` ya está en `.gitignore`
- ✅ Usa `.env.example` como plantilla (sin datos sensibles)

## 📚 Recursos Adicionales

- [Documentación de SendGrid](https://docs.sendgrid.com/)
- [Guía de Autenticación de Remitente](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication)
- [API Reference](https://docs.sendgrid.com/api-reference/mail-send/mail-send)

## ✅ Checklist de Configuración

- [ ] Cuenta de SendGrid creada
- [ ] Email verificado en SendGrid
- [ ] API Key generada y copiada
- [ ] Sender Identity verificado
- [ ] Archivo `.env` creado en `backend`
- [ ] Variables de entorno configuradas
- [ ] Backend reiniciado
- [ ] Mensaje "✅ SendGrid configurado correctamente" visible
- [ ] Email de prueba enviado exitosamente

---

**¿Necesitas ayuda?** Revisa la sección de Solución de Problemas o consulta la documentación oficial de SendGrid.
