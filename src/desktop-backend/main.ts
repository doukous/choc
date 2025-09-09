import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from 'electron'
import path from 'path'

export let mainWindow : BrowserWindow | null = null

function setFocusOnWindow() {
    if(mainWindow && ! mainWindow.isFocused()) {
        mainWindow.show()
    }
}

function createWindow() {   
    const windowConfig: BrowserWindowConstructorOptions = {
        webPreferences: {
            preload: path.join(
                app.getAppPath(), 
                '/dist/backend-electron/preload.cjs'
            ),
            backgroundThrottling: false
        },
        width: 1000, height: 700,
    }

    if (app.isPackaged) {
        windowConfig.resizable = false
        windowConfig.autoHideMenuBar = true
    }

    mainWindow = new BrowserWindow(windowConfig)
    
    if (! app.isPackaged)
        mainWindow.loadURL('http://localhost:5123')

    else
        mainWindow.loadFile(path.join(app.getAppPath(), 'dist/frontend/index.html'))

    
    if (! app.isPackaged) 
        mainWindow.setPosition(900, 200)
}

app.whenReady().then(() => {
    createWindow()

    ipcMain.on('set-focus', setFocusOnWindow)
   
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

