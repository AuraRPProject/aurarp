// Aura Desktop — minimal Electron wrapper around the website.
// Build with:  npm run build:pc          (Linux)
//              npm run build:pc:win      (Windows)
//              npm run build:pc:mac      (macOS)
const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1100, height: 760, minWidth: 800, minHeight: 600,
    backgroundColor: "#1e1f22",
    title: "Aura",
    icon: path.join(__dirname, "..", "public", "aura-icon-512.png"),
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  win.setMenuBarVisibility(false);
  win.loadURL("https://discord-rich-presence-app.lovable.app/dashboard");
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
