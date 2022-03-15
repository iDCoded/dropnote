/*-----------------------------------------------*
 *                 Dropnote                      *
 *               By : Dhruv Anand 	             *
 *            Electron Main Process              *
 *                                               *
 ------------------------------------------------*/

import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { displayName, version } from "./package.json";
import path from "path";
import { readFile } from "fs";
import { StructuralDirectiveTransform } from "@vue/compiler-core";

let appWin: BrowserWindow;

let isDev = !app.isPackaged;

app.on("ready", () => {
	appWin = new BrowserWindow({
		show: false,
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: path.join(__dirname, "../preload.js"),
		},
	});

	if (isDev) {
		const port = "3000";
		const localhost = "http://localhost:" + port;
		appWin.loadURL(localhost);

		// Open DevTools
		appWin.webContents.openDevTools();
	} else {
		appWin.loadFile("dist/index.html");
	}

	appWin.on("ready-to-show", () => {
		console.log(`Launched ${displayName}\n App Version : ${version}`);
		appWin.show();
	});
});
/* Functions */

const getFileFromUser = (fileName: string) => {
	dialog
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
			} else if (res.canceled) {
				dialog.showErrorBox("Unable to open file", "No file selected");
			}
		});
};

const openFile = (filePath: string, fileName: string) => {
	readFile(filePath, "utf-8", (err, data) => {
		if (err) {
			dialog.showErrorBox(err.name, err.message);
		} else {
			appWin.webContents.send("file:opened", data.toString(), filePath);
			updateAppTitle(fileName);
		}
	});
};

/**
 * Sets the title of the application to the specified string.
 * @param {string} appTitle Title of the app.
 */
const updateAppTitle = (appTitle: string) => {
	appWin.title = displayName + " | " + appTitle;
};

/* IPC */
ipcMain.on("file:new", (_e, fileName) => {
	getFileFromUser(fileName);
});
