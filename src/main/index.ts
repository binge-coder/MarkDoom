import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { BrowserWindow, app, ipcMain, shell } from "electron";
import { join } from "path";
import icon from "../../resources/icon.png?asset";
import {
  createNote,
  getNotes,
  readNote,
  writeNote,
  deleteNote,
  checkAndCreateSettingsFile,
  settingsPath,
} from "./lib";
import {
  CreateNote,
  GetNotes,
  ReadNote,
  WriteNote,
  DeleteNote,
} from "../shared/types";
import { readFile, writeFile, existsSync } from "fs-extra";

async function createWindow(): Promise<void> {
  const settings = await readFile(settingsPath, { encoding: "utf-8" });
  const { backgroundMaterial: savedBackgroundMaterial } = JSON.parse(settings);

  // Default properties for the browser window
  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    width: 900,
    height: 670,
    resizable: true,
    fullscreenable: true,
    fullscreen: false,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    center: true,
    title: "MarkDoom",
    frame: true,
    backgroundMaterial: savedBackgroundMaterial || "none",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true,
    },
  };

  // Conditionally set backgroundMaterial and backgroundColor
  if (savedBackgroundMaterial == "none") {
    windowOptions.backgroundColor = "#1f1f1f";
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow(windowOptions);

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");
  checkAndCreateSettingsFile();
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  // ipcMain.on("ping", () => console.log("pong"));
  ipcMain.handle("getNotes", (_, ...args: Parameters<GetNotes>) =>
    getNotes(...args),
  );
  ipcMain.handle("readNote", (_, ...args: Parameters<ReadNote>) =>
    readNote(...args),
  );
  ipcMain.handle("writeNote", (_, ...args: Parameters<WriteNote>) =>
    writeNote(...args),
  );
  ipcMain.handle("createNote", (_, ...args: Parameters<CreateNote>) =>
    createNote(...args),
  );
  ipcMain.handle("deleteNote", (_, ...args: Parameters<DeleteNote>) =>
    deleteNote(...args),
  );

  // Handle fetching settings
  ipcMain.handle("get-settings", async () => {
    if (!existsSync(settingsPath)) {
      await checkAndCreateSettingsFile(); // Ensure settings.json is created
    }
    const settings = await readFile(settingsPath, { encoding: "utf-8" });
    return JSON.parse(settings); // Return the parsed settings object
  });

  // Handle saving settings
  ipcMain.handle("save-settings", async (_, newSettings) => {
    await writeFile(
      settingsPath,
      JSON.stringify(newSettings, null, 2),
      "utf-8",
    );
    return { success: true }; // Return success after saving
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
