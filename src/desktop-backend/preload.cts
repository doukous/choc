import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("appWindowHandler", {
  setFocus: () => ipcRenderer.send("set-focus"),
  toggleSize: () => ipcRenderer.send("toggle-size"),
  minimize: () => ipcRenderer.send("minimize"),
  close: () => ipcRenderer.send("close"),
  shrink: () => ipcRenderer.send("shrink"),
  extend: () => ipcRenderer.send("extend"),
});
