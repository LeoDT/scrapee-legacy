import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { Client } from 'core/client/types';

import { initI18nextWithReact } from 'shared/utils/i18n';

import Clipper from './Clipper';
import { Store } from './store';
import { StoreContext } from './context';

export async function mount(root: HTMLDivElement, client: Client): Promise<void> {
  const store = new Store(client);

  store.loadBuckets();

  initI18nextWithReact(navigator.language);

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
