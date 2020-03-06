import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { readRootBucket } from '../../db';
import { BucketsStore, BucketsStoreContext } from '../../stores/buckets';

import List from './List';
import Detail from './Detail';

export default function index(): JSX.Element | null {
  const [store, setStore] = React.useState();

  React.useEffect(() => {
    readRootBucket().then(bucket => {
      const bucketStore = new BucketsStore(bucket);
      setStore(bucketStore);

      if (process.env.NODE_ENV === 'development') {
        window.bucketStore = bucketStore;
      }
    });
  }, []);

  return store ? (
    <BucketsStoreContext.Provider value={store}>
      <div className="library-main flex items-stretch">
        <List />

        <Switch>
          <Route exact path="/library">
            <div className="flex-grow" />
          </Route>
          <Route exact path="/library/:bucket">
            <Detail />
          </Route>
        </Switch>
      </div>
    </BucketsStoreContext.Provider>
  ) : null;
}
