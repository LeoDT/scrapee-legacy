import { mount, unmount } from 'shared/dom-clipper';
import { createClient } from './client';

const clipperRoot = document.createElement('div');
clipperRoot.setAttribute('id', 'scrapee-clipper-root');

let clipperInited = false;

chrome.runtime.onMessage.addListener((msg) => {
  const client = createClient();

  if (msg.name === 'toggle-clipper') {
    if (clipperInited) {
      unmount(clipperRoot);
      document.documentElement.removeChild(clipperRoot);
      clipperInited = false;
    } else {
      document.documentElement.appendChild(clipperRoot);
      mount(clipperRoot, client);
      clipperInited = true;
    }
  }
});
