const electron = require("electron");
const { app, BrowserWindow, dialog, ipcMain } = electron;

// fs -file system
const fs = require('fs');

// declare global app window
let applicationWindow = null;

// Listen for the app to be ready.
app.on("ready", () => {
    // Create a BrowserWindow when the app becomes ready.
    applicationWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false ,
            enableRemoteModule: true
        }
    });

    // Show the window once the app is ready to show.
    applicationWindow.once('ready-to-show', () => {
        applicationWindow.show();
    })

    if (!app.isPackaged) {
        // Open DevTools if the app is in development (a.k.a not packaged).
    applicationWindow.webContents.openDevTools();
    }
    
    console.log('App Launched Successfully');

    // Load the HTML for the page.
    applicationWindow.loadFile('src/index.html');

    applicationWindow.on('closed', () => {
        applicationWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== "darwin") app.quit();
    console.log('Successfully Closed ');
});

/**
 * @summary Get the file from user.
*/
function getFileFromUser () {
    dialog.showOpenDialog(applicationWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Markdown Files', extensions: ['md', 'markdown'] },
            { name: 'Text Files', extensions: ['txt'] }
        ]
    }).then((response) => {
        if (!response.canceled) {
            console.log(response.filePaths[0]);
            openFile(response.filePaths[0]);
        } else {console.log('No file selected');}
    })    
};

/**
 * Open the file and get its content. (Converted to string)
*/
function openFile (file) {
    console.log('The given file path is ' + file)
    const content = fs.readFile(file, (err, data) => {
        if (err) {
            console.log('there was an error');
        } else {
            console.log("The data is -> " + data);
            applicationWindow.webContents.send('opened-file', data.toString());
        }
    });
};



ipcMain.on('open-file', () => {
    console.log('Requested to open file.');
    getFileFromUser();
})
