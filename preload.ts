const { ipcRenderer } = require("electron");
// @ts-expect-error
window.ipcRenderer = ipcRenderer;
