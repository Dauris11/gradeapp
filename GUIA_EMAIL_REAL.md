# 📧 Guía Completa: Envío Real de Reportes por Email

## 🎯 Opciones Disponibles

### **Opción 1: EmailJS (Recomendada - Más Fácil)** ⭐
- ✅ **Sin backend necesario**
- ✅ **Gratis hasta 200 emails/mes**
- ✅ **Configuración en 10 minutos**
- ✅ **Funciona desde el navegador**
- ❌ Límite de 200 emails/mes en plan gratuito

### **Opción 2: Backend con SendGrid**
- ✅ **Gratis hasta 100 emails/día**
- ✅ **Muy confiable**
- ✅ **Profesional**
- ❌ Requiere crear un backend (Node.js)

### **Opción 3: Backend con Resend**
- ✅ **Gratis hasta 3,000 emails/mes**
- ✅ **Moderno y fácil de usar**
- ✅ **Buena documentación**
- ❌ Requiere backend

---

## 🚀 OPCIÓN 1: EmailJS (Sin Backend)

### **Paso 1: Crear Cuenta en EmailJS**

1. Ve a: https://www.emailjs.com/
2. Click en **"Sign Up"**
3. Regístrate con tu email
4. Verifica tu email

### **Paso 2: Configurar Servicio de Email**

1. En el dashboard, ve a **"Email Services"**
2. Click en **"Add New Service"**
3. Selecciona tu proveedor (Gmail, Outlook, etc.)
4. **Para Gmail:**
   - Click en "Connect Account"
   - Autoriza EmailJS
   - Dale un nombre al servicio
   - Click en "Create Service"
5. **Copia el Service ID** (lo necesitarás)

### **Paso 3: Crear Template de Email**

1. Ve a **"Email Templates"**
2. Click en **"Create New Template"**
3. Configura el template:

```
Subject: 📊 Tu Reporte Académico - {{student_name}}

Content:
Hola {{student_name}},

Adjunto encontrarás tu reporte académico actualizado.

Este reporte incluye:
- Tus calificaciones por materia
- Promedio de tareas y exámenes
- Calificación acumulada
- Estado de aprobación

Saludos,
{{from_name}}
```

4. **Copia el Template ID**

### **Paso 4: Instalar EmailJS**

```bash
npm install @emailjs/browser
```

### **Paso 5: Obtener tus Credenciales**

1. Ve a **"Account"** → **"General"**
2. Copia tu **Public Key**

Tendrás 3 valores:
- **Service ID**: srv_xxxxx
- **Template ID**: template_xxxxx
- **Public Key**: tu_public_key

### **Paso 6: Crear Archivo de Configuración**

Crea: `src/config/emailConfig.js`

```javascript
export const EMAIL_CONFIG = {
    serviceId: 'srv_xxxxx',      // Tu Service ID
    templateId: 'template_xxxxx', // Tu Template ID
    publicKey: 'tu_public_key'    // Tu Public Key
};
```

### **Paso 7: Actualizar emailService.js**

Reemplaza el contenido con:

```javascript
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../config/emailConfig';

// Inicializar EmailJS
emailjs.init(EMAIL_CONFIG.publicKey);

export const EmailService = {
    // Enviar email real con PDF adjunto
    sendEmail: async (to, subject, body, pdfBlob, studentName) => {
        try {
            // Convertir PDF a base64
            const reader = new FileReader();
            const base64PDF = await new Promise((resolve, reject) => {
                reader.onload = () => {
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(pdfBlob);
            });

            // Preparar parámetros para el template
            const templateParams = {
                to_email: to,
                student_name: studentName,
                from_name: 'Sistema de Gestión Académica',
                subject: subject,
                message: body,
                pdf_attachment: base64PDF,
                pdf_name: `Reporte_${studentName.replace(/\s+/g, '_')}.pdf`
            };

            // Enviar email
            const response = await emailjs.send(
                EMAIL_CONFIG.serviceId,
                EMAIL_CONFIG.templateId,
                templateParams
            );

            return {
                success: true,
                message: `Email enviado exitosamente a ${to}`,
                messageId: response.text
            };
        } catch (error) {
            console.error('Error al enviar email:', error);
            throw new Error(`Error al enviar email: ${error.message}`);
        }
    },

    // Enviar reporte a estudiante
    sendStudentReport: async (student, pdfBlob) => {
        const subject = `📊 Tu Reporte Académico - ${new Date().toLocaleDateString('es-ES')}`;
        const body = `Hola ${student.name}, adjunto encontrarás tu reporte académico actualizado.`;
        
        return await EmailService.sendEmail(
            student.email,
            subject,
            body,
            pdfBlob,
            student.name
        );
    },

    // Envío masivo
    sendBulkReports: async (reports) => {
        const results = [];
        
        for (const report of reports) {
            try {
                const result = await EmailService.sendStudentReport(
                    report.student,
                    report.pdfBlob
                );
                results.push({
                    student: report.student.name,
                    email: report.student.email,
                    success: true,
                    ...result
                });
                
                // Esperar 1 segundo entre emails para no saturar
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                results.push({
                    student: report.student.name,
                    email: report.student.email,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }
};

export default EmailService;
```

