import * as React from 'react';
import { cx } from 'emotion';
import { Observer } from 'mobx-react-lite';

import { Sticky } from 'shared/components/Sticky';

import { Scrap } from 'core/client-types';

import PreviewScrappedHTML from '../common/PreviewScrappedHTML';

import { useLibraryStore } from './store';

interface Props {
  scrap: Scrap;
}

export default function ScrapDetail({ scrap }: Props): JSX.Element {
  const libraryStore = useLibraryStore();

  return (
    <Observer>
      {() => {
        const scrapState = libraryStore.scrapStates.get(scrap);

        return (
          <div className="scrap-detail border-b">
            <Sticky
              disabled={!scrapState.expanded}
              className={cx(
                'flex px-4 py-2 cursor-pointer items-center',
                scrapState.expanded ? 'text-gray-600 bg-gray-100' : 'text-black bg-white'
              )}
              onClick={() => {
                libraryStore.toggleScrap(scrap);
              }}
            >
              <h5>{scrap.title}</h5>
              <div className="ml-auto text-sm">{scrap.createdAt.toRelative()}</div>
            </Sticky>

            {scrapState.expanded ? (
              <div className="px-4 py-2">
                {scrap.content ? (
                  <div className="select-text">
                    <PreviewScrappedHTML
                      html={scrap.content.map((c) => c.value).join('\n')}
                      bucketId={scrap.bucketId}
                    />
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
