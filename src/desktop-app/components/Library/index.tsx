import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { treeFromPaths } from 'shared/utils/tree';

import { useQueryLoadAllBuckets } from 'core/client/queries';

import List from './List';
import Detail from './Detail';

export default function Library(): JSX.Element {
  const { data } = useQueryLoadAllBuckets();
  const tree = React.useMemo(() => {
    if (data?.allBuckets.buckets) {
      return treeFromPaths(data.allBuckets.buckets, b => b.id);
    }

    return null;
  }, [data]);

  return (
    <div className="library-main flex flex-grow overflow-hidden">
      {tree ? <List root={tree} /> : null}

      <Switch>
        <Route exact path="/library">
          <Detail />
        </Route>
        <Route exact path="/library/:bucketId">
          <Detail />
        </Route>
      </Switch>
    </div>
  );
}
