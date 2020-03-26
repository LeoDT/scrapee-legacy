import fsExtra from 'fs-extra';
import { decorate, observable, computed } from 'mobx';

import { createContextNoNullCheck } from 'shared/utils/react';
import { Bucket, walkBucket } from 'shared/models/Bucket';

import { BUCKETS_ROOT, loadBucket } from './utils';
import { BaseDB } from './base';

export class DB extends BaseDB {
  rootBucket: Bucket;

  constructor(root: string, rootBucket: Bucket) {
    super(root);

    this.rootBucket = rootBucket;
  }

  get bucketIndex(): Map<string, Bucket> {
    const index = new Map<string, Bucket>();

    walkBucket(this.rootBucket, b => {
      if (b instanceof Bucket) {
        index.set(b.id, b);
      }
    });

    return index;
  }
}

decorate(DB, {
  rootBucket: observable.ref,
  bucketIndex: computed
});

export async function initDB(): Promise<DB> {
  await fsExtra.ensureDir(BUCKETS_ROOT);

  return new DB(BUCKETS_ROOT, await loadBucket(BUCKETS_ROOT, ''));
}

export const [useDB, DBContext] = createContextNoNullCheck<DB>();
