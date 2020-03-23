import '../shared/style.css';
import './style.css';

import * as React from 'react';
import { render } from 'react-dom';

import { initI18next } from 'shared/utils/i18n';

import { startup } from './db';
import App from './App';

async function init(): Promise<void> {
  await startup();

  initI18next(navigator.language);

  render(<App />, document.getElementById('app'));
}

init();
