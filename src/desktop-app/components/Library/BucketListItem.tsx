import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react-lite';
import { cx, css } from 'emotion';
import { useTranslation } from 'react-i18next';

import { Bucket } from 'shared/models/Bucket';

import { useBucketsStore } from '../../stores/buckets';
import { showContextMenu } from '../../utils/contextMenu';

import AngleRightIcon from '../../../assets/icon/angle-right.svg';
import { useCommonStores } from '../../../shared/stores';

interface Props {
  bucket: Bucket;
  level?: number;
}

export default function BucketListItem({ bucket, level = 1 }: Props): JSX.Element {
  const { ui } = useCommonStores();
  const { t } = useTranslation();
  const bucketStore = useBucketsStore();
  const history = useHistory();

  return (
    <Observer>
      {() => {
        const expanded = bucketStore.expandStatus[bucket.id];

        return (
          <>
            <div
              className="bucket-list-item"
              onContextMenu={e =>
                showContextMenu(
                  [
                    {
                      id: 'createBucket',
                      label: t('createBucket'),
                      click: async () => {
                        await bucketStore.db.createBucket(t('defaultNewBucketName'), bucket);

                        if (!expanded) {
                          bucketStore.toggleExpand(bucket);
                        }
                      }
                    },
                    {
                      id: 'deleteBucket',
                      label: t('deleteBucket'),
                      click: async () => {
                        if (await ui.modal.confirm('Are you sure?')) {
                          await bucketStore.db.trash(bucket);

                          if (expanded) {
                            bucketStore.toggleExpand(bucket);
                          }
                        }
                      },
                      enabled: !bucket.isRoot
                    }
                  ],
                  { x: e.pageX, y: e.pageY }
                )
              }
            >
              <div
                className={cx(
                  'bucket-name py-1 flex items-stretch text-gray-700 cursor-pointer truncate',
                  bucketStore.selectedBucket === bucket ? 'bg-white' : 'hover:bg-gray-100'
                )}
                onClick={() => {
                  history.push(`/library/${encodeURIComponent(bucket.id)}`);
                }}
              >
                <div
                  className={cx(
                    css({ width: 10, paddingLeft: `${level * 0.5}rem` }),
                    'mr-2 flex flex-shrink-0 flex-grow-0 items-center justify-center box-content'
                  )}
                  onClick={() => bucketStore.toggleExpand(bucket)}
                >
                  <AngleRightIcon
                    className={cx('fill-current flex-grow-0 flex-shrink-0', {
                      'transform rotate-90': expanded
                    })}
                  />
                </div>
                <div className="flex-grow truncate">
                  {bucket.isRoot ? t('rootBucketName') : bucket.name}
                </div>
              </div>
            </div>

            {expanded ? (
              <>
                {bucket.childrenBuckets.map(b => (
                  <BucketListItem key={b.id} bucket={b} level={level + 1} />
                ))}
              </>
            ) : null}
          </>
        );
      }}
    </Observer>
  );
}
