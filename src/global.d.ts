/* eslint @typescript-eslint/no-explicit-any: 0 */

declare type PlainObject = Record<string, unknown>;

declare module '*.svg';

interface Window {
  bucketStore: any;
}
