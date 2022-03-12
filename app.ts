/*-----------------------------------------------*
 *                 Dropnote                      *
 *               By : Dhruv Anand 	             *
 *            Electron Main Process              *
 *                                               *
 ------------------------------------------------*/

import { app, BrowserWindow, ipcMain } from "electron";
import { displayName, version } from "./package.json";
import path from "path";

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

/* IPC */
ipcMain.on("file:new", (_e, arg) => {
	console.log(arg);
});
