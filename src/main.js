const electron = require("electron");

const { app, BrowserWindow } = electron;


// Listen for the app to be ready.
app.on("ready", () => {
    // Create a BrowserWindow when the app becomes ready.
    let applicationWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false 
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
});

app.on('window-all-closed', () => {
    if (process.platform !== "darwin") app.quit();
    console.log('Successfully Closed ');
});
