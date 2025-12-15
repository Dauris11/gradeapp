import electron from 'electron';
console.log('ELECTRON MODULE:', electron);
const { app, BrowserWindow, ipcMain } = electron;
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import local modules (using require for CJS compatibility if needed, or import if they were ESM)
// db.cjs and db_ops.cjs are CJS.
const { init } = require('./db.cjs');
const dbOps = require('./db_ops.cjs');
const { seedDatabase } = require('./seed.cjs');

// Determine DB path
const isDev = process.env.NODE_ENV === 'development';
const dbPath = isDev 
  ? path.join(process.cwd(), 'database.db') 
  : path.join(app.getPath('userData'), 'database.db');

// Initialize DB WITH PATH
init(dbPath);

// Seed DB
seedDatabase();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../electron/preload.cjs'), // careful with path, folder was renamed to backend?
      // Wait, I renamed electron -> backend. So preload is in backend/preload.cjs
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// IPC Handlers
ipcMain.handle('auth:login', async (_, { username, password }) => dbOps.loginUser(username, password));
ipcMain.handle('auth:register', async (_, { username, password, role }) => dbOps.createUser(username, password, role));

ipcMain.handle('users:getAll', async () => dbOps.getUsers());
ipcMain.handle('users:update', async (_, { id, ...data }) => dbOps.updateUser(id, data));
ipcMain.handle('users:delete', async (_, id) => dbOps.deleteUser(id));

ipcMain.handle('students:getAll', async () => dbOps.getStudents());
ipcMain.handle('students:create', async (_, student) => dbOps.createStudent(student));
ipcMain.handle('students:update', async (_, { id, ...data }) => dbOps.updateStudent(id, data));
ipcMain.handle('students:delete', async (_, id) => dbOps.deleteStudent(id));

ipcMain.handle('subjects:getAll', async () => dbOps.getSubjects());
ipcMain.handle('subjects:create', async (_, subject) => dbOps.createSubject(subject));

ipcMain.handle('grades:enroll', async (_, { studentId, subjectId, term }) => dbOps.enrollStudent(studentId, subjectId, term));
ipcMain.handle('grades:getByStudent', async (_, studentId) => dbOps.getStudentGrades(studentId));
ipcMain.handle('grades:add', async (_, { enrollmentId, grade }) => dbOps.addGrade(enrollmentId, grade));

ipcMain.handle('dashboard:stats', async () => dbOps.getDashboardStats());

app.whenReady().then(() => {
  createWindow();

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
