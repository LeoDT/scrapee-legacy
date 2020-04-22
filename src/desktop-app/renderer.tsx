import '../shared/style.css';
import './style.css';

import * as React from 'react';
import { render } from 'react-dom';

import { initI18nextWithReact } from 'shared/utils/i18n';

import { createClient, ClientContext } from '../core/client/ipcClient';
import App from './App';

async function init(): Promise<void> {
  const client = createClient();

  window.client = client;

  initI18nextWithReact(navigator.language);

  render(
    <ClientContext.Provider value={client}>
      <App />
    </ClientContext.Provider>,
    document.getElementById('app')
  );
}

init();
