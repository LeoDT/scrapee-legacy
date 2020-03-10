import * as React from 'react';
import { Observer } from 'mobx-react-lite';

import Select from 'shared/components/Select';

import { useStore } from './context';

export default function BucketSelector(): JSX.Element {
  const store = useStore();
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    store.selectBucketWithId(e.target.value);
  }, []);

  React.useEffect(() => {
    store.loadBuckets();
  }, []);

  return (
    <Observer>
      {() => (
        <Select
          options={store.buckets.map(b => ({ text: b.name, value: b.path }))}
          onChange={handleChange}
        />
      )}
    </Observer>
  );
}
