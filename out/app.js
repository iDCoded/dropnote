"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Electorn Main Process */
const electron_1 = require("electron");
const path_1 = require("path");
// Initialize Electron Remote
require("@electron/remote/main").initialize();
const package_json_1 = require("./package.json");
let appWin;
let isDev = !electron_1.app.isPackaged; // Check if the application is packaged or not.
electron_1.app.on("ready", () => {
    appWin = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path_1.join(__dirname, "preload.js"),
        },
        show: false,
    });
    // Load the HTML from the final Vue build
    appWin.loadFile("./dist/index.html");
    // Show the application windown only when it is ready to show.
    appWin.once("ready-to-show", () => {
        console.log(`Launched ${package_json_1.name} \nVersion : ${package_json_1.version}`);
        appWin.show(); // Show the window.
    });
    // Open the DevTools if the application is in development.
    if (isDev) {
        appWin.webContents.openDevTools();
    }
});
// Quit the app directly if it is not on MacOS
// On MacOS, the application stays active even after closing the windows
// Unless, Cmd+Q is pressed.
electron_1.app.on("window-all-closed", () => {
    // Check if the platform is not MacOS (darwin).
    if (process.platform !== "darwin")
        electron_1.app.quit();
    console.log(`Successfully Closed ${package_json_1.name}.`);
});
/* Inter Process Communication (IPC) */
electron_1.ipcMain.on("app:create-new-file", (event, fileName) => {
    console.log(fileName);
});
//# sourceMappingURL=app.js.map