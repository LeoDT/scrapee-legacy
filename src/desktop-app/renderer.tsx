import '../shared/style.css';
import './style.css';

import * as React from 'react';
import { render } from 'react-dom';

import { initI18nextWithReact } from 'shared/utils/i18n';

import { initDB } from './db/renderer';
import App from './App';

async function init(): Promise<void> {
  const db = await initDB();

  initI18nextWithReact(navigator.language);

  render(<App db={db} />, document.getElementById('app'));
}

init();
