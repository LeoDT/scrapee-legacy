import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { createCommonStores, CommonStoresContext } from 'shared/stores';

import ModalManager from 'shared/components/Modal/Manager';
import MainWindow from './components/MainWindow';

function App(): JSX.Element {
  const [commonStores] = React.useState(() => createCommonStores());

  return (
    <CommonStoresContext.Provider value={commonStores}>
      <React.Suspense fallback={<div>Loading</div>}>
        <MainWindow />

        <ModalManager />
      </React.Suspense>
    </CommonStoresContext.Provider>
  );
}

export default hot(App);
