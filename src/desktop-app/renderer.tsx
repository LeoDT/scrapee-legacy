import '../shared/style.css';

import * as React from 'react';
import { render } from 'react-dom';

import { initI18next } from 'shared/utils/i18n';

import App from './App';

initI18next(navigator.language);

render(<App />, document.getElementById('app'));
