import { basename } from 'path';
import { observable, computed, decorate, IObservableArray } from 'mobx';

import { Scrap } from './Scrap';

export class Bucket {
  path: string;
  name: string;

  children: IObservableArray<Bucket | Scrap>;

  constructor(path: string, name?: string) {
    this.path = path;

    if (name) {
      this.name = name;
    } else {
      this.name = basename(path);
    }

    this.children = observable.array([], { deep: false });
  }

  get id(): string {
    return this.path;
  }

  get childrenBuckets(): Bucket[] {
    return getChildBuckets(this);
  }
}

decorate(Bucket, {
  name: observable.ref,
  childrenBuckets: computed
});

export function getChildBuckets(b: Bucket): Bucket[] {
  return b.children.filter((c): c is Bucket => c instanceof Bucket);
}

export function walkBucket(root: Bucket, walker: (b: Bucket | Scrap) => void): void {
  function walk(cursor: Bucket | Scrap): void {
    walker(cursor);

    if (cursor instanceof Bucket) {
      cursor.children.forEach(child => {
        walk(child);
      });
    }
  }

  walk(root);
}
