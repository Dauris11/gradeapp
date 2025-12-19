const { ipcMain } = require('electron');

let mainWindow;
let splashWindow;
let updateWindow; // Nueva ventana de actualización

// ... (Rest of imports and server setup code remains same until createSplashWindow) ...

// ---------- CONFIGURACIÓN AUTO UPDATER CON INTERFAZ PERSONALIZADA ----------
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = false; // Lo gestionamos manualmente con el botón

function createUpdateWindow() {
  if (updateWindow) return; // Ya existe

  updateWindow = new BrowserWindow({
    width: 400,
    height: 350,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    webPreferences: {
      nodeIntegration: true, // Necesario para el script simple del HTML
      contextIsolation: false
    }
  });

  updateWindow.loadFile(path.join(__dirname, 'update.html'));
  
  updateWindow.on('closed', () => {
    updateWindow = null;
    // Si se cierra el updater y no hay main window (ej: inicio), cerrar app
    if (!mainWindow && !splashWindow) app.quit();
  });
}

// Eventos del AutoUpdater
autoUpdater.on('checking-for-update', () => {
    // Si la APP ya está abierta, no molestamos con la ventana de carga
    // Solo si estamos en el arranque (splash) podríamos mostrar algo, o dejarlo silencioso
    console.log('� Buscando actualizaciones...');
});

autoUpdater.on('update-available', () => {
    console.log('📦 Actualización encontrada.');
    // Si hay actualización, mostramos la ventana de actualización
    // Opcional: Solo si es crítica, o siempre. 
    // Para UX moderna: Mostrar notificación o pequeño indicador en mainWindow si ya está abierta.
    // Si estamos en SPLASH, podríamos cambiar a Update Window.
    if (splashWindow) {
        splashWindow.close();
        createUpdateWindow();
    } else if (mainWindow) {
        // Si ya está usando la app, quizás una notificación toast. 
        // Por simplicidad del requerimiento "updater con interfaz": abrimos ventana.
        createUpdateWindow();
    }
});

autoUpdater.on('update-not-available', () => {
    console.log('✅ No hay actualizaciones.');
    if (updateWindow) {
        updateWindow.webContents.send('update-not-available');
        // El HTML se encargará de cerrarse o lo cerramos aquí tras delay
        setTimeout(() => {
             if (updateWindow) updateWindow.close();
             // Si estábamos en arranque y no había main window, crearla
             if (!mainWindow) setTimeout(createWindow, 500);
        }, 2000);
    }
});

autoUpdater.on('download-progress', (progressObj) => {
    if (updateWindow) {
        updateWindow.webContents.send('update-progress', progressObj.percent);
    }
});

autoUpdater.on('update-downloaded', () => {
    console.log('✅ Descarga completada.');
    if (updateWindow) {
        updateWindow.webContents.send('update-downloaded');
        // Ahora el usuario verá el botón "Reiniciar"
    } else {
        // Si se descargó en segundo plano, notificamos o preguntamos
        // dialog.showMessageBox... (Opcional, pero el usuario pidió UI personalizada)
        createUpdateWindow();
        setTimeout(() => {
            if(updateWindow) updateWindow.webContents.send('update-downloaded');
        }, 1000); // Dar tiempo a cargar
    }
});

autoUpdater.on('error', (err) => {
    console.error('Error en actualización:', err);
    if (updateWindow) {
        updateWindow.webContents.send('error', err.message);
    }
});

// Comunicación IPC desde update.html
ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

ipcMain.on('close_update_window', () => {
    if (updateWindow) updateWindow.close();
    // Si no hay ventana principal, continuar carga normal
    if (!mainWindow) createWindow();
});

// ---------------------------------------------------------------------------

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
  splashWindow.setAlwaysOnTop(true, 'screen-saver');
  splashWindow.focus();
  
  splashWindow.on('closed', () => {
    splashWindow = null;
  });
}

function createWindow() {
  if (mainWindow) return; // Evitar duplicados

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
    backgroundColor: '#F8FAFC', 
    show: false, 
    autoHideMenuBar: true,
    frame: true,
    titleBarStyle: 'default'
  });

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
      // Si tenemos ventana de update abierta, no mostrar main todavía o mantenerla detrás
      if (updateWindow) {
          // Esperamos
      } else {
        if (splashWindow) {
            splashWindow.close();
        }
        mainWindow.show();
        mainWindow.focus();
      }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost:5173') && !url.startsWith('file://')) {
      event.preventDefault();
      require('electron').shell.openExternal(url); // Abrir enlaces externos en navegador
    }
  });
}

app.whenReady().then(() => {
  startServer(); // INICIAR BACKEND
  
  // En PROD verificamos updates ANTES de mostrar la app grande
  if (app.isPackaged) {
      // Creamos splash mientras busca
      createSplashWindow();
      
      // Buscar update
      autoUpdater.checkForUpdates();
      
      // Si tarda mucho sin responder (timeout de 5s), lanzamos la app
      // Esto evita que se quede en el splash si no hay internet
      setTimeout(() => {
          if (splashWindow && !updateWindow && !mainWindow) {
              console.log('⚠️ Timeout buscando updates. Iniciando app...');
              createWindow();
          }
      }, 5000);
      
  } else {
      // DEV MODE
      createSplashWindow();
      setTimeout(() => {
          createWindow();
      }, 3000);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
    stopServer(); // DETENER BACKEND
});

app.on('ready', () => {
  // app.disableHardwareAcceleration();
});
