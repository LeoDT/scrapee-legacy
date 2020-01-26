import { resolve } from 'path';
import { promises as fs } from 'fs';

import { Bucket } from '../../shared/models/Bucket';
import { Scrap } from '../../shared/models/Scrap';

const root = '/Users/LeoDT/tmp/scrapee';
const bucketsRoot = resolve(root, 'buckets');

export async function readScrap(path: string): Promise<Scrap> {
  const file = await fs.readFile(path);
  const json = JSON.parse(file.toString());

  const scrap = new Scrap(json.name, json.type);

  return scrap;
}

export async function readBucket(path: string): Promise<Array<Bucket | Scrap>> {
  const fullPath = resolve(bucketsRoot, path);

  try {
    const dirents = await fs.readdir(fullPath, { withFileTypes: true });

    return Promise.all<Bucket | Scrap>(
      dirents
        .map(de => {
          const direntPath = resolve(fullPath, de.name);

          if (de.isDirectory()) {
            return Promise.resolve(new Bucket(direntPath, de.name));
          }

          if (de.isFile()) {
            return readScrap(direntPath);
          }

          return null;
        })
        .filter((e): e is Promise<Bucket> | Promise<Scrap> => e !== null)
    );
  } catch (e) {
    return [];
  }
}

export async function readRootBucket(): Promise<Bucket> {
  const rootBucket = new Bucket(bucketsRoot);

  rootBucket.children = await readBucket(bucketsRoot);

  return rootBucket;
}
