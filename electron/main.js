import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { initialize } from "@electron/remote/main/index.js";

// Equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

initialize();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: `${__dirname}/preload.js`, // Ensure this path is correct
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000"); // Load your Nuxt app URL
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
