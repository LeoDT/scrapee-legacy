import { observable, decorate } from 'mobx';

import { createContextNoNullCheck } from 'shared/utils/react';

import { Bucket } from '../../shared/models/Bucket';

export class BucketsStore {
  rootBucket: Bucket;
  expandStatus: {
    [k: string]: boolean;
  };

  constructor(rootBucket: Bucket) {
    this.rootBucket = rootBucket;
    this.expandStatus = {};
  }

  toggleExpandBucket(b: Bucket): void {
    this.expandStatus[b.path] = !this.expandStatus[b.path];
  }
}

decorate(BucketsStore, {
  rootBucket: observable.ref,
  expandStatus: observable
});

export const [useBucketsStore, BucketsStoreContext] = createContextNoNullCheck<BucketsStore>();
