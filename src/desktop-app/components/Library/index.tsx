import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { useClient } from 'core/client/ipcClient';

import List from './List';
import Detail from './Detail';

import { LibraryStore, LibraryStoreContext } from './store';

export default function Library(): JSX.Element {
  const client = useClient();
  const [store] = React.useState(() => new LibraryStore(client));

  React.useEffect(() => {
    store.loadBuckets();
  }, []);

  return (
    <LibraryStoreContext.Provider value={store}>
      <div className="library-main flex flex-grow overflow-hidden">
        <List />

        <Switch>
          <Route exact path="/library">
            <Detail />
          </Route>
          <Route exact path="/library/:bucketId">
            <Detail />
          </Route>
        </Switch>
      </div>
    </LibraryStoreContext.Provider>
  );
}
