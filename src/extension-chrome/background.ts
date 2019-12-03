import './hot-reload';

chrome.runtime.onInstalled.addListener(function() {
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
  port.onDisconnect.addListener(function() {
    console.log('Disconnected');
    port = null;
  });
}

chrome.contextMenus.onClicked.addListener(function(obj) {
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
    chrome.tabs.sendMessage(tab.id, { name: 'toggle-inspector' });
  }
});
