import * as React from 'react';

import { Bucket } from 'shared/models/Bucket';

interface Props {
  bucket: Bucket;
}

export default function BucketDetail({ bucket }: Props): JSX.Element {
  return <div className="bucket-detail px-4 py-2">{bucket.name}</div>;
}
