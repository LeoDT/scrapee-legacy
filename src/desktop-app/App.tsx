import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { createCommonStores, CommonStoresContext } from 'shared/stores';

import ModalManager from 'shared/components/Modal/Manager';
import MainWindow from './components/MainWindow';
import { DB, DBContext } from './db/renderer';

interface Props {
  db: DB;
}

function App({ db }: Props): JSX.Element {
  const [commonStores] = React.useState(() => createCommonStores());

  return (
    <DBContext.Provider value={db}>
      <CommonStoresContext.Provider value={commonStores}>
        <>
          <MainWindow />

          <ModalManager />
        </>
      </CommonStoresContext.Provider>
    </DBContext.Provider>
  );
}

export default hot(App);
