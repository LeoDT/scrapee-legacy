import { Scrap, makeScrap } from './Scrap';

export interface Bucket extends Scrap {
  name: string;
  children: Scrap[];
}

export function makeBucket(name = 'New Bucket'): Bucket {
  const scrap = makeScrap();
  return {
    ...scrap,

    name,
    children: []
  };
}
