import { DOMInspector } from '../dom-inspector';

let inspector: DOMInspector | null = null;
let inspectorInited = false;

chrome.runtime.onMessage.addListener(msg => {
  if (msg.name === 'toggle-inspector') {
    inspector = inspector || new DOMInspector(document);

    if (inspectorInited) {
      inspector.unmount();
      inspectorInited = false;
    } else {
      inspector.mount();
      inspectorInited = true;
    }
  }
});
