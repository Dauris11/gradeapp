# Guía de Despliegue Web para Grade Manager

Esta aplicación utiliza tecnologías modernas (**React + Node.js**) y características especiales (**SQLite** y **WhatsApp Web**). Debido a esto, **no** se recomienda usar un hosting compartido tradicional (como los baratos de PHP/cPanel).

Lo ideal para este proyecto es un **VPS (Servidor Privado Virtual)** o un servicio de nube tipo **Railway/Render** que soporte almacenamiento persistente (disco).

---

## 🏗️ 1. Preparación del Código (Antes de subir)

Antes de comprar nada, necesitamos unir el Frontend (React) con el Backend (Node) para que funcionen como una sola unidad en el servidor.

### A. Configurar el Backend para servir el Frontend
1. Ve a la carpeta `backend`.
2. Asegúrate de que tu `server.js` (o `index.js`) tenga estas líneas después de tus rutas de API y antes de `app.listen`:

```javascript
const path = require('path');

// Servir archivos estáticos del build de React
// Asumiendo que 'dist' está en la raíz del proyecto, un nivel arriba de 'backend'
app.use(express.static(path.join(__dirname, '../dist')));

// Manejar cualquier otra ruta devolviendo el index.html (para React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});
```

### B. Crear el "Build" de Producción
En tu computadora local:
1. Abre la terminal en la carpeta raíz del proyecto.
2. Ejecuta:
   ```bash
   npm run build
   ```
   *Esto creará una carpeta `dist` con tu aplicación optimizada.*

---

## 🌐 2. Comprar el Dominio (Tu nombre en internet)

Es la dirección web (ej. `micoledio.com`).

**Dónde comprar:**
*   **Namecheap** (Recomendado, buen soporte y precios).
*   **Google Domains** (Fácil de usar).
*   **GoDaddy** (Popular, pero cuidado con los precios de renovación).

**Pasos:**
1. Busca el nombre que quieres.
2. Cómpralo (cuesta entre $10 - $15 USD al año).
3. **No** compres el hosting "añadido" que te ofrecen ahí. Solo el dominio.

---

## ☁️ 3. Comprar el Hosting (Servidor VPS)

Necesitamos un servidor "Linux" donde podamos instalar Node.js y guardar tu base de datos SQLite.

**Recomendación: Railway (Más fácil) o Hostinger VPS / DigitalOcean (Más barato/control).**

### Opción A: Railway (Recomendada para principiantes)
Es una plataforma que configura casi todo por ti.
1. Crea una cuenta en [Railway.app](https://railway.app/).
2. Conecta tu cuenta de **GitHub**.
3. Sube tu código a un repositorio de GitHub (si no lo has hecho).
4. Crea un "New Project" desde ese repositorio.
5. **IMPORTANTE:** Como usas SQLite y WhatsApp (que necesitan guardar sesión y datos):
   *   Debes añadir un **Volume** (Disco persistente) en la configuración de Railway y montarlo en la ruta donde esté tu archivo `.db` y la carpeta `.wwebjs_auth`.
   *   Si no haces esto, cada vez que actualices la web, **se borrará tu base de datos y se desconectará el WhatsApp**.

### Opción B: VPS Clásico (Hostinger, DigitalOcean) - Nivel Intermedio
Te da una computadora en la nube vacía. Es más barato a largo plazo y tienes control total.

1. **Comprar:** Busca un "VPS KVM" (con 1GB o 2GB de RAM mínimo para WhatsApp). Sistema Operativo: **Ubuntu 22.04**.
2. **Acceso:** Te darán una IP (ej. `192.168.1.5`) y contraseña root.
3. **Instalación:**
   Entras por consola (SSH): `ssh root@192.168.1.5`

   Ejecuta estos comandos para instalar el entorno:
   ```bash
   # Actualizar sistema
   sudo apt update && sudo apt upgrade -y

   # Instalar Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Instalar librerías para Puppeteer (WhatsApp)
   sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
   ```

---

## 🚀 4. Subir la Web y Base de Datos (En VPS)

1. **Copiar archivos:** Usa un programa como **FileZilla** (SFTP).
   *   Conéctate con la IP, usuario `root` y tu contraseña.
   *   Sube toda tu carpeta del proyecto (excepto `node_modules`).
   *   Asegúrate de subir la carpeta `dist` (el build del frontend).

2. **Instalar dependencias en el servidor:**
   ```bash
   cd /ruta/de/tu/proyecto
   npm install
   ```

3. **Ejecutar la aplicación:**
   Usaremos `PM2` para que la app no se apague nunca.
   ```bash
   sudo npm install -g pm2
   cd backend
   pm2 start server.js --name "grade-manager"
   pm2 save
   pm2 startup
   ```

---

## 🔗 5. Conectar Dominio y HTTPS (Candado Verde)

Si usas VPS (Opción B):

1. **Configurar DNS:** Ve a donde compraste el dominio (Namecheap/GoDaddy).
   *   Crea un registro **Type A**.
   *   Host: `@`
   *   Value: `La IP de tu servidor VPS`.

2. **Instalar Nginx (Servidor Web):**
   En tu consola del VPS:
   ```bash
   sudo apt install nginx
   ```

3. **Configurar Nginx:**
   Edita el archivo de configuración: `sudo nano /etc/nginx/sites-available/default` y pon esto (reemplaza `tudominio.com`):

   ```nginx
   server {
       listen 80;
       server_name tudominio.com www.tudominio.com;

       location / {
           proxy_pass http://localhost:3001; # Tu puerto de Node.js
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Guarda (Ctrl+O) y sal (Ctrl+X). Reinicia: `sudo systemctl restart nginx`.

4. **Certificado SSL (HTTPS Gratuito):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tudominio.com -d www.tudominio.com
   ```
   ¡Listo! Certbot configurará el candado verde automáticamente.

---

## ✅ Resumen de la Arquitectura Final

*   **Usuario** -> Entra a `tudominio.com` (HTTPS).
*   **Nginx** -> Recibe la petición y se la pasa a Node.js.
*   **Node.js (Express)** -> Sirve el Frontend (React) y la API.
*   **SQLite** -> Guarda los datos en el disco del servidor.
*   **WhatsApp Lib** -> Ejecuta un Chrome oculto en el servidor para enviar mensajes.
