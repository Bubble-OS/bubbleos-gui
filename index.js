// Get all required modules, including Electron
const { app, BrowserWindow, dialog, screen, Menu } = require("electron");
const path = require("path");

// Get variables
const { APP_NAME, IN_BETA } = require("./src/data/constants");

// Get functions
const _timebomb = require("./src/func/timebomb");

/**
 * Create the main window, as well as check for timebombs and beta status.
 */
const createWindow = async () => {
  // If there is a timebomb, stop the app
  _timebomb();

  // Get the width and height of the display
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    // Multiply the window size by the size of the user's display by two, then divide that by three
    width: Math.round((width * 2) / 3),
    height: Math.round((height * 2) / 3),
    // Icon
    icon: path.join(__dirname, "assets", "bubble.ico"),
    // Allow Node.js
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // Load the main HTML file
  mainWindow.loadFile("index.html");

  const menuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "Exit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Commands",
      submenu: [
        {
          label: "Kill Task",
          accelerator: "CmdOrCtrl+K",
          click: () => {
            let win = new BrowserWindow({
              width: 800,
              height: 600,
              icon: path.join(__dirname, "assets", "bubble.ico"),
              webPreferences: {
                nodeIntegration: true,
              },
            });

            win.loadFile("src/commands/taskkill/taskkill.html");

            win.webContents.openDevTools();

            // Show the window when it's ready to be displayed
            win.once("ready-to-show", () => {
              win.show();
            });
          },
        },
      ],
    },
  ];

  // create menu from template
  const menu = Menu.buildFromTemplate(menuTemplate);

  // set application menu
  Menu.setApplicationMenu(menu);

  // If the app is in beta
  if (IN_BETA) {
    const betaWarning = await dialog.showMessageBox(null, {
      type: "warning",
      title: "Beta Warning",
      message: `WARNING: This is a beta version of ${APP_NAME}!`,
      detail: `There is most likely a new version of ${APP_NAME} that is more stable and has more features. Please upgrade to a new version as soon as possible.`,
      buttons: ["OK", "Cancel"],
      defaultId: 0,
      cancelId: 1,
    });

    if (betaWarning.response === 1) app.quit();
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
