import { observable, decorate, computed } from 'mobx';

import { createContextNoNullCheck } from 'shared/utils/react';

import { Bucket, walkBucket } from 'shared/models/Bucket';
import { Scrap } from 'shared/models/Scrap';

import { createBucket, moveBucket } from '../db';

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

  get trashBucket(): Bucket {
    return this.rootBucket.childrenBuckets.find(b => b.isTrash) as Bucket;
  }

  findBucketWithPath(p: string): Bucket | undefined {
    return this.bucketIndex.get(p);
  }

  async createBucket(parent: Bucket, name: string): Promise<Bucket> {
    return createBucket(parent, name);
  }

  async moveBucketToTrash(b: Bucket): Promise<void> {
    return moveBucket(b, this.trashBucket);
  }
}

decorate(BucketsStore, {
  rootBucket: observable.ref,
  expandStatus: observable,
  selectedBucket: observable.ref,
  bucketIndex: computed
});

export const [useBucketsStore, BucketsStoreContext] = createContextNoNullCheck<BucketsStore>();
