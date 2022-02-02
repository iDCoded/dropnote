import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";

const { productName, version, repository } = require("../package.json");

const fs = require("fs");

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
];

const applicationMenu = Menu.buildFromTemplate(applicationMenuTemp);
const contextMenu = Menu.buildFromTemplate(contextMenuTemp);

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

	applicationWindow.on("closed", () => {
		applicationWindow.destroy();
	});
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
function openFile(file: string) {
	fs.readFile(
		file,
		(err: { message: string }, data: { toString: () => any }) => {
			if (err) {
				dialog.showErrorBox("Error opening that file", err.message);
			} else {
				applicationWindow.webContents.send(
					"opened-file",
					data.toString(),
					file
				);
			}
		}
	);
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
