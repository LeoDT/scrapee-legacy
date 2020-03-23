import { DateTime } from 'luxon';
import uuid from 'shared/utils/uuid';
import { Bucket } from './Bucket';

export type ScrapType = 'text' | 'file';
export type ScrapSource = 'web-clipper';

export interface ScrapContent {
  key: string | number;
  type: ScrapType;
  value: string;

  originalHTML?: string;
  xPath?: string;
}

export interface ScrapContentMeta {
  key?: string | number;
  type?: ScrapType;
  originalHTML?: string;
  xPath?: string;
}

export class Scrap {
  static fromJSON(json: PlainObject): Scrap {
    const scrap = new Scrap(json.name as string);

    scrap.id = json.id as string;
    scrap.source = json.source as ScrapSource;
    scrap.sourceUrl = json.sourceUrl as string;
    scrap.createdAt = DateTime.fromISO(json.createdAt as string);

    scrap.content = json.content as ScrapContent[];

    return scrap;
  }

  id: string;
  name?: string;
  parent?: Bucket;

  source?: ScrapSource;
  sourceUrl?: string;

  content: ScrapContent[];

  createdAt: DateTime;

  constructor(name = '', parent?: Bucket) {
    this.name = name;
    this.parent = parent;

    this.id = uuid.new();
    this.createdAt = DateTime.local();

    this.content = [];
  }

  generateKeyForNewContent(): number {
    const numberKeys = this.content
      .map(({ key }) => key)
      .filter((k): k is number => typeof k === 'number');

    return Math.max(0, ...numberKeys) + 1;
  }

  addTextContent(
    value: string,
    { originalHTML, key, xPath, type = 'text' }: ScrapContentMeta
  ): ScrapContent {
    const content: ScrapContent = {
      type,
      value,
      key: key ?? this.generateKeyForNewContent(),
      originalHTML,
      xPath
    };

    this.content.push(content);

    return content;
  }
}
