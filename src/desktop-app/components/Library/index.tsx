import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { useDB } from '../../db/renderer';
import { BucketsStore, BucketsStoreContext } from '../../stores/buckets';

import List from './List';
import Detail from './Detail';

export default function index(): JSX.Element | null {
  const db = useDB();
  const [store] = React.useState<BucketsStore>(() => {
    const s = new BucketsStore(db);

    if (process.env.NODE_ENV === 'development') {
      window.bucketStore = s;
    }

    return s;
  });

  return (
    <BucketsStoreContext.Provider value={store}>
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
    </BucketsStoreContext.Provider>
  );
}
