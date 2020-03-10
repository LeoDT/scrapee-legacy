import './hot-reload';
import { nativeRequest } from './nativeRequest';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'sendToScrapee',
    title: 'Send to Scrapee',
    contexts: ['selection']
  });
});

let port: chrome.runtime.Port | null;

function initPort(): void {
  port = chrome.runtime.connectNative('com.leodt.scrapee');
  port.onMessage.addListener(function(msg) {
    console.log('Received', msg);
  });
  port.onDisconnect.addListener(() => {
    console.log('Disconnected');
    port = null;
  });
}

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg.type === 'nativeRequest') {
    nativeRequest(msg.resource, msg.body).then(
      response => {
        sendResponse(response);
      },
      e => {
        sendResponse({ error: true, errorName: e.name, errorMessage: e.message });
      }
    );

    return true;
  }

  return false;
});

chrome.contextMenus.onClicked.addListener(obj => {
  if (obj.menuItemId === 'sendToScrapee') {
    if (!port) initPort();

    if (port) {
      port.postMessage({
        id: 'sendToScrapee',
        title: 'Send to Scrapee',
        contexts: ['selection'],
        timestamp: Date.now()
      });
    }
  }
});

chrome.browserAction.onClicked.addListener(tab => {
  if (tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, { name: 'toggle-clipper' });
  }
});
