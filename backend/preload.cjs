const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  auth: {
    login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
    register: (data) => ipcRenderer.invoke('auth:register', data),
  },
  users: {
    getAll: () => ipcRenderer.invoke('users:getAll'),
    update: (data) => ipcRenderer.invoke('users:update', data),
    delete: (id) => ipcRenderer.invoke('users:delete', id),
  },
  students: {
    getAll: () => ipcRenderer.invoke('students:getAll'),
    create: (data) => ipcRenderer.invoke('students:create', data),
    update: (data) => ipcRenderer.invoke('students:update', data),
    delete: (id) => ipcRenderer.invoke('students:delete', id),
  },
  subjects: {
    getAll: () => ipcRenderer.invoke('subjects:getAll'),
    create: (data) => ipcRenderer.invoke('subjects:create', data),
  },
  grades: {
    enroll: (data) => ipcRenderer.invoke('grades:enroll', data),
    getByStudent: (id) => ipcRenderer.invoke('grades:getByStudent', id),
    add: (data) => ipcRenderer.invoke('grades:add', data),
  },
  dashboard: {
    getStats: () => ipcRenderer.invoke('dashboard:stats'),
  }
});
