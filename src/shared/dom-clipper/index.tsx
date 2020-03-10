import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import Clipper from './Clipper';
import { Store } from './store';
import { StoreContext } from './context';
import { DOMClipperApi } from './api';

export async function mount(root: HTMLDivElement, api: DOMClipperApi): Promise<void> {
  const store = new Store(api);

  await store.initApi();

  store.loadBuckets();

  render(
    <StoreContext.Provider value={store}>
      <Clipper ignoreRoot={root} />
    </StoreContext.Provider>,
    root
  );
}

export function unmount(root: HTMLDivElement): void {
  unmountComponentAtNode(root);
}
