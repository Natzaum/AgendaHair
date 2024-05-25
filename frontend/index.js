const { app, BrowserWindow } = require('electron')

let mainWindow

app.on('ready', () => {

    mainWindow = new BrowserWindow()

    mainWindow.setMenu(null)

    mainWindow.loadFile('frontend/index.html')

    mainWindow.maximize()
})
