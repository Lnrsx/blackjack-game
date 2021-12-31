const { app, BrowserWindow, ipcMain } = require('electron')
const { PythonShell } = require('python-shell');
const fetch = require('node-fetch');
const path = require('path');

try {
    require('electron-reloader')(module)
} catch (_) { }

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

boardID = null

ipcMain.on('setboardID', (event, ID) => {
    boardID = ID
})

ipcMain.on('getboardID', (event) => {
    event.returnValue = boardID
})


ipcMain.on('request', (event, request) => {
    fetch(`${serverip}/${request}`).then((data) => {
        return data.text()
    }).then((text) => {
        // response name is only request type, cuts off any arguments in even name
        event.reply(`${request.split('/')[0]}-response`, text)
    }).catch(e => {
        console.log(e);
    })
})

function startserver() {
    let options = {
        mode: 'text',
        pythonPath: './env/Scripts/python'
    };

    PythonShell.run('./src/backend/server.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('response: ', results);
    });
}

// If this line is commented out, the server can be run remotely for debugging purposes without causing issues to the frontend
startserver()