const { app, BrowserWindow } = require('electron')
const path = require('path')

try {
    require('electron-reloader')(module)
} catch (_) {}

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        },
    })
    win.loadFile('app/index.html')

    // Open the DevTools
    // mainWindow.webContents.openDevTools()
}

// Creates window when app is ready
app.whenReady().then(() => {
    createWindow()
})

// Quits app when window is closed
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})