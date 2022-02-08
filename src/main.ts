import {
	app,
	BrowserWindow,
	dialog,
	ipcMain,
	Menu,
	MenuItem,
	shell,
} from "electron";

const { productName, version, repository } = require("../package.json");

import fs from "fs";

let applicationWindow: BrowserWindow;

const applicationMenuTemp: any = [
	{
		label: "File",
		submenu: [
			{
				label: "New File",
				click: () => {
					applicationWindow.webContents.send("create-new-file:app");
				},
				accelarator: "Ctrl+N",
			},
			{
				label: "Open File",
				click: () => {
					getFileFromUser();
				},
			},
			{
				label: "Save File",
				click: () => {
					applicationWindow.webContents.send("save-file:app");
				},
			},
			{ type: "separator" },
			{
				label: "Quit",
				role: "quit",
			},
		],
	},
	{
		label: "Edit",
		submenu: [
			{
				label: "Cut",
				role: "cut",
			},
			{
				label: "Copy",
				role: "copy",
			},
			{
				label: "Paste",
				role: "paste",
			},
		],
	},
	{
		label: "Help",
		submenu: [
			{
				label: "Repository",
				click: () => {
					shell.openExternal(repository.url);
				},
			},
			{
				label: "License",
				click: () => {
					shell.openExternal(
						"https://github.com/iDCoded/Drop-Note/blob/main/LICENSE"
					);
				},
			},
			{
				label: `About ${productName}`,
				click: () => {
					displayAppInfo();
				},
			},
		],
	},
];

const contextMenuTemp: any = [
	{
		label: "Copy",
		role: "copy",
	},
	{
		label: "Cut",
		role: "cut",
	},
	{
		label: "Paste",
		role: "paste",
	},
	{
		label: "Select All",
		role: "selectall",
	},
];

const applicationMenu: Electron.Menu =
	Menu.buildFromTemplate(applicationMenuTemp);
const contextMenu: Electron.Menu = Menu.buildFromTemplate(contextMenuTemp);

app.on("ready", () => {
	applicationWindow = new BrowserWindow({
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	applicationWindow.once("ready-to-show", () => {
		applicationWindow.show();
		applicationWindow.webContents.on("context-menu", () => {
			contextMenu.popup();
		});
		Menu.setApplicationMenu(applicationMenu);
	});

	// Open Developer Tools if the app is in Development.
	if (!app.isPackaged) {
		applicationWindow.webContents.openDevTools();
	}

	console.log("App launched successfully \nApp version : " + version);

	applicationWindow.loadFile("src/index.html");
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
	console.log("Successfully Closed");
});

const getFileFromUser = () => {
	dialog
		.showOpenDialog(applicationWindow, {
			properties: ["openFile"],
			filters: [
				{ name: "Markdown Files", extensions: ["md", "markdown"] },
				{ name: "Text Files", extensions: ["txt"] },
			],
		})
		.then((res) => {
			if (!res.canceled) {
				openFile(res.filePaths[0]);
			} else {
				dialog.showErrorBox("Couldn't open file", "No file selected");
			}
		});
};

/**
 * Opens the file and reads its contents.
 * @param file Path of the file
 */
function openFile(file: string): void {
	fs.readFile(file, (err, data) => {
		if (err) {
			dialog.showErrorBox("Error opening that file", err.message);
		} else {
			applicationWindow.webContents.send("opened-file", data.toString(), file);
		}
	});
}

/**
 * displayAppInfo - Display the info of the App
 */
function displayAppInfo() {
	dialog.showMessageBox(applicationWindow, {
		title: "Drop Note",
		message: "A note taking built with web technologies",
	});
}

// Open the file dialog box.
ipcMain.on("open-file", () => {
	getFileFromUser();
});

ipcMain.on("create-new-file", (event, msg) => {
	if (msg === "non-empty") {
		dialog
			.showMessageBox(applicationWindow, {
				title: "File not empty",
				message: "The file is not empty. Do you wish to create a new file?",
				buttons: ["Cancel", "Yes"],
				detail: "Create a new file without saving your work",
			})
			.then((response) => {
				if (response.response === 1) {
					applicationWindow.setTitle(productName);
					event.sender.send("new-file:accepted", "accepted to create new file");
				} else {
					event.sender.send(
						"new-file:declined",
						"creation of new file rejected"
					);
				}
			});
	}
});

ipcMain.on("update-title", (event, title) => {
	applicationWindow.setTitle(title);
});

ipcMain.on("save-file", (event, file, content) => {
	if (file !== null) {
		fs.writeFileSync(file, content);
	} // console.log('File has been saved successfully to ' + file);
	else if (file === null) {
		dialog.showErrorBox("Unable to save file", "File does not exist");
	}
	event.sender.send("saved-file");
});
