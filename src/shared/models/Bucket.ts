import { basename } from 'path';
import { observable, computed, decorate, IObservableArray } from 'mobx';

import { Scrap } from './Scrap';

export const ROOT_BUCKET_NAME = '__ROOT__';
export const TRASH_BUCKET_NAME = '__TRASH__';

export class Bucket {
  id: string; // bucket id is file path

  parent?: Bucket;
  children: IObservableArray<Bucket | Scrap>;

  constructor(id: string, parent?: Bucket) {
    this.id = id;

    this.parent = parent;
    this.children = observable.array([], { deep: false });
  }

  toJSON(): PlainObject {
    return {
      id: this.id,
      children: this.children,
      name: this.name
    };
  }

  get name(): string {
    return basename(this.id);
  }

  get isRoot(): boolean {
    return !this.parent;
  }

  get isTrash(): boolean {
    return this.name === TRASH_BUCKET_NAME;
  }

  get childrenBuckets(): Bucket[] {
    return getChildBuckets(this);
  }
}

decorate(Bucket, {
  id: observable.ref,
  parent: observable.ref,

  isRoot: computed,
  isTrash: computed,
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
