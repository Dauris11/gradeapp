# 📧 Configuración Rápida de SendGrid

## ⚡ Inicio Rápido (5 minutos)

### Opción 1: Script Automático (Recomendado)

```bash
cd backend
node configurar-sendgrid.js
```

El script te guiará paso a paso para configurar SendGrid.

### Opción 2: Configuración Manual

1. **Obtén tu API Key de SendGrid:**
   - Ve a https://app.sendgrid.com/settings/api_keys
   - Crea una nueva API Key con permisos de "Mail Send"
   - Copia la API Key (empieza con `SG.`)

2. **Verifica tu email de remitente:**
   - Ve a https://app.sendgrid.com/settings/sender_auth
   - Verifica un "Single Sender" con tu email

3. **Crea el archivo `.env` en la carpeta `backend`:**

```env
SENDGRID_API_KEY=SG.tu_api_key_aqui
FROM_EMAIL=tucorreo@gmail.com
FROM_NAME=GradeApp - Sistema Académico
REPLY_TO_EMAIL=tucorreo@gmail.com
PORT=3001
```

4. **Reinicia el servidor:**

```bash
# Detener el servidor (Ctrl+C)
npm start
```

Deberías ver: `✅ SendGrid configurado correctamente`

## 🧪 Probar

1. Abre la aplicación en http://localhost:5173
2. Ve a **Reportes**
3. Selecciona un estudiante
4. Haz clic en **Enviar por Email**
5. Ingresa un email de prueba
6. ¡Revisa tu bandeja de entrada!

## ❓ ¿Problemas?

- **"SendGrid no está configurado"** → Verifica que el archivo `.env` existe y tiene la API Key
- **"The from address does not match"** → Verifica tu email en SendGrid (Sender Authentication)
- **Los emails llegan a spam** → Normal al principio, configura Domain Authentication para mejorar

## 📚 Documentación Completa

Ver: `CONFIGURAR_SENDGRID_COMPLETO.md`

## 🆓 Plan Gratuito

SendGrid ofrece **100 emails gratis por día** permanentemente, sin tarjeta de crédito.
