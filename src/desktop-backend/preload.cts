import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron"

contextBridge.exposeInMainWorld('appWindowHandler', {
    setFocus: () => ipcRenderer.send('set-focus')
})

contextBridge.exposeInMainWorld('tray', {
    setTimerValue: (minute: number, second: number) => ipcRenderer.send('set-timer-value', minute, second),
    initStartingTimerTray: (minute: number, second: number) => ipcRenderer.send('init-timer-tray', minute, second),
    onTrayAction: (callback: (action: string) => void) => ipcRenderer.on('set-action', (_: IpcRendererEvent, action: string) => callback(action)),
    setMainIcon: () => ipcRenderer.send('set-main-icon')
})