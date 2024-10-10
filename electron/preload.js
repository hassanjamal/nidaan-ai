import { contextBridge, ipcRenderer } from "electron";
const Store = require("electron-store");
const store = new Store();

contextBridge.exposeInMainWorld("electronAPI", {
  openDialog: () => ipcRenderer.invoke("dialog:open"),
});


contextBridge.exposeInMainWorld("electronAPI", {
  getInstallationId: () => store.get("installationId"),
  getPouchDBName: () => store.get("pouchDBName"),
});
