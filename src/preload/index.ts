import { contextBridge, ipcRenderer } from "electron";
import { GetNotes } from "../shared/types";

if (!process.contextIsolated) {
  throw new Error("context isolation must be enabled in the browser");
}

try {
  contextBridge.exposeInMainWorld("context", {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) =>
      ipcRenderer.invoke("getNotes", ...args),
  });
} catch (error) {
  console.error(error);
}
