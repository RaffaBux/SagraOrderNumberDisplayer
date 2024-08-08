import { app, BrowserWindow } from 'electron';
import path, { dirname } from 'path';
import url, { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  const appURL = process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
  });
    
  mainWindow.loadURL(appURL);
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})