### **Paso 8: Actualizar Template en EmailJS**

En el template de EmailJS, agrega soporte para adjuntos:

1. Ve a tu template
2. En "Settings" → "Attachments"
3. Agrega:
   - **Name**: {{pdf_name}}
   - **Content**: {{pdf_attachment}}
   - **Type**: application/pdf

### **Paso 9: ¡Probar!**

1. Recarga la aplicación
2. Ve a "Reportes"
3. Click en 📧 junto a un estudiante
4. ¡El email se enviará de verdad!

---

## 📊 Comparación de Opciones

| Característica | EmailJS | SendGrid | Resend |
|----------------|---------|----------|--------|
| **Emails gratis/mes** | 200 | 3,000 | 3,000 |
| **Requiere backend** | ❌ No | ✅ Sí | ✅ Sí |
| **Configuración** | 10 min | 30 min | 30 min |
| **Dificultad** | Fácil | Media | Media |
| **Adjuntos** | ✅ Sí | ✅ Sí | ✅ Sí |
| **Costo mensual** | $0-15 | $0-20 | $0-20 |

---

## 💰 Planes y Precios

### **EmailJS**
- **Gratis**: 200 emails/mes
- **Personal**: $15/mes - 1,000 emails
- **Professional**: $35/mes - 5,000 emails

### **SendGrid**
- **Gratis**: 100 emails/día (3,000/mes)
- **Essentials**: $20/mes - 50,000 emails

### **Resend**
- **Gratis**: 3,000 emails/mes
- **Pro**: $20/mes - 50,000 emails

---

## 🎯 Recomendación

### **Para Empezar (Menos de 200 estudiantes):**
✅ **EmailJS** - Sin backend, fácil, gratis

### **Para Escala Media (200-3,000 estudiantes):**
✅ **Resend** - Moderno, generoso plan gratuito

### **Para Producción Grande:**
✅ **SendGrid** - Muy confiable, usado por empresas grandes

---

## 🔒 Seguridad

### **Buenas Prácticas:**

1. **No expongas tus credenciales**
   ```javascript
   // ❌ MAL
   const apiKey = 'mi_clave_secreta';
   
   // ✅ BIEN
   const apiKey = import.meta.env.VITE_EMAIL_API_KEY;
   ```

2. **Usa variables de entorno**
   ```bash
   # .env
   VITE_EMAILJS_SERVICE_ID=srv_xxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
   VITE_EMAILJS_PUBLIC_KEY=tu_public_key
   ```

3. **Valida emails antes de enviar**
   ```javascript
   const isValidEmail = (email) => {
       return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   };
   ```

---

## 🧪 Testing

### **Probar sin Enviar Emails Reales:**

```javascript
const isDevelopment = import.meta.env.DEV;

if (isDevelopment) {
    console.log('📧 Email que se enviaría:', {
        to: student.email,
        subject,
        pdfSize: pdfBlob.size
    });
    return { success: true, message: 'Modo desarrollo' };
}
```

---

## 📝 Checklist de Implementación

- [ ] Crear cuenta en EmailJS
- [ ] Configurar servicio de email (Gmail/Outlook)
- [ ] Crear template de email
- [ ] Copiar Service ID, Template ID, Public Key
- [ ] Instalar `@emailjs/browser`
- [ ] Crear `emailConfig.js`
- [ ] Actualizar `emailService.js`
- [ ] Configurar adjuntos en template
- [ ] Probar con un email de prueba
- [ ] Verificar que llega el PDF
- [ ] Probar envío masivo (2-3 emails)
- [ ] ¡Listo para producción!

---

## 🆘 Troubleshooting

### **"Email no llega"**
- Revisa spam/correo no deseado
- Verifica que el email del estudiante sea válido
- Revisa la consola de EmailJS

### **"PDF no se adjunta"**
- Verifica que configuraste "Attachments" en el template
- El PDF debe estar en base64
- Tamaño máximo: 5MB

### **"Error 403"**
- Verifica tu Public Key
- Revisa que el dominio esté autorizado en EmailJS

---

## 🚀 Próximos Pasos

1. **Decide qué opción usar** (recomiendo EmailJS para empezar)
2. **Sigue los pasos** de configuración
3. **Prueba** con tu propio email primero
4. **Escala** cuando tengas más estudiantes

¿Quieres que te ayude a implementar EmailJS paso a paso?
