// Dropnote
// By : Dhruv (iDCoded)
// Electron Main Process

import { app, BrowserWindow } from "electron";
import { displayName, version } from "./package.json";

let appWin: BrowserWindow;

let isDev = !app.isPackaged;

app.on("ready", () => {
	appWin = new BrowserWindow({
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
	} else {
		appWin.loadFile("dist/index.html");
	}

	appWin.on("ready-to-show", () => {
		console.log(`Launched ${displayName}\n App Version : ${version}`);
		appWin.show();
	});
});
