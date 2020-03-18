import { observable, IObservableArray } from 'mobx';

import { Bucket } from 'shared/models/Bucket';
import { Scrap } from 'shared/models/Scrap';
import { sanitizeHTML } from 'shared/utils/html';
import { DOMClipperApi } from './api';

export class Store {
  api: DOMClipperApi;
  buckets: IObservableArray<Bucket> = observable.array([], { deep: false });

  selectedBucket: Bucket | null = null;

  constructor(api: DOMClipperApi) {
    this.api = api;
  }

  selectBucketWithId(path: string): boolean {
    const hit = this.buckets.find(b => b.path === path);

    if (hit) this.selectedBucket = hit;

    return Boolean(hit);
  }

  initApi(): Promise<{}> {
    return this.api.init();
  }

  async loadBuckets(): Promise<PlainObject> {
    const res = await this.api.loadBuckets();

    if (res.buckets) {
      this.buckets.replace(res.buckets);
      this.selectedBucket = res.buckets[0];
    }

    return res;
  }

  async saveScrap(els: HTMLElement[]): Promise<PlainObject> {
    const scrap = new Scrap(document.title);
    scrap.source = 'web-clipper';
    scrap.sourceUrl = location.href;

    els.forEach(el => {
      scrap.addTextContent(sanitizeHTML(el.outerHTML), el.outerHTML);
    });

    if (this.selectedBucket) {
      return this.api.saveScrap({ bucketId: this.selectedBucket.path, scrap });
    }

    return {};
  }
}
