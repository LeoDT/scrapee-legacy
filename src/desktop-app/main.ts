import { app, BrowserWindow, screen, shell } from 'electron';
import * as path from 'path';

import { server as localMessageServer } from './localMessageServer';

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

async function installExtensions(): Promise<unknown> {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
}

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    await installExtensions();
  }

  const externalDisplay = screen
    .getAllDisplays()
    .find(display => display.bounds.x !== 0 || display.bounds.y !== 0);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 760,
    x: externalDisplay ? externalDisplay.bounds.x + 50 : undefined,
    y: externalDisplay ? externalDisplay.bounds.y + 50 : undefined,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:1234/'
      : `file://${path.join(__dirname, 'index.html')}`
  );

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  function openLink(e: Electron.Event, url: string): void {
    if (mainWindow && url !== mainWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }

  mainWindow.webContents.on('will-navigate', openLink);
  mainWindow.webContents.on('new-window', openLink);

  mainWindow.on('closed', () => {
    mainWindow = null;
    localMessageServer.close();
  });
});
