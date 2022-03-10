"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// @ts-expect-error
window.ipcRenderer = electron_1.ipcRenderer; // Globally expose the IPC Renderer.
//# sourceMappingURL=preload.js.map