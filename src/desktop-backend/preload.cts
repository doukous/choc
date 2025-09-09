import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron"

contextBridge.exposeInMainWorld('appWindowHandler', {
    setFocus: () => ipcRenderer.send('set-focus')
})