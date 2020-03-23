import * as React from 'react';
import { cx } from 'emotion';
import { Observer } from 'mobx-react-lite';

import { Scrap } from 'shared/models/Scrap';

import PreviewHTML from 'shared/components/PreviewHTML';
import { Sticky } from 'shared/components/Sticky';

import { useBucketsStore } from '../../stores/buckets';

interface Props {
  scrap: Scrap;
}

export default function ScrapDetail({ scrap }: Props): JSX.Element {
  const bucketsStore = useBucketsStore();

  return (
    <Observer>
      {() => {
        const expanded = bucketsStore.expandStatus[scrap.id];

        return (
          <div className="scrap-detail">
            <Sticky
              className={cx(
                'flex px-4 py-2 cursor-pointer items-center',
                expanded ? 'text-gray-600 bg-gray-100' : 'text-black bg-white'
              )}
              onClick={() => {
                bucketsStore.toggleExpand(scrap);
              }}
            >
              <h5>{scrap.name}</h5>
              <div className="ml-auto text-sm">{scrap.createdAt.toRelative()}</div>
            </Sticky>

            {bucketsStore.expandStatus[scrap.id] ? (
              <div className="px-4 py-2">
                {scrap.content ? (
                  <div className="select-text">
                    <PreviewHTML html={scrap.content.map(c => c.value).join('\n')} />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      }}
    </Observer>
  );
}
