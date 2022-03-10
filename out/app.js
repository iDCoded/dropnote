"use strict";
// Dropnote
// By : Dhruv (iDCoded)
// Electron Main Process
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const package_json_1 = require("./package.json");
let appWin;
let isDev = !electron_1.app.isPackaged;
electron_1.app.on("ready", () => {
    appWin = new electron_1.BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
        },
    });
    if (isDev) {
        const port = "3000";
        const localhost = "http://localhost:" + port;
        appWin.loadURL(localhost);
    }
    else {
        appWin.loadFile("dist/index.html");
    }
    appWin.on("ready-to-show", () => {
        console.log(`Launched ${package_json_1.displayName}\n App Version : ${package_json_1.version}`);
        appWin.show();
    });
});
//# sourceMappingURL=app.js.map