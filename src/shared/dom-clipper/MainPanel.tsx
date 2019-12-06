import * as React from 'react';

import BucketSelector from './BucketSelector';

export default function MainPanel(): JSX.Element {
  return (
    <div className="scrapee-main-panel">
      <BucketSelector />
    </div>
  );
}
