import * as React from 'react';
import { useObserver } from 'mobx-react-lite';

import { useStore } from './context';

export default function BucketSelector(): JSX.Element {
  const store = useStore();
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    store.selectBucketWithId(e.target.value);
  }, []);

  React.useEffect(() => {
    store.loadBuckets();
  }, []);

  return useObserver(() => (
    <select onChange={handleChange}>
      {store.buckets.map(b => (
        <option value={b.path} key={b.path}>
          {b.name}
        </option>
      ))}
    </select>
  ));
}
