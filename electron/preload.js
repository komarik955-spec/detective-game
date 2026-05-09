const { contextBridge, ipcRenderer } = require('electron')

// Expose safe APIs to renderer (React app)
contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close:    () => ipcRenderer.send('window-close'),
  // Check if running inside Electron
  isElectron: true,
})
