import { contextBridge } from "electron";

if (!process.contextIsolated) {
  throw new Error("context isolation must be enabled in the browser");
}

try {
  contextBridge.exposeInMainWorld("context", {
    locale: navigator.language,
  });
} catch (error) {
  console.error(error);
}
