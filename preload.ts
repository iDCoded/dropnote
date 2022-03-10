import { ipcRenderer } from "electron";
// @ts-expect-error
window.ipcRenderer = ipcRenderer; // Globally expose the IPC Renderer.
