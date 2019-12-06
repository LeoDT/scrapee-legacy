import uuid from 'shared/utils/uuid';

export type ScrapType = 'text' | 'file';
export type ScrapSource = 'web-clipper';

export interface Scrap {
  id: string;
  name?: string;

  type: ScrapType;
  source?: ScrapSource;

  url?: URL;
  originalHTML?: string;
  content: string;
}

export function makeScrap(name = '', type: ScrapType = 'text'): Scrap {
  return {
    id: uuid.new(),
    name,
    type,

    content: ''
  };
}
