import * as React from 'react';
import { useParams } from 'react-router-dom';
import { reaction } from 'mobx';
import { Observer } from 'mobx-react-lite';

import { StickyObserver, StickyObserverContext } from 'shared/components/Sticky';

import ScrapDetail from './ScrapDetail';
import { useLibraryStore } from './store';

export default function Detail(): JSX.Element {
  const { bucketId } = useParams<{ bucketId: string }>();
  const libraryStore = useLibraryStore();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [stickyObserver, setStickyObserver] = React.useState<StickyObserver | undefined>();

  React.useEffect(() => {
    const root = rootRef.current;

    if (root) {
      const observer = new StickyObserver(root);

      setStickyObserver(observer);
    }
  }, [setStickyObserver]);

  React.useEffect(() => {
    const dispose = reaction(
      () => libraryStore.buckets.find((b) => b.id === (bucketId || '')),
      (bucket) => {
        if (bucket) {
          libraryStore.selectBucket(bucket);
          libraryStore.loadScraps(bucket);
        }
      }
    );

    return () => {
      dispose();
    };
  }, [bucketId]);

  return (
    <div
      className="bucket-detail flex-grow flex-shrink bg-white shadow overflow-x-hidden overflow-y-auto"
      ref={rootRef}
    >
      {stickyObserver ? (
        <StickyObserverContext.Provider value={stickyObserver}>
          <Observer>
            {() => (
              <>
                {libraryStore.scrapsOfSelectedBucket.map((s) => (
                  <ScrapDetail key={s.id} scrap={s} />
                ))}
              </>
            )}
          </Observer>
        </StickyObserverContext.Provider>
      ) : null}
    </div>
  );
}
