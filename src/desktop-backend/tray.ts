import { app, IpcMainEvent, Tray, nativeImage, Menu } from "electron"
import path from "path"
import { createCanvas, registerFont } from "canvas"

const fontUrl = app.isPackaged ? 
    path.join(process.resourcesPath, 'public/fonts/Roboto.ttf')
    :
    path.join(app.getAppPath(), 'public/fonts/Roboto.ttf')

const iconsPath = app.isPackaged ?
    path.join(process.resourcesPath, 'public/icons')
    :
    path.join(app.getAppPath(), 'public/icons')

registerFont(fontUrl, {family: 'roboto'})

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

let tray: Tray | null = null

export function setMainTrayIcon() {
    if (tray) {
        tray.setImage(path.join(iconsPath, 'icon-tray48x48.png'))
        tray.setContextMenu(Menu.buildFromTemplate([]))
    }

    else {
        tray = new Tray(
            path.join(iconsPath, 'icon-tray48x48.png')
        )
    }
}

export function setTimerTrayValue(event: IpcMainEvent, minute: number, second: number) {
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
                    click: () => event.sender.send('set-action', 'play')
                },
                {
                    label: 'Pause', 
                    click: () => event.sender.send('set-action', 'pause')
                },
                {
                    label: 'Reset', 
                    click: () => event.sender.send('set-action', 'reset')
                }
            ]
        )

        tray = new Tray(
            nativeImage.createFromBuffer(buffer)
        )

        tray.setContextMenu(menu)
    }
}