import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import MainWindow from './components/MainWindow';

function App(): JSX.Element {
  return <MainWindow />;
}

export default hot(App);
