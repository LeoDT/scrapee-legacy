import { observable, IObservableArray } from 'mobx';

import { ScrapSource, Scrap } from 'core/client-types';

import { sanitizeHTMLElement } from 'shared/utils/html';

import { DOMClipperApi } from './api';
import { xPathWithWindow } from '../utils/domPath';
import { addTextContentToScrap } from '../../core/storage/utils';
import { DateTime } from 'luxon';

export class Store {
  api: DOMClipperApi;

  buckets: IObservableArray<string>;
  selectedBucket = '';

  constructor(api: DOMClipperApi) {
    this.api = api;
    this.buckets = observable.array([]);
  }

  selectBucket(id: string): boolean {
    this.selectedBucket = id;

    return true;
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
    const xPath = xPathWithWindow(window.Node);
    const scrap: Scrap = {
      id: '',
      title: document.title,
      source: ScrapSource.Clipper,
      sourceUrl: location.href,
      content: [],
      createdAt: DateTime.local()
    };

    els.forEach(el => {
      addTextContentToScrap(scrap, sanitizeHTMLElement(el, { absolutifyURLs: true }), {
        originalHTML: el.outerHTML,
        xPath: xPath(el)
      });
    });

    if (this.selectedBucket) {
      return this.api.createScrap({ bucketId: this.selectedBucket, scrap });
    }

    return {};
  }
}
