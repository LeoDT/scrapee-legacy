import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { cx, css } from 'emotion';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react-lite';

import { useCommonStores } from 'shared/stores';
import { TreeNode } from 'shared/utils/tree';

import { Bucket } from 'core/client-types';

import { showContextMenu } from '../../utils/contextMenu';

import AngleRightIcon from '../../../assets/icon/angle-right.svg';

import { useLibraryStore } from './store';

interface Props {
  node: TreeNode<Bucket>;
  level?: number;
}

export default function BucketListItem({ node, level = 1 }: Props): JSX.Element | null {
  const { ui } = useCommonStores();
  const { t } = useTranslation();
  const history = useHistory();
  const libraryStore = useLibraryStore();

  const bucket = node.data;

  return (
    <Observer>
      {() => {
        const bucketState = libraryStore.bucketStates.get(bucket);

        return (
          <>
            <div
              className="bucket-list-item"
              onContextMenu={(e) =>
                showContextMenu(
                  [
                    {
                      id: 'createBucket',
                      label: t('createBucket'),
                      click: async () => {
                        libraryStore.createBucket(t('defaultNewBucketName'), bucket);
                      },
                    },
                    {
                      id: 'deleteBucket',
                      label: t('deleteBucket'),
                      click: async () => {
                        if (await ui.modal.confirm('Are you sure?')) {
                          libraryStore.trashBucket(bucket);
                        }
                      },
                      enabled: !bucketState.isRoot,
                    },
                  ],
                  { x: e.pageX, y: e.pageY }
                )
              }
            >
              <div
                className={cx(
                  'bucket-name py-1 flex items-stretch text-gray-700 cursor-pointer truncate',
                  libraryStore.selectedBucketId === bucket.id ? 'bg-white' : 'hover:bg-gray-100'
                )}
                onClick={() => {
                  libraryStore.selectBucket(bucket);

                  history.push(`/library/${encodeURIComponent(bucket.id)}`);
                }}
              >
                <div
                  className={cx(
                    css({ width: 10, paddingLeft: `${level * 0.5}rem` }),
                    'mr-2 flex flex-shrink-0 flex-grow-0 items-center justify-center box-content'
                  )}
                  onClick={(e) => {
                    if (node.children.length) {
                      libraryStore.toggleBucket(bucket);
                    }

                    e.stopPropagation();
                  }}
                >
                  {node.children.length ? (
                    <AngleRightIcon
                      className={cx('fill-current flex-grow-0 flex-shrink-0', {
                        'transform rotate-90': bucketState.expanded,
                      })}
                    />
                  ) : null}
                </div>
                <div className="flex-grow truncate">
                  {bucketState.isRoot ? t('rootBucketName') : bucketState.name}
                </div>
              </div>
            </div>

            {bucketState.expanded
              ? node.children.map((c) => <BucketListItem key={c.id} node={c} level={level + 1} />)
              : null}
          </>
        );
      }}
    </Observer>
  );
}
