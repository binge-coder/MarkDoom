import { contextBridge, ipcRenderer } from "electron";
import { GetNotes, ReadNote } from "../shared/types";

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
  });
} catch (error) {
  console.error(error);
}
