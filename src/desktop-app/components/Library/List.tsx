import * as React from 'react';
import { cx, css } from 'emotion';
import { Trans } from 'react-i18next';
import { Observer } from 'mobx-react-lite';

import BucketListItem from './BucketListItem';

import { useLibraryStore } from './store';

export default function List(): JSX.Element {
  const library = useLibraryStore();

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

      <Observer>
        {() => (library.bucketTree ? <BucketListItem node={library.bucketTree} /> : <></>)}
      </Observer>
    </div>
  );
}
