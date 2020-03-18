import { observable, decorate, computed } from 'mobx';

import { createContextNoNullCheck } from 'shared/utils/react';

import { Bucket, walkBucket } from 'shared/models/Bucket';
import { Scrap } from 'shared/models/Scrap';

export class BucketsStore {
  rootBucket: Bucket;
  expandStatus: {
    [k: string]: boolean;
  };

  selectedBucket: Bucket | undefined;

  constructor(rootBucket: Bucket) {
    this.rootBucket = rootBucket;
    this.expandStatus = {};
    this.selectedBucket = undefined;
  }

  toggleExpand(b: Bucket | Scrap): void {
    this.expandStatus[b.id] = !this.expandStatus[b.id];
  }

  setSelectedBucket(b: Bucket): void {
    this.selectedBucket = b;
  }

  get bucketIndex(): Map<string, Bucket> {
    const index = new Map<string, Bucket>();

    walkBucket(this.rootBucket, b => {
      if (b instanceof Bucket) {
        index.set(b.path, b);
      }
    });

    return index;
  }

  findBucketWithPath(p: string): Bucket | undefined {
    return this.bucketIndex.get(p);
  }
}

decorate(BucketsStore, {
  rootBucket: observable.ref,
  expandStatus: observable,
  selectedBucket: observable.ref,
  bucketIndex: computed
});

export const [useBucketsStore, BucketsStoreContext] = createContextNoNullCheck<BucketsStore>();
