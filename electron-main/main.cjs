const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let splashWindow;
let serverProcess;

function startServer() {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  let backendPath;
  
  // Ruta donde se guardarán los datos del usuario (persistencia)
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'grade_manager.db');

  if (isDev) {
    backendPath = path.join(__dirname, '../backend/server.js');
  } else {
    // En producción, asumimos que la carpeta 'backend' se copió a 'resources'
    backendPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'server.js');
    // Fallback por si no está unpacked
    if (!require('fs').existsSync(backendPath)) {
        backendPath = path.join(process.resourcesPath, 'backend', 'server.js');
    }
  }

  console.log('🚀 Iniciando servidor backend...');
  console.log('📍 Script:', backendPath);
  console.log('💾 DB:', dbPath);

  try {
    // Iniciar servidor como proceso hijo
    // ELECTRON_RUN_AS_NODE asegura que use el binario de Node interno de Electron
    serverProcess = fork(backendPath, [], {
      env: {
        ...process.env,
        DB_PATH_CUSTOM: dbPath,
        ELECTRON_RUN_AS_NODE: 1,
        PORT: 3001
      },
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(`[Backend]: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`[Backend Error]: ${data}`);
    });

  } catch (err) {
    console.error('❌ Error fatal iniciando backend:', err);
  }
}

function stopServer() {
  if (serverProcess) {
    console.log('🛑 Deteniendo servidor backend...');
    serverProcess.kill();
    serverProcess = null;
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
