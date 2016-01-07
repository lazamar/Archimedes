// Module to control application life.
var app = require('app');
// Let's disable cache otherwise it won't update the application when we change
// the files and restart the program.
app.commandLine.appendSwitch('--disable-http-cache');
// Module to create native browser window.
var BrowserWindow = require('browser-window');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        // Browser window options. See all at http://electron.atom.io/docs/v0.33.0/api/browser-window/
        width: 1000,
        height: 700,
        kiosk: true,
        frame: false,
    });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
    // mainWindow.loadUrl('http://localhost:8080');
    // mainWindow.loadUrl('http://localhost:8080');

    // Open the DevTools.
    mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
