/* Electorn Main Process */
import { app, BrowserWindow, ipcMain } from "electron";
import { join as pathJoin } from "path";
// Initialize Electron Remote
require("@electron/remote/main").initialize();
import { name as appName, version as appVersion } from "./package.json";

let appWin: BrowserWindow;

let isDev = !app.isPackaged; // Check if the application is packaged or not.

app.on("ready", () => {
	appWin = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true, // Enable Node Integration
			contextIsolation: false,
			preload: pathJoin(__dirname, "preload.js"),
		},
		show: false, // Do not show the application window by default.
	});

	// Load the HTML from the final Vue build
	appWin.loadFile("./dist/index.html");

	// Show the application windown only when it is ready to show.
	appWin.once("ready-to-show", () => {
		console.log(`Launched ${appName} \nVersion : ${appVersion}`);
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
app.on("window-all-closed", () => {
	// Check if the platform is not MacOS (darwin).
	if (process.platform !== "darwin") app.quit();
	console.log(`Successfully Closed ${appName}.`);
});

/* Inter Process Communication (IPC) */

ipcMain.on("app:create-new-file", (event, fileName: string) => {
	console.log(fileName);
});
