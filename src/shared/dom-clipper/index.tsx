import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import Clipper from './Clipper';
import { Store } from './store';
import { StoreContext } from './context';
import { DOMClipperApi } from './api';

export function mount(root: HTMLDivElement, api: DOMClipperApi): void {
  const store = new Store(api);

  store.loadBuckets();

  render(
    <StoreContext.Provider value={store}>
      <Clipper />
    </StoreContext.Provider>,
    root
  );
}

export function unmount(root: HTMLDivElement): void {
  unmountComponentAtNode(root);
}
