import 'normalize.css';

import * as React from 'react';
import { render } from 'react-dom';

render(<h4>123123</h4>, document.getElementById('app'));

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }
}
