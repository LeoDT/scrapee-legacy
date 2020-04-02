import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { cx, css } from 'emotion';
import { useTranslation } from 'react-i18next';

import { useCommonStores } from 'shared/stores';
import { TreeNode } from 'shared/utils/tree';

import { Bucket } from 'core/client-types';
import { useMutationSelectBucket, useMutationToggleBucket } from 'core/client/mutations';

import { showContextMenu } from '../../utils/contextMenu';

import AngleRightIcon from '../../../assets/icon/angle-right.svg';

interface Props {
  node: TreeNode<Bucket>;
  level?: number;
  selectedBucketId?: string;
}

export default function BucketListItem({
  node,
  level = 1,
  selectedBucketId
}: Props): JSX.Element | null {
  const { ui } = useCommonStores();
  const { t } = useTranslation();
  const history = useHistory();

  const bucket = node.data;

  const [toggleBucket] = useMutationToggleBucket();
  const [selectBucket] = useMutationSelectBucket();

  const isRoot = bucket.id === '';

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
                  /* await bucketStore.db.createBucket(t('defaultNewBucketName'), bucket);

                        if (!expanded) {
                          bucketStore.toggleExpand(bucket);
                        } */
                }
              },
              {
                id: 'deleteBucket',
                label: t('deleteBucket'),
                click: async () => {
                  /* if (await ui.modal.confirm('Are you sure?')) {
                          await bucketStore.db.trash(bucket);

                          if (expanded) {
                            bucketStore.toggleExpand(bucket);
                          }
                        } */
                },
                enabled: !isRoot
              }
            ],
            { x: e.pageX, y: e.pageY }
          )
        }
      >
        <div
          className={cx(
            'bucket-name py-1 flex items-stretch text-gray-700 cursor-pointer truncate',
            selectedBucketId === bucket.id ? 'bg-white' : 'hover:bg-gray-100'
          )}
          onClick={() => {
            selectBucket({ variables: { id: bucket.id } });

            history.push(`/library/${encodeURIComponent(bucket.id)}`);
          }}
        >
          <div
            className={cx(
              css({ width: 10, paddingLeft: `${level * 0.5}rem` }),
              'mr-2 flex flex-shrink-0 flex-grow-0 items-center justify-center box-content'
            )}
            onClick={e => {
              if (node.children.length) {
                toggleBucket({ variables: { id: bucket.id } });
              }

              e.stopPropagation();
            }}
          >
            {node.children.length ? (
              <AngleRightIcon
                className={cx('fill-current flex-grow-0 flex-shrink-0', {
                  'transform rotate-90': bucket.expanded
                })}
              />
            ) : null}
          </div>
          <div className="flex-grow truncate">{isRoot ? t('rootBucketName') : bucket.name}</div>
        </div>
      </div>

      {bucket.expanded
        ? node.children.map(c => (
            <BucketListItem
              key={c.id}
              node={c}
              level={level + 1}
              selectedBucketId={selectedBucketId}
            />
          ))
        : null}
    </>
  );
}
