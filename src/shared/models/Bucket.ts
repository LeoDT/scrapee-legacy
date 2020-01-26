import { Scrap } from './Scrap';

export class Bucket {
  path: string;
  name: string;

  children: Array<Bucket | Scrap>;

  constructor(path: string, name = 'New Bucket') {
    this.path = path;
    this.name = name;

    this.children = [];
  }
}

export function getChildBuckets(bucket: Bucket): Bucket[] {
  return bucket.children.filter((c): c is Bucket => c instanceof Bucket);
}
