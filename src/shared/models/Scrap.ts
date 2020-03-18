import { DateTime } from 'luxon';
import uuid from 'shared/utils/uuid';

export type ScrapType = 'text' | 'file';
export type ScrapSource = 'web-clipper';

export interface ScrapContent {
  key: string | number;
  type: ScrapType;
  value: string;

  originalHTML?: string;
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

  source?: ScrapSource;
  sourceUrl?: string;

  content: ScrapContent[];

  createdAt: DateTime;

  constructor(name = '') {
    this.name = name;

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

  addTextContent(value: string, originalHTML?: string, key?: string): ScrapContent {
    const content: ScrapContent = {
      type: 'text',
      value,
      key: key ?? this.generateKeyForNewContent(),
      originalHTML
    };

    this.content.push(content);

    return content;
  }
}
