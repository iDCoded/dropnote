"use strict";
/*-----------------------------------------------*
 *                 Dropnote                      *
 *               By : Dhruv Anand 	             *
 *            Electron Main Process              *
 *                                               *
 ------------------------------------------------*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const package_json_1 = require("./package.json");
const path_1 = __importDefault(require("path"));
let appWin;
let isDev = !electron_1.app.isPackaged;
electron_1.app.on("ready", () => {
    appWin = new electron_1.BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path_1.default.join(__dirname, "../preload.js"),
        },
    });
    if (isDev) {
        const port = "3000";
        const localhost = "http://localhost:" + port;
        appWin.loadURL(localhost);
        // Open DevTools
        appWin.webContents.openDevTools();
    }
    else {
        appWin.loadFile("dist/index.html");
    }
    appWin.on("ready-to-show", () => {
        console.log(`Launched ${package_json_1.displayName}\n App Version : ${package_json_1.version}`);
        appWin.show();
    });
});
/* IPC */
electron_1.ipcMain.on("file:new", (_e, arg) => {
    console.log(arg);
});
//# sourceMappingURL=app.js.map