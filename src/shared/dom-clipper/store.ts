import { observable, decorate } from 'mobx';

import { Bucket } from 'shared/models/Bucket';
import { Scrap } from 'shared/models/Scrap';
import { sanitizeHTMLElement } from 'shared/utils/html';
import { DOMClipperApi } from './api';
import { xPathWithWindow } from '../utils/domPath';

export class Store {
  api: DOMClipperApi;
  rootBucket?: Bucket;

  selectedBucket: Bucket | null = null;

  constructor(api: DOMClipperApi) {
    this.api = api;
  }

  selectBucketWithId(id: string): boolean {
    /* const hit = this.buckets.find(b => b.id === id);

    if (hit) this.selectedBucket = hit;

    return Boolean(hit); */

    return true;
  }

  initApi(): Promise<{}> {
    return this.api.init();
  }

  async loadBuckets(): Promise<PlainObject> {
    const res = await this.api.loadRootBucket();

    if (res.root) {
      this.rootBucket = res.root;
      this.selectedBucket = res.root;
    }

    return res;
  }

  async saveScrap(els: HTMLElement[]): Promise<PlainObject> {
    const xPath = xPathWithWindow(window.Node);
    const scrap = new Scrap('');
    scrap.name = document.title;
    scrap.source = 'web-clipper';
    scrap.sourceUrl = location.href;

    els.forEach(el => {
      scrap.addTextContent(sanitizeHTMLElement(el, { absolutifyURLs: true }), {
        originalHTML: el.outerHTML,
        xPath: xPath(el)
      });
    });

    if (this.selectedBucket) {
      debugger;
      return this.api.saveScrap({ bucketId: this.selectedBucket.id, scrap });
    }

    return {};
  }
}

decorate(Store, {
  rootBucket: observable.ref
});
