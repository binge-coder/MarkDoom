import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { BrowserWindow, app, globalShortcut, ipcMain, shell } from "electron";
import { existsSync, readFile, writeFile } from "fs-extra";
import { join } from "path";
import icon from "../../resources/icon.png?asset";
import {
  CreateNote,
  DeleteNote,
  GetNotes,
  ReadNote,
  WriteNote,
} from "../shared/types";
import {
  checkAndCreateSettingsFile,
  createNote,
  deleteNote,
  getNotes,
  readNote,
  settingsPath,
  writeNote,
} from "./lib";

// Keep a reference to the main window
let mainWindow: BrowserWindow | null = null;

// Track the current registered shortcut
let currentZenModeShortcut: string | null = null;

// Function to register Zen Mode shortcut (previously fullscreen shortcut)
function registerZenModeShortcut(shortcut: string): boolean {
  try {
    // Unregister previous shortcut if exists
    if (currentZenModeShortcut) {
      globalShortcut.unregister(currentZenModeShortcut);
      currentZenModeShortcut = null;
    }

    // Register the new shortcut
    const success = globalShortcut.register(shortcut, () => {
      if (mainWindow) {
        const isZenMode = mainWindow.isFullScreen();
        mainWindow.setFullScreen(!isZenMode);
      }
    });

    if (success) {
      currentZenModeShortcut = shortcut;
      console.log(`Registered Zen Mode shortcut: ${shortcut}`);
      return true;
    } else {
      console.error(`Failed to register Zen Mode shortcut: ${shortcut}`);
      return false;
    }
  } catch (error) {
    console.error(`Error registering Zen Mode shortcut ${shortcut}:`, error);
    return false;
  }
}

async function createWindow(): Promise<void> {
  // Settings file is already ensured to exist in app.whenReady()
  type BackgroundMaterialType =
    | "none"
    | "tabbed"
    | "auto"
    | "mica"
    | "acrylic"
    | undefined;
  let savedBackgroundMaterial: BackgroundMaterialType = "none";
  try {
    const settings = await readFile(settingsPath, { encoding: "utf-8" });
    const parsedSettings = JSON.parse(settings);

    // Validate the value is one of the allowed types
    const material = parsedSettings.backgroundMaterial;
    if (
      material === "none" ||
      material === "tabbed" ||
      material === "auto" ||
      material === "mica" ||
      material === "acrylic"
    ) {
      savedBackgroundMaterial = material;
    }
  } catch (error) {
    console.error("Error reading settings file:", error);
    // Continue with default settings
  }

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
    backgroundMaterial: savedBackgroundMaterial,
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
  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.on("ready-to-show", () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  if (mainWindow) {
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");
  await checkAndCreateSettingsFile();
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Load the Zen Mode shortcut from settings
  let zenModeShortcut = "F11"; // Default
  try {
    if (existsSync(settingsPath)) {
      const settingsContent = await readFile(settingsPath, {
        encoding: "utf-8",
      });
      const settings = JSON.parse(settingsContent);
      if (settings.fullscreenShortcut) {
        zenModeShortcut = settings.fullscreenShortcut;
      }
    }
  } catch (error) {
    console.error("Error reading settings for shortcut:", error);
  }

  // Register the Zen Mode shortcut
  registerZenModeShortcut(zenModeShortcut);

  // Register F11 shortcut for Zen Mode toggle
  globalShortcut.register("F11", () => {
    if (mainWindow) {
      const isZenMode = mainWindow.isFullScreen();
      mainWindow.setFullScreen(!isZenMode);
    }
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

  // Add a new handler for toggling Zen Mode
  ipcMain.handle("toggle-zen-mode", () => {
    if (mainWindow) {
      const isZenMode = mainWindow.isFullScreen();
      mainWindow.setFullScreen(!isZenMode);
      return { success: true, isZenMode: !isZenMode };
    }
    return { success: false, error: "No window available" };
  });

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

  // New handler to update window background material without restart
  ipcMain.handle("apply-background-material", async (_, material) => {
    if (!mainWindow) return { success: false, error: "No window available" };

    try {
      if (material === "none") {
        mainWindow.setBackgroundColor("#1f1f1f");
      } else {
        // Clear background color if using a material effect
        mainWindow.setBackgroundColor("#00000000");
      }

      // Set the background material
      if (process.platform === "win32") {
        // @ts-ignore - TypeScript doesn't know about this Electron method for Windows
        mainWindow.setBackgroundMaterial(material);
        return {
          success: true,
          appliedMaterial: material,
          // Get current window settings for debugging
          currentSettings: {
            backgroundColor: mainWindow.getBackgroundColor(),
          },
        };
      }
      return { success: false, error: "Not on Windows platform" };
    } catch (error) {
      console.error("Error applying background material:", error);
      return {
        success: false,
        error: String(error),
        material,
      };
    }
  });

  // Add a new handler for updating the Zen Mode shortcut
  ipcMain.handle("update-zen-mode-shortcut", (_, shortcut: string) => {
    const success = registerZenModeShortcut(shortcut);
    return { success };
  });

  await createWindow();

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

// Clean up shortcuts when quitting
app.on("will-quit", () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
