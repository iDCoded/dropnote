/* Electorn Main Process */
import { app, BrowserWindow, ipcMain, dialog, globalShortcut } from "electron";
import { readFile } from "fs";
import { join as joinPath } from "path";

// Initialize Electron Remote
require("@electron/remote/main").initialize();
import { productName as appName, version as appVersion } from "./package.json";

/**
 * Main browser windows of the application that is displayed.
 */
let appWin: BrowserWindow;

/**
 * Is the application in development?
 */
let isDev = !app.isPackaged; // Check if the application is packaged or not.

app.on("ready", () => {
	appWin = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true, // Enable Node Integration
			contextIsolation: false,
			preload: joinPath(__dirname, "preload.js"),
		},
		show: false, // Do not show the application window by default.
	});

	if (isDev) {
		// Load localhost if the application is in development
		// for hot reload of application.
		appWin.loadURL("http://localhost:8080/");
		console.log("Loaded HTML from localhost");
	} else {
		// Load the main index HTML file
		// if the application is in production.
		appWin.loadFile("./dist/index.html");
		console.log("Loaded HTML from dist");
	}
	// Show the application windown only when it is ready to show.
	appWin.once("ready-to-show", () => {
		console.log(`Launched ${appName} \nVersion : ${appVersion}`);
		appWin.show(); // Show the window.
	});

	if (isDev) {
		// Open the DevTools if the application is in development.
		appWin.webContents.openDevTools();
		// Map F5 to reload the application.
		globalShortcut.register("f5", () => {
			let currentTime = new Date();
			console.log(
				`Reloaded @ ${
					currentTime.getHours() +
					":" +
					currentTime.getMinutes() +
					":" +
					currentTime.getSeconds() +
					"." +
					currentTime.getMilliseconds()
				}`
			);
			appWin.reload();
		});
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

/* Functions & Methods */

/**
 * Open a dialog box to select file.
 */
const getFileFromUser = () => {
	dialog
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
			} else {
				dialog.showErrorBox("Couldn't open File", "No File Selected");
			}
		});
};

/**
 * Open the file by the specified path and read its contents.
 * @param filePath Path (absolute) of the file to be read.
 */
const openFile = (filePath: string) => {
	readFile(filePath, "utf-8", (err, data) => {
		if (err) {
			dialog.showErrorBox("Error opening that file", err.message);
		} else {
			// Send the 'opened-file' message to the render process.
			// Send the data of the file to the render process along with the path of the file.
			appWin.webContents.send("opened-file", data.toString(), filePath);
		}
	});
};

/* Inter Process Communication (IPC) */

// Get the file from the user.
ipcMain.on("app:open-file", (event) => {
	getFileFromUser();
});
