const { app, BrowserWindow, ipcMain } = require('electron')
const { PythonShell } = require('python-shell');
const fetch = require('node-fetch');
const path = require('path');

try {
    require('electron-reloader')(module)
} catch (_) {}

const serverip = 'http://127.0.0.1:5000'

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

ipcMain.on('request', (event, request) => {
    fetch(`${serverip}/${request}`).then((data) => {
        return data.text()
    }).then((text) => {
        event.reply(`${request}-response`, text)
    }).catch(e => {
        console.log(e);
    })
})

let options = {
    mode: 'text',
    pythonPath: './env/Scripts/python'
};

PythonShell.run('./src/backend/server.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('response: ', results);
});