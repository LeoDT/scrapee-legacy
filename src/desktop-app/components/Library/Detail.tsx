import * as React from 'react';
import { useParams } from 'react-router-dom';

import { StickyObserver, StickyObserverContext } from 'shared/components/Sticky';

import { useLazyQueryLoadScraps } from 'core/client/queries';
import { useMutationSelectBucket } from 'core/client/mutations';

import ScrapDetail from './ScrapDetail';

export default function Detail(): JSX.Element {
  const { bucketId } = useParams<{ bucketId: string }>();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [stickyObserver, setStickyObserver] = React.useState<StickyObserver | undefined>();
  const [loadScraps, { data: scrapsData }] = useLazyQueryLoadScraps();
  const [selectBucket] = useMutationSelectBucket();

  React.useEffect(() => {
    const root = rootRef.current;

    if (root) {
      const observer = new StickyObserver(root);

      setStickyObserver(observer);
    }
  }, [setStickyObserver]);

  React.useEffect(() => {
    selectBucket({ variables: { id: bucketId || '' } });
    loadScraps({ variables: { bucketId: bucketId || '' } });
  }, [bucketId]);

  console.log(scrapsData);

  return (
    <div
      className="bucket-detail flex-grow flex-shrink bg-white shadow overflow-x-hidden overflow-y-auto"
      ref={rootRef}
    >
      {stickyObserver ? (
        <StickyObserverContext.Provider value={stickyObserver}>
          <>
            {scrapsData?.scraps?.map(s => (
              <ScrapDetail key={s.id} scrap={s} />
            ))}
          </>
        </StickyObserverContext.Provider>
      ) : null}
    </div>
  );
}
