import { isEmpty } from 'lodash';
import * as React from 'react';
import { Observer } from 'mobx-react-lite';
import { cx, css } from 'emotion';

import { Bucket } from '../../../shared/models/Bucket';
import { useBucketsStore } from '../../stores/buckets';

import AngleRightIcon from '../../../assets/angle-right.svg';

interface Props {
  bucket: Bucket;
  level?: number;
}

export default function BucketListItem({ bucket, level = 1 }: Props): JSX.Element {
  const bucketStore = useBucketsStore();

  return (
    <Observer>
      {() => {
        const expanded = bucketStore.expandStatus[bucket.path];

        return (
          <>
            <div className="bucket-list-item">
              <div
                className="bucket-name py-1 flex items-center text-gray-700 hover:bg-gray-400 cursor-pointer truncate"
                style={{
                  paddingLeft: `${level * 0.5}em`
                }}
                onClick={() => bucketStore.toggleExpandBucket(bucket)}
              >
                <div
                  className={cx(
                    css({ width: 10, height: 10 }),
                    'mr-1 flex flex-shrink-0 flex-grow-0 justify-center'
                  )}
                >
                  {isEmpty(bucket.childrenBuckets) ? null : (
                    <AngleRightIcon
                      className={cx('fill-current flex-grow-0 flex-shrink-0', {
                        'transform rotate-90': expanded
                      })}
                    />
                  )}
                </div>
                <div className="truncate">{bucket.name}</div>
              </div>
            </div>

            {expanded ? (
              <>
                {bucket.childrenBuckets.map(b => (
                  <BucketListItem key={b.path} bucket={b} level={level + 1} />
                ))}
              </>
            ) : null}
          </>
        );
      }}
    </Observer>
  );
}
