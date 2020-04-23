import * as React from 'react';
import { Observer } from 'mobx-react-lite';

import Select from 'shared/components/Select';

import { useStore } from './context';
import { useTranslation } from 'react-i18next';
import { isRootBucket } from '../../core/storage/utils';

export default function BucketSelector(): JSX.Element {
  const { t } = useTranslation();
  const store = useStore();
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    store.selectBucketWithId(e.target.value);
  }, []);

  return (
    <Observer>
      {() => (
        <Select
          options={store.buckets.map((b) => ({
            value: b.id,
            text: isRootBucket(b.id) ? t('rootBucketName') : b.id,
          }))}
          onChange={handleChange}
        />
      )}
    </Observer>
  );
}
