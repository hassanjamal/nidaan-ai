import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { initialize } from "@electron/remote/main/index.js";
import Store from "electron-store";
import { v4 as uuidv4 } from "uuid";
import { verifyKeyAndAssociateStore } from "./keyVerification.js";
import { startSync } from "./syncLogic.js";

// Initialize the store to manage installation-related data
const store = new Store();

// Generate unique installation ID if it doesn't exist
if (!store.get("installationId")) {
  store.set("installationId", uuidv4());
}
console.log("Installation ID:", store.get("installationId"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

initialize();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      enableRemoteModule: true,
      contextIsolation: true, // For security purposes
    },
  });

  mainWindow.loadURL("http://localhost:3000"); // Load your Nuxt app
}

// Set up IPC to verify the key entered by the user from the frontend
ipcMain.handle("verify-key", async (event, enteredKey) => {
  const installationId = store.get("installationId");
  const isValid = await verifyKeyAndAssociateStore(enteredKey, installationId);

  if (isValid) {
    console.log("Key verified and store associated.");
    store.set("pouchDBName", enteredKey); // Store the key as pouchDB name
    startSync(enteredKey); // Start syncing after association
    return { success: true };
  } else {
    console.error("Invalid key. Store not associated.");
    return { success: false };
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
