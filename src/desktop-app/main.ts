import { app, BrowserWindow, Tray, screen, shell } from 'electron';
import * as path from 'path';

import './localMessageServer';
import { setApplicationMenu } from './appMenu';

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

let cache: Record<string, unknown> = {};

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

  const mainWindow = new BrowserWindow({
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

  setApplicationMenu(mainWindow);

  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:1234/'
      : `file://${path.join(__dirname, 'index.html')}`
  );

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  function openLink(e: Electron.Event, url: string): void {
    if (mainWindow && url !== mainWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }

  mainWindow.webContents.on('will-navigate', openLink);
  mainWindow.webContents.on('new-window', openLink);

  mainWindow.on('close', e => {
    e.preventDefault();

    mainWindow.hide();
  });

  const tray = new Tray(path.resolve(__dirname, '..', 'assets', 'tray.png'));

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.loadURL(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:1234/'
          : `file://${path.join(__dirname, 'index.html')}`
      );

      mainWindow.show();
    }
  });

  app.on('quit', () => {
    cache = {};
  });

  cache.tray = tray;
  cache.mainWindow = mainWindow;
});
