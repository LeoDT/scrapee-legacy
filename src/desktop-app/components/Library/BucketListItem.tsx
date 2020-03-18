import { isEmpty } from 'lodash';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react-lite';
import { cx, css } from 'emotion';

import { Bucket } from '../../../shared/models/Bucket';
import { useBucketsStore } from '../../stores/buckets';

import AngleRightIcon from '../../../assets/icon/angle-right.svg';

interface Props {
  bucket: Bucket;
  level?: number;
}

export default function BucketListItem({ bucket, level = 1 }: Props): JSX.Element {
  const bucketStore = useBucketsStore();
  const history = useHistory();

  return (
    <Observer>
      {() => {
        const expanded = bucketStore.expandStatus[bucket.path];

        return (
          <>
            <div className="bucket-list-item">
              <div
                className={cx(
                  'bucket-name py-1 flex items-stretch text-gray-700 cursor-pointer truncate',
                  bucketStore.selectedBucket === bucket ? 'bg-white' : 'hover:bg-gray-100'
                )}
                style={{}}
                onClick={() => {
                  history.push(`/library/${encodeURIComponent(bucket.path)}`);
                }}
              >
                <div
                  className={cx(
                    css({ width: 10, paddingLeft: `${level * 0.5}rem` }),
                    'mr-2 flex flex-shrink-0 flex-grow-0 items-center justify-center box-content'
                  )}
                  onClick={() => bucketStore.toggleExpand(bucket)}
                >
                  {isEmpty(bucket.childrenBuckets) ? null : (
                    <AngleRightIcon
                      className={cx('fill-current flex-grow-0 flex-shrink-0', {
                        'transform rotate-90': expanded
                      })}
                    />
                  )}
                </div>
                <div className="flex-grow truncate">{bucket.name}</div>
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
