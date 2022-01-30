const electron = require("electron");
const { app, BrowserWindow, dialog, ipcMain } = electron;

const { productName, version } = require("../package.json");
// fs -file system
const fs = require("fs");

// declare global app window
let applicationWindow = null;

// Listen for the app to be ready.
app.on("ready", () => {
	// Create a BrowserWindow when the app becomes ready.
	applicationWindow = new BrowserWindow({
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	});

	// Show the window once the app is ready to show.
	applicationWindow.once("ready-to-show", () => {
		applicationWindow.show();
	});

	if (!app.isPackaged) {
		// Open DevTools if the app is in development (a.k.a not packaged).
		applicationWindow.webContents.openDevTools();
	}

	console.log("App Launched Successfully \nApp version : " + version + "");

	// Load the HTML for the page.
	applicationWindow.loadFile("src/index.html");

	applicationWindow.on("closed", () => {
		applicationWindow = null;
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
	console.log("Successfully Closed ");
});

/**
 * @summary Get the file from user.
 */
function getFileFromUser() {
	dialog
		.showOpenDialog(applicationWindow, {
			properties: ["openFile"],
			filters: [
				{ name: "Markdown Files", extensions: ["md", "markdown"] },
				{ name: "Text Files", extensions: ["txt"] },
			],
		})
		.then((response) => {
			if (!response.canceled) {
				openFile(response.filePaths[0]);
			} else {
				dialog.showErrorBox("Couldn't open file", "No file selected");
			}
		});
}

/**
 * Open the file and get its content. (Converted to string)
 */
function openFile(file) {
	fs.readFile(file, (err, data) => {
		if (err) {
			dialog.showErrorBox("Error opening that file", err.message);
		} else {
			applicationWindow.webContents.send("opened-file", data.toString(), file);
		}
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
