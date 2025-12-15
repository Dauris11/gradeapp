const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

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
      webSecurity: true
    },
    backgroundColor: '#F5F5F5',
    show: false,
    autoHideMenuBar: true,
    frame: true,
    titleBarStyle: 'default'
  });

  // En desarrollo, carga desde Vite
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    // Abre DevTools en desarrollo
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, carga el build
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
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
  createWindow();

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

// Configuración adicional
app.on('ready', () => {
  // Deshabilitar aceleración de hardware si hay problemas de rendimiento
  // app.disableHardwareAcceleration();
});
