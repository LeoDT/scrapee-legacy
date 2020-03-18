import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Observer } from 'mobx-react-lite';

import { Bucket } from 'shared/models/Bucket';
import { useBucketsStore } from '../../stores/buckets';

import ScrapDetail from './ScrapDetail';
import BucketDetail from './BucketDetail';

export default function Detail(): JSX.Element {
  const bucketStore = useBucketsStore();
  const { bucketId } = useParams<{ bucketId: string }>();

  React.useEffect(() => {
    if (bucketId) {
      const b = bucketStore.findBucketWithPath(decodeURIComponent(bucketId));

      if (b) {
        bucketStore.setSelectedBucket(b);
      }
    }
  }, [bucketStore, bucketId]);

  return (
    <Observer>
      {() => {
        const bucket = bucketStore.selectedBucket;

        return bucket ? (
          <div className="bucket-detail flex-grow flex-shrink bg-white shadow overflow-x-hidden overflow-y-auto">
            {bucket.children.map(c => (
              <div key={c.id} className="border-b-2">
                {c instanceof Bucket ? <BucketDetail bucket={c} /> : <ScrapDetail scrap={c} />}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty" />
        );
      }}
    </Observer>
  );
}
