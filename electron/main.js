const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#1a1a2e',
    show: false,
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadURL(`file://${path.join(__dirname, '..', 'dist', 'index.html')}`)
  }

  win.once('ready-to-show', () => win.show())
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC: window controls
ipcMain.on('window-minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  win?.isMaximized() ? win.unmaximize() : win.maximize()
})
ipcMain.on('window-close', () => BrowserWindow.getFocusedWindow()?.close())
