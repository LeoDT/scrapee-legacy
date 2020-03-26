import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Observer } from 'mobx-react-lite';

import { Bucket } from 'shared/models/Bucket';
import { useBucketsStore } from '../../stores/buckets';

import { StickyObserver, StickyObserverContext } from 'shared/components/Sticky';
import ScrapDetail from './ScrapDetail';
import BucketDetail from './BucketDetail';

export default function Detail(): JSX.Element {
  const bucketStore = useBucketsStore();
  const { bucketId } = useParams<{ bucketId: string }>();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [stickyObserver, setStickyObserver] = React.useState<StickyObserver | undefined>();

  React.useEffect(() => {
    const b = bucketStore.findBucketWithPath(bucketId ? decodeURIComponent(bucketId) : '');

    if (b) {
      bucketStore.setSelectedBucket(b);
    }
  }, [bucketStore, bucketId]);

  React.useEffect(() => {
    const root = rootRef.current;

    if (root) {
      const observer = new StickyObserver(root);

      setStickyObserver(observer);
    }
  }, [setStickyObserver]);

  return (
    <div
      className="bucket-detail flex-grow flex-shrink bg-white shadow overflow-x-hidden overflow-y-auto"
      ref={rootRef}
    >
      {stickyObserver ? (
        <StickyObserverContext.Provider value={stickyObserver}>
          <Observer>
            {() => {
              return bucketStore.selectedBucket ? (
                <>
                  {bucketStore.selectedBucket.children.map(c => (
                    <div key={c.id} className="border-b-2">
                      {c instanceof Bucket ? (
                        <BucketDetail bucket={c} />
                      ) : (
                        <ScrapDetail scrap={c} />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="empty" />
              );
            }}
          </Observer>
        </StickyObserverContext.Provider>
      ) : null}
    </div>
  );
}
