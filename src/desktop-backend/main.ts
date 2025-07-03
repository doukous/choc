import { createCanvas, registerFont } from 'canvas'
import { app, BrowserWindow, ipcMain, IpcMainEvent, Menu, nativeImage, Tray } from 'electron'
import path from 'path'

let mainWindow : BrowserWindow | null = null

let fontUrl = path.join(app.getAppPath(), 'src/desktop-backend/assets/Roboto.ttf')

if (process.env.NODE_ENV !== 'dev') {
    fontUrl = path.join(app.getAppPath(), 'dist/backend-electron/assets/Roboto.ttf')
}

registerFont(fontUrl, {family: 'roboto'})

function setFocusOnWindow() {
    if(mainWindow) {
        mainWindow.show()
    }
}

function createTimerIcon(value: string) {
    const image = createCanvas(48, 30)
    const ctx = image.getContext('2d')
    ctx.fillStyle = 'green'
    ctx.roundRect(0, 5, 48, 20, 10)
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.font = '13px roboto bold'
    ctx.textAlign = 'center'
    ctx.fillText(value, 24, 20)

    return image.toBuffer()
}

function createWindow() {   
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(
                app.getAppPath(), 
                process.env.NODE_ENV === 'dev' ? '.' : '..' , 
                '/dist/backend-electron/preload.cjs'
            )
        }
    })

    if (process.env.NODE_ENV === 'dev')
        mainWindow.loadURL('http://localhost:5123')

    else
        mainWindow.loadFile(path.join(app.getAppPath(), 'dist/frontend/index.html'))

    mainWindow.setPosition(1110, 200)
}

let tray: Tray | null = null

function setTimerTrayValue(_event: IpcMainEvent, minute: number, second: number) {
    const [stringMinute, stringSecond] = [
        minute < 10 ? `0${minute}` : minute,
        second < 10 ? `0${second}` : second,
    ]

    const stringValue = `${stringMinute}:${stringSecond}`

    const buffer = createTimerIcon(stringValue)

    if (tray) {
        tray.setImage(
            nativeImage.createFromBuffer(buffer)
        )
    }

    else {
        const menu = Menu.buildFromTemplate(
            [
                {label: 'Play', click: () => mainWindow?.webContents.send('set-action', 'play')},
                {label: 'Pause', click: () => mainWindow?.webContents.send('set-action', 'pause')},
                {label: 'Reset', click: () => mainWindow?.webContents.send('set-action', 'reset')}
            ]
        )

        tray = new Tray(
            nativeImage.createFromBuffer(buffer)
        )

        tray.setContextMenu(menu)
    }
}

app.whenReady().then(() => {
    createWindow()

    ipcMain.on('set-focus', setFocusOnWindow)
    ipcMain.on('set-timer-value', setTimerTrayValue)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
