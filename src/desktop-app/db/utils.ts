import path from 'path';
import { promises as fs } from 'fs';

import { ROOT } from 'shared/constants';

import { Bucket, ROOT_BUCKET_NAME, TRASH_BUCKET_NAME } from 'shared/models/Bucket';
import { Scrap } from 'shared/models/Scrap';

export const BUCKETS_ROOT = path.resolve(ROOT, ROOT_BUCKET_NAME);
export const TRASH_ROOT = path.resolve(ROOT, TRASH_BUCKET_NAME);

export async function loadScrap(root: string, scrapPath: string, parent: Bucket): Promise<Scrap> {
  const fullPath = path.resolve(root, scrapPath);

  const file = await fs.readFile(fullPath);
  const json = JSON.parse(file.toString());

  return Scrap.fromJSON(json, parent);
}

export async function loadBucket(
  root: string,
  bucketPath: string,
  parent?: Bucket
): Promise<Bucket> {
  const fullPath = path.resolve(root, bucketPath);
  const bucket = new Bucket(bucketPath);
  bucket.parent = parent;

  const dirents = await fs.readdir(fullPath, { withFileTypes: true });

  const results = await Promise.allSettled(
    dirents.map(dirent => {
      const childPath = path.join(bucketPath, dirent.name);

      if (dirent.isDirectory()) {
        return loadBucket(root, childPath, bucket);
      }

      if (dirent.isFile()) {
        return loadScrap(root, childPath, bucket);
      }

      return Promise.resolve(null);
    })
  );

  bucket.children.replace(
    results
      .filter((r): r is PromiseFulfilledResult<Bucket | Scrap> => r.status === 'fulfilled')
      .map(({ value }) => value)
  );

  return bucket;
}
