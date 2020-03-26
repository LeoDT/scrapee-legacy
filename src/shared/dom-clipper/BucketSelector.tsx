import * as React from 'react';
import { Observer } from 'mobx-react-lite';

import Select from 'shared/components/Select';

import { useStore } from './context';
import { useTranslation } from 'react-i18next';

export default function BucketSelector(): JSX.Element {
  const { t } = useTranslation();
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
          options={
            store.rootBucket
              ? [{ text: t('rootBucketName'), value: store.rootBucket.id || '__ROOT__' }]
              : []
          }
          onChange={handleChange}
        />
      )}
    </Observer>
  );
}
