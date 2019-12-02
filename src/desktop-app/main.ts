import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as net from 'net';
import * as fs from 'fs';

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

const localMessageServer = net.createServer(stream => {
  stream.on('data', c => {
    console.log(`on data: ${c.toString()}`);
    stream.write(JSON.stringify({ response: 1 }));
    stream.end();
  });

  stream.on('end', () => {
    console.log(`on end`);
  });
});

localMessageServer.listen('/tmp/scrapee.sock');

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    await installExtensions();
  }

  const externalDisplay = screen
    .getAllDisplays()
    .find(display => display.bounds.x !== 0 || display.bounds.y !== 0);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    x: externalDisplay ? externalDisplay.bounds.x + 50 : undefined,
    y: externalDisplay ? externalDisplay.bounds.y + 50 : undefined,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:1234/index.html'
      : `file://${path.join(__dirname, 'index.html')}`
  );

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
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

  mainWindow.on('closed', () => {
    mainWindow = null;
    fs.unlinkSync('/tmp/scrapee.sock');
    localMessageServer.close();
  });
});
