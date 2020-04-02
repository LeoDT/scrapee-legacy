import * as React from 'react';
import { cx, css } from 'emotion';
import { Trans } from 'react-i18next';

import { TreeNode } from 'shared/utils/tree';
import { Bucket } from 'core/client-types';
import { useQueryLibraryState } from 'core/client/queries';

import BucketListItem from './BucketListItem';

interface Props {
  root: TreeNode<Bucket>;
}

export default function List({ root }: Props): JSX.Element {
  const { data } = useQueryLibraryState();

  return (
    <div
      className={cx(
        css({ width: 200 }),
        'flex-grow-0 flex-shrink-0 bg-gray-200 font-mono text-sm select-none'
      )}
    >
      <div className="bg-gray-300 px-1 py-2 leading-none text-xs font-bold text-gray-700">
        <Trans i18nKey="bucket_plural" />
      </div>

      <BucketListItem node={root} selectedBucketId={data?.libraryState.selectedBucketId} />
    </div>
  );
}
