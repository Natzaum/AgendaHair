const { app, BrowserWindow } = require('electron')

let mainWindow

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    })

    mainWindow.loadFile('frontend/index.html')

})