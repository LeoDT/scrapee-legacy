/* eslint @typescript-eslint/no-explicit-any: 0 */

declare type PlainObject = Record<string, unknown>;

declare module '*.svg';

interface Window {
  bucketStore: any;
}

declare module '*.css?string';
declare module 'react-shadow';

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const node: DocumentNode;

  export default node;
}
