import { resolve } from 'path';
import { promises as fs, ensureDir } from 'fs-extra';

import { Bucket, TRASH_BUCKET_NAME } from '../../shared/models/Bucket';
import { Scrap } from '../../shared/models/Scrap';

const root = '/Users/LeoDT/tmp/scrapee';
const bucketsRoot = resolve(root, 'buckets');
const trashPath = resolve(bucketsRoot, TRASH_BUCKET_NAME);

export async function startup(): Promise<void> {
  await ensureDir(bucketsRoot);
  await ensureDir(trashPath);
}

export async function readScrap(path: string): Promise<Scrap[]> {
  const file = await fs.readFile(path);
  const json = JSON.parse(file.toString());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrap = json.map((item: any) => Scrap.fromJSON(item));

  return scrap;
}

export async function readBucket(path: string, parent?: Bucket): Promise<Array<Bucket | Scrap>> {
  const fullPath = resolve(bucketsRoot, path);

  try {
    const dirents = await fs.readdir(fullPath, { withFileTypes: true });

    const children = await Promise.all<Bucket | Scrap[]>(
      dirents
        .map(de => {
          const direntPath = resolve(fullPath, de.name);

          if (de.isDirectory()) {
            const b = new Bucket(direntPath, parent);

            readBucket(b.path, b).then(children => {
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
  const rootBucket = new Bucket(bucketsRoot);

  rootBucket.children.replace(await readBucket(bucketsRoot, rootBucket));

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

export async function createBucket(parent: Bucket, name: string): Promise<Bucket> {
  const bucket = new Bucket(resolve(parent.path, name));

  try {
    await fs.mkdir(bucket.path);
  } catch (e) {
    console.log('create bucket failed', e);
  }

  parent.children.push(bucket);

  return bucket;
}

export async function moveBucket(src: Bucket, dst: Bucket): Promise<void> {
  if (src.isRoot || src.isTrash) {
    throw Error('root or trash is not movabled');
  }

  try {
    await fs.rename(src.path, `${dst.path}/${src.name}`);
  } catch (e) {
    console.log('move bucket failed', e);
  }

  src.parent?.children.remove(src);
  dst.children.push(src);
}
