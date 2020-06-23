import { app, BrowserWindow, Tray, screen, shell } from 'electron';
import * as path from 'path';
import * as net from 'net';

import { createLocalMessageServer } from './localMessageServer';
import { setApplicationMenu } from './appMenu';
import { initServices } from './services';
import { createServer as createIPCServer } from './ipcServer';

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

let cache: Partial<{
  tray: Tray;
  mainWindow: BrowserWindow;
  disposeGraphqlServer: () => void;
  localMessageServer: net.Server;
}> = {};

async function installExtensions(): Promise<unknown> {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
}

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    await installExtensions();
    BrowserWindow.addDevToolsExtension(
      '/Users/LeoDT/Library/Application Support/Google/Chrome/Default/Extensions/ncedobpgnmkhcmnnkcimnobpfepidadl/0.9.2_0/'
    );
  }

  const externalDisplay = screen
    .getAllDisplays()
    .find((display) => display.bounds.x !== 0 || display.bounds.y !== 0);

  const mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 760,
    x: externalDisplay ? externalDisplay.bounds.x + 50 : undefined,
    y: externalDisplay ? externalDisplay.bounds.y + 50 : undefined,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: process.env.NODE_ENV !== 'development',
    },
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

  mainWindow.on('close', (e) => {
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

  const services = await initServices();
  const localMessageServer = createLocalMessageServer(services);
  const disposeIPCServer = await createIPCServer(services);

  cache.tray = tray;
  cache.mainWindow = mainWindow;
  cache.disposeGraphqlServer = disposeIPCServer;
  cache.localMessageServer = localMessageServer;

  app.on('quit', () => {
    disposeIPCServer();
    cache.localMessageServer?.close();

    cache = {};
  });
});
