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
const fs_1 = require("fs");
let appWin;
let isDev = !electron_1.app.isPackaged;
electron_1.app.on("ready", () => {
    appWin = new electron_1.BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
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
/* Functions */
const getFileFromUser = (fileName) => {
    electron_1.dialog
        .showOpenDialog(appWin, {
        properties: ["openFile"],
        filters: [
            { name: "Markdown Files", extensions: ["md", "markdown"] },
            { name: "Text Files", extensions: ["txt"] },
        ],
    })
        .then((res) => {
        if (!res.canceled) {
            openFile(res.filePaths[0], fileName);
        }
        else if (res.canceled) {
            electron_1.dialog.showErrorBox("Unable to open file", "No file selected");
        }
    });
};
const openFile = (filePath, fileName) => {
    (0, fs_1.readFile)(filePath, "utf-8", (err, data) => {
        if (err) {
            electron_1.dialog.showErrorBox(err.name, err.message);
        }
        else {
            appWin.webContents.send("file:opened", data.toString(), filePath);
            updateAppTitle(fileName);
        }
    });
};
/**
 * Sets the title of the application to the specified string.
 * @param {string} appTitle Title of the app.
 */
const updateAppTitle = (appTitle) => {
    appWin.title = package_json_1.displayName + " | " + appTitle;
};
/* IPC */
electron_1.ipcMain.on("file:new", (_e, fileName) => {
    getFileFromUser(fileName);
});
//# sourceMappingURL=app.js.map