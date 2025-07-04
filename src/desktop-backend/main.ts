import { createCanvas, registerFont } from 'canvas'
import { app, BrowserWindow, ipcMain, type IpcMainEvent, Menu, nativeImage, Tray } from 'electron'
import path from 'path'

let mainWindow : BrowserWindow | null = null

const fontUrl = app.isPackaged ? 
    path.join(process.resourcesPath, 'public/fonts/Roboto.ttf')
    :
    path.join(app.getAppPath(), 'public/fonts/Roboto.ttf')

registerFont(fontUrl, {family: 'roboto'})

function setFocusOnWindow() {
    if(mainWindow) {
        mainWindow.show()
    }
}

function createTimerIcon(value: string) {
    const image = createCanvas(52, 30)
    const ctx = image.getContext('2d')
    ctx.fillStyle = '#32d02f'
    ctx.roundRect(0, 5, 52, 20, 10)
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.font = '13px bold roboto'
    ctx.textAlign = 'center'
    ctx.fillText(value, 26, 20)

    return image.toBuffer()
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
                {
                    label: 'Play', 
                    click: () => mainWindow?.webContents.send('set-action', 'play')
                },
                {
                    label: 'Pause', 
                    click: () => mainWindow?.webContents.send('set-action', 'pause')
                },
                {
                    label: 'Reset', 
                    click: () => mainWindow?.webContents.send('set-action', 'reset')
                }
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

