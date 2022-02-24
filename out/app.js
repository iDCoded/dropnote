"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Electorn Main Process */
const electron_1 = require("electron");
const fs_1 = require("fs");
const path_1 = require("path");
// Initialize Electron Remote
require("@electron/remote/main").initialize();
const package_json_1 = require("./package.json");
/**
 * Main browser windows of the application that is displayed.
 */
let appWin;
/**
 * Is the application in development?
 */
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
    if (isDev) {
        // Load localhost if the application is in development
        // for hot reload of application.
        appWin.loadURL("http://localhost:8080/");
        console.log("Loaded HTML from localhost");
    }
    else {
        // Load the main index HTML file
        // if the application is in production.
        appWin.loadFile("./dist/index.html");
        console.log("Loaded HTML from dist");
    }
    // Show the application windown only when it is ready to show.
    appWin.once("ready-to-show", () => {
        console.log(`Launched ${package_json_1.productName} \nVersion : ${package_json_1.version}`);
        appWin.show(); // Show the window.
    });
    if (isDev) {
        // Open the DevTools if the application is in development.
        appWin.webContents.openDevTools();
        // Map F5 to reload the application.
        electron_1.globalShortcut.register("f5", () => {
            let currentTime = new Date();
            console.log(`Reloaded @ ${currentTime.getHours() +
                ":" +
                currentTime.getMinutes() +
                ":" +
                currentTime.getSeconds() +
                "." +
                currentTime.getMilliseconds()}`);
            appWin.reload();
        });
    }
});
// Quit the app directly if it is not on MacOS
// On MacOS, the application stays active even after closing the windows
// Unless, Cmd+Q is pressed.
electron_1.app.on("window-all-closed", () => {
    // Check if the platform is not MacOS (darwin).
    if (process.platform !== "darwin")
        electron_1.app.quit();
    console.log(`Successfully Closed ${package_json_1.productName}.`);
});
/* Functions & Methods */
/**
 * Open a dialog box to select file.
 */
const getFileFromUser = () => {
    electron_1.dialog
        .showOpenDialog(appWin, {
        properties: ["openFile"],
        filters: [
            { name: "Markdown Files", extensions: ["md", "markdown"] },
            { name: "Text Files", extensions: ["txt"] },
        ],
    })
        // res.filePaths -> File paths of the selected files.
        .then((res) => {
        // Open the selected file if the process has not been cancelled.
        if (!res.canceled) {
            console.log(res.filePaths[0]);
            openFile(res.filePaths[0]);
        }
        else {
            electron_1.dialog.showErrorBox("Couldn't open File", "No File Selected");
        }
    });
};
/**
 * Open the file by the specified path and read its contents.
 * @param filePath Path (absolute) of the file to be read.
 */
const openFile = (filePath) => {
    fs_1.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            electron_1.dialog.showErrorBox("Error opening that file", err.message);
        }
        else {
            // Send the 'opened-file' message to the render process.
            // Send the data of the file to the render process along with the path of the file.
            appWin.webContents.send("opened-file", data.toString(), filePath);
        }
    });
};
/* Inter Process Communication (IPC) */
// Get the file from the user.
electron_1.ipcMain.on("app:open-file", (event) => {
    getFileFromUser();
});
//# sourceMappingURL=app.js.map