import path from 'path';
import { promises as fs } from 'fs';
import fsExtra from 'fs-extra';
import { DateTime } from 'luxon';

import { Bucket } from 'shared/models/Bucket';
import { Scrap, RawScrap } from 'shared/models/Scrap';
import uuid from 'shared/utils/uuid';

import { TRASH_ROOT, loadBucket, loadScrap } from './utils';

export class BaseDB {
  root: string;
  trashBucket?: Bucket;

  constructor(root: string) {
    this.root = root;
  }

  private resolve(p: string): string {
    return path.resolve(this.root, p);
  }

  loadScrap(scrapPath: string, parent: Bucket): Promise<Scrap> {
    return loadScrap(this.root, scrapPath, parent);
  }

  loadBucket(bucketPath: string, parent?: Bucket): Promise<Bucket> {
    return loadBucket(this.root, bucketPath, parent);
  }

  async createBucket(name: string, parent: Bucket): Promise<Bucket> {
    const id = path.join(parent.id, name);
    const bucket = new Bucket(id, parent);
    const fullPath = this.resolve(id);

    await fs.mkdir(fullPath);

    parent.children.push(bucket);

    return bucket;
  }

  async createScrapFromJSON(json: PlainObject, parent: Bucket): Promise<Scrap> {
    const id = path.join(parent.id, `scrap.${uuid.generate()}.json`);
    const scrap = Scrap.fromJSON({ ...json, id }, parent);
    const fullPath = this.resolve(id);

    console.log('craete scrap from json');
    await fs.writeFile(fullPath, JSON.stringify(scrap));

    parent.children.push(scrap);

    return scrap;
  }

  async updateScrap(scrap: Scrap, update: RawScrap): Promise<Scrap> {
    const fullPath = this.resolve(scrap.id);

    await fs.writeFile(fullPath, JSON.stringify({ ...scrap.toJSON(), ...update }));

    Object.assign(scrap, update);

    return scrap;
  }

  async move(src: Bucket | Scrap, dst: Bucket, overwrite = false): Promise<void> {
    const srcFullPath = this.resolve(src.id);
    const dstFullPath = path.resolve(this.resolve(dst.id), path.basename(srcFullPath));

    await fsExtra.move(srcFullPath, dstFullPath, {
      overwrite
    });

    src.parent?.children.remove(src);
    dst.children.push(src);
  }

  async ensureTrashBucketLoaded(): Promise<void> {
    if (this.trashBucket) {
      return;
    }

    await fsExtra.ensureDir(TRASH_ROOT);
    this.trashBucket = await loadBucket(TRASH_ROOT, '');
  }

  async trash(src: Bucket | Scrap): Promise<void> {
    await this.ensureTrashBucketLoaded();

    let srcFullPath = this.resolve(src.id);
    const basename = path.basename(srcFullPath);
    const dstFullPath = path.resolve(TRASH_ROOT, basename);

    try {
      await fsExtra.move(srcFullPath, dstFullPath, { overwrite: false });
    } catch (e) {
      if (e.message === 'dest already exists.') {
        const suffix = DateTime.local().toFormat('yyyy-LL-dd HH:mm:ss');
        srcFullPath = path.resolve(srcFullPath, `${basename}(${suffix})`);

        await fsExtra.move(srcFullPath, dstFullPath, { overwrite: false });

        src.parent?.children.remove(src);
      }
    }
  }
}
