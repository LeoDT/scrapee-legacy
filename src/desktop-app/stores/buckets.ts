import { observable, decorate } from 'mobx';

import { createContextNoNullCheck } from 'shared/utils/react';

import { Bucket } from 'shared/models/Bucket';
import { Scrap } from 'shared/models/Scrap';

import { DB } from '../db/renderer';

export class BucketsStore {
  db: DB;

  expandStatus: {
    [k: string]: boolean;
  };
  selectedBucket: Bucket | undefined;

  constructor(db: DB) {
    this.db = db;

    this.expandStatus = {};
    this.selectedBucket = db.rootBucket;
  }

  toggleExpand(b: Bucket | Scrap): void {
    this.expandStatus[b.id] = !this.expandStatus[b.id];
  }

  setSelectedBucket(b: Bucket): void {
    this.selectedBucket = b;
  }

  findBucketWithPath(p: string): Bucket | undefined {
    return this.db.bucketIndex.get(p);
  }
}

decorate(BucketsStore, {
  expandStatus: observable,
  selectedBucket: observable.ref
});

export const [useBucketsStore, BucketsStoreContext] = createContextNoNullCheck<BucketsStore>();
