import '../shared/style.css';
import './style.css';

import * as React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import { initI18nextWithReact } from 'shared/utils/i18n';

import { createClient } from '../core/client';
import App from './App';

async function init(): Promise<void> {
  const client = createClient();

  initI18nextWithReact(navigator.language);

  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('app')
  );
}

init();
