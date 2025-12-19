const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const { autoUpdater } = require('electron-updater');

// Configurar AutoUpdater
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on('update-available', () => {
    // Opcional: Notificar visualmente si lo desearas, por ahora log
    console.log('📦 Nueva actualización disponible. Descargando...');
});

autoUpdater.on('update-downloaded', () => {
    console.log('✅ Actualización descargada. Se instalará al cerrar.');
    // Opcional: Preguntar al usuario si quiere reiniciar ya
    dialog.showMessageBox({
        type: 'info',
        title: 'Actualización Lista',
        message: 'Una nueva versión se ha descargado. Se instalará automáticamente al cerrar la aplicación.',
        buttons: ['Entendido']
    });
});


let mainWindow;
let splashWindow;
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'grade_manager.db');
const whatsappSessionPath = path.join(userDataPath, 'whatsapp-session');

// Configurar variables de entorno para el backend
process.env.DB_PATH_CUSTOM = dbPath;
process.env.WHATSAPP_SESSION_PATH = whatsappSessionPath;

let backendServer;
try {
    // Importar backend directamente (se ejecuta en el proceso principal)
    // Esto asegura que compartan node_modules y evita problemas de rutas/forks
    backendServer = require('../backend/server.js');
} catch (err) {
    console.error('❌ Error fatal cargando módulo de backend:', err);
}

function startServer() {
    if (backendServer) {
        console.log('🚀 Iniciando servidor backend (integrado)...');
        // El puerto puede ser 3001
        backendServer.startServer(3001);
    }
}

function stopServer() {
    if (backendServer) {
        console.log('🛑 Deteniendo servidor backend...');
        backendServer.stopServer();
    }
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 400,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    icon: path.join(__dirname, '../public/imagenes/logo-principal.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  
  // Forzar que aparezca encima de todo (nivel screen-saver)
  splashWindow.setAlwaysOnTop(true, 'screen-saver');
  splashWindow.focus();
  
  // Clean up when closed
  splashWindow.on('closed', () => {
    splashWindow = null;
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, '../public/imagenes/logo-principal.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true // En producción esto debe ser true
    },
    backgroundColor: '#F8FAFC', // Color de fondo para evitar blanco puro antes de carga
    show: false, // Importante: No mostrar hasta que esté lista
    autoHideMenuBar: true,
    frame: true,
    titleBarStyle: 'default'
  });

  // En desarrollo, carga desde Vite
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    // Abre DevTools en desarrollo
    // mainWindow.webContents.openDevTools();
  } else {
    // En producción, carga el build
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    // Simular un tiempo mínimo de carga para que se vea el splash (branding)
    setTimeout(() => {
      if (splashWindow) {
        splashWindow.minimize(); // Efecto visual
        splashWindow.close();
      }
      mainWindow.show();
      mainWindow.focus();
    }, 3000); // 3 segundos de delay para asegurar que el backend arrancó
  });

  // Manejar cierre de ventana
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevenir navegación externa
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost:5173') && !url.startsWith('file://')) {
      event.preventDefault();
    }
  });
}

// Crear ventana cuando la app esté lista
app.whenReady().then(() => {
  startServer(); // INICIAR BACKEND
  createSplashWindow();
  // Pequeño delay para iniciar la carga de la main window después de mostrar el splash
  setTimeout(createWindow, 500);

  // Buscar actualizaciones si es producción
  if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Cerrar app cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
    stopServer(); // DETENER BACKEND
});

// Configuración adicional
app.on('ready', () => {
  // Deshabilitar aceleración de hardware si hay problemas de rendimiento
  // app.disableHardwareAcceleration();
});
