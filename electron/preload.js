import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openDialog: () => ipcRenderer.invoke("dialog:open"),
});
