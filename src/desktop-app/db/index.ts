import { resolve } from 'path';
import { promises as fs } from 'fs';

import { Bucket } from '../../shared/models/Bucket';
import { Scrap } from '../../shared/models/Scrap';

const root = '/Users/LeoDT/tmp/scrapee';
const bucketsRoot = resolve(root, 'buckets');

export async function readScrap(path: string): Promise<Scrap[]> {
  const file = await fs.readFile(path);
  const json = JSON.parse(file.toString());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrap = json.map((item: any) => Scrap.fromJSON(item));

  return scrap;
}

export async function readBucket(path: string): Promise<Array<Bucket | Scrap>> {
  const fullPath = resolve(bucketsRoot, path);

  try {
    const dirents = await fs.readdir(fullPath, { withFileTypes: true });

    const children = await Promise.all<Bucket | Scrap[]>(
      dirents
        .map(de => {
          const direntPath = resolve(fullPath, de.name);

          if (de.isDirectory()) {
            const b = new Bucket(direntPath, de.name);

            readBucket(b.path).then(children => {
              b.children.replace(children);
            });

            return Promise.resolve(b);
          }

          if (de.isFile()) {
            return readScrap(direntPath);
          }

          return null;
        })
        .filter((e): e is Promise<Bucket> | Promise<Scrap[]> => e !== null)
    );

    return children.flat();
  } catch (e) {
    console.log(e);

    return [];
  }
}

export async function readRootBucket(): Promise<Bucket> {
  const rootBucket = new Bucket(bucketsRoot, 'ROOT');

  rootBucket.children.replace(await readBucket(bucketsRoot));

  return rootBucket;
}

export async function saveScrap(bucketPath: string, scrap: Scrap): Promise<void> {
  const scrapPath = resolve(bucketsRoot, bucketPath, 'scrap.json');

  let file;
  try {
    file = await fs.readFile(scrapPath);
  } catch (e) {
    console.log('no scrap found, will create');
  }

  const json = file ? JSON.parse(file.toString()) : [];

  json.push(scrap);

  await fs.writeFile(scrapPath, JSON.stringify(json));

  console.log('scrap saved');
}
