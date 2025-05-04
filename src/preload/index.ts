import { contextBridge, ipcRenderer } from "electron";
import {
  CreateNote,
  DeleteNote,
  GetNotes,
  ReadNote,
  RenameNote,
  Settings,
  WriteNote,
} from "../shared/types";

if (!process.contextIsolated) {
  throw new Error("context isolation must be enabled in the browser");
}

try {
  contextBridge.exposeInMainWorld("context", {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) =>
      ipcRenderer.invoke("getNotes", ...args),
    readNote: (...args: Parameters<ReadNote>) =>
      ipcRenderer.invoke("readNote", ...args),
    writeNote: (...args: Parameters<WriteNote>) =>
      ipcRenderer.invoke("writeNote", ...args),
    createNote: (...args: Parameters<CreateNote>) =>
      ipcRenderer.invoke("createNote", ...args),
    deleteNote: (...args: Parameters<DeleteNote>) =>
      ipcRenderer.invoke("deleteNote", ...args),
    renameNote: (...args: Parameters<RenameNote>) =>
      ipcRenderer.invoke("renameNote", ...args),
    getSettings: () => ipcRenderer.invoke("get-settings"),
    saveSettings: (settings: Settings) =>
      ipcRenderer.invoke("save-settings", settings),
    applyBackgroundMaterial: (material: string) =>
      ipcRenderer.invoke("apply-background-material", material),
    toggleZenMode: () => ipcRenderer.invoke("toggle-zen-mode"),
    updateZenModeShortcut: (shortcut: string) =>
      ipcRenderer.invoke("update-zen-mode-shortcut", shortcut),
  });
} catch (error) {
  console.error(error);
}
