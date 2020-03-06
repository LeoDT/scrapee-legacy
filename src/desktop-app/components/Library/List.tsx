import * as React from 'react';
import { cx, css } from 'emotion';
import { Observer } from 'mobx-react-lite';

import { useBucketsStore } from '../../stores/buckets';

import BucketListItem from './BucketListItem';

export default function List(): JSX.Element {
  const store = useBucketsStore();

  return (
    <div
      className={cx(
        css({ width: 300, minWidth: 180 }),
        'flex-grow-0 flex-shrink bg-gray-200 font-mono text-sm select-none'
      )}
    >
      <div className="bg-gray-300 px-1 py-2 leading-none text-xs font-bold text-gray-700">
        Buckets
      </div>

      <Observer>
        {() => (
          <>
            {store.rootBucket.childrenBuckets.map(bucket => (
              <BucketListItem key={bucket.path} bucket={bucket} />
            ))}
          </>
        )}
      </Observer>
    </div>
  );
}
