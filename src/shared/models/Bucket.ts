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

  get childrenBuckets(): Bucket[] {
    return getChildBuckets(this);
  }
}

decorate(Bucket, {
  name: observable.ref,
  childrenBuckets: computed
});

export function getChildBuckets(bucket: Bucket): Bucket[] {
  return bucket.children.filter((c): c is Bucket => c instanceof Bucket);
}
