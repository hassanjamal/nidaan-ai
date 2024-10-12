import { contextBridge, ipcRenderer } from "electron";
import Store from "electron-store";

// Initialize Electron Store
const store = new Store();

// Expose necessary APIs to the frontend via `contextBridge`
contextBridge.exposeInMainWorld("electronAPI", {
  // Store-related APIs
  getInstallationId: () => store.get("installationId"),
  getPouchDBName: () => store.get("pouchDBName"),

  // Open a dialog or verify store key (for activation)
  verifyKey: (enteredKey) => ipcRenderer.invoke("verify-key", enteredKey),

  // Optional: Additional sync logic can be exposed here if needed later
  startSync: (storeKey) => ipcRenderer.invoke("start-sync", storeKey),

  // Example of other Electron IPC communication (for dialogs, etc.)
  openDialog: () => ipcRenderer.invoke("dialog:open"),
});
