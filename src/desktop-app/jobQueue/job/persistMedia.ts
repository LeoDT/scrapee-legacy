import { last } from 'lodash';
import { JSDOM } from 'jsdom';
import http from 'http';
import path from 'path';
import fs from 'fs';

import { Scrap } from 'shared/models/Scrap';
import { xPathWithWindow } from 'shared/utils/domPath';
import uuid from 'shared/utils/uuid';

import { db } from '../../db/main';

import { Job } from './base';

interface Media {
  key: string | number;
  xPath: string;
  oldUrl: string;
  filename: string;
}

function extractMedia(scrap: Scrap): Media[] {
  const medias: Media[] = [];

  scrap.content.forEach(content => {
    const { window } = new JSDOM(content.value);
    const { document } = window;
    const xPath = xPathWithWindow(window.Node);

    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');

      if (src?.startsWith('http')) {
        medias.push({
          key: content.key,
          xPath: xPath(img),
          oldUrl: src,
          filename: ''
        });
      }
    });
  });

  return medias;
}

function replaceMedias(scrap: Scrap, medias: Media[]): Scrap {
  const newScrap = Scrap.clone(scrap);

  medias.forEach(({ key, xPath, oldUrl, filename }) => {
    const content = newScrap.content.find(c => c.key === key);

    if (content) {
      const { document } = new JSDOM(content.value).window;
      const xResult = document.evaluate(xPath, document);
      const node = xResult.iterateNext();

      if (node) {
        const el = node as Element;
        el.setAttribute('src', '');
        el.setAttribute('data-filename', filename);
        el.setAttribute('data-original-src', oldUrl);
      }

      content.value = document.body.innerHTML;
    }
  });

  return newScrap;
}

function guessFileExtFromResponse(response: http.IncomingMessage): string {
  const contentType = response.headers['content-type'];

  if (contentType) {
    return contentType.split('/')[1];
  }

  if (response.url) {
    return last(response.url.split('.')) || '';
  }

  return '';
}

export class PersistMediaJob extends Job {
  bucketId: string;
  scrapId: string;

  scrap?: Scrap;
  medias: Media[];

  constructor(bucketId: string, scrapId: string) {
    super('persistMedia');

    this.bucketId = bucketId;
    this.scrapId = scrapId;
    this.medias = [];
  }

  async download(media: Media): Promise<Media> {
    return new Promise((resolve, reject) => {
      console.log('downloading');
      http.get(media.oldUrl, response => {
        if (response.statusCode === 200) {
          const fileId = uuid.generate();
          const fileExt = guessFileExtFromResponse(response);
          const filename = `${fileId}${fileExt ? `.${fileExt}` : ''}`;
          const filePath = path.resolve(this.bucketId, filename);

          response.pipe(fs.createWriteStream(filePath));

          media.filename = filename;

          resolve(media);
        } else {
          reject(response.statusCode);
        }
      });
    });
  }

  async start(): Promise<void> {
    super.start();

    const bucket = await db.loadBucket(this.bucketId);

    const scrap = await db.loadScrap(this.bucketId, bucket);

    if (scrap) {
      this.medias = extractMedia(scrap);
    } else {
      this.fail('scrap not exists');

      return;
    }

    const all = await Promise.allSettled(this.medias.map(m => this.download(m)));

    const medias = all
      .filter((result): result is PromiseFulfilledResult<Media> => result.status === 'fulfilled')
      .map(result => result.value);

    const newScrap = replaceMedias(scrap, medias);

    await db.updateScrap(scrap, newScrap);
  }
}
