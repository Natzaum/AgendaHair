const { app, BrowserWindow } = require('electron')

let mainWindow

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        height: 1080,
        width: 1920,
    })

    mainWindow.loadFile('frontend/index.html')
})