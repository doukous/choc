import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { setTimerTrayValue, setMainTrayIcon } from './tray.js'

export let mainWindow : BrowserWindow | null = null

function setFocusOnWindow() {
    if(mainWindow) {
        mainWindow.show()
    }
}

function createWindow() {   
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(
                app.getAppPath(), 
                app.isPackaged ? '..' : '.' , 
                '/dist/backend-electron/preload.cjs'
            )
        },
        width: 400, height: 400
    })

    if (! app.isPackaged)
        mainWindow.loadURL('http://localhost:5123')

    else
        mainWindow.loadFile(path.join(app.getAppPath(), 'dist/frontend/index.html'))

    mainWindow.setPosition(1400, 200)
}

app.whenReady().then(() => {
    createWindow()

    ipcMain.on('set-focus', setFocusOnWindow)
    ipcMain.on('set-timer-value', setTimerTrayValue)
    ipcMain.on('set-main-icon', setMainTrayIcon)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

