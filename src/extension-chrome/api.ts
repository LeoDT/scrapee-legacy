import { DOMClipperApi } from 'shared/dom-clipper/api';

function request(resource: string, body?: PlainObject): Promise<PlainObject> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      {
        type: 'nativeRequest',
        resource,
        body
      },
      (res: PlainObject) => {
        resolve(res);
      }
    );
  });
}

export const api = {
  loadBuckets: () => request('buckets')
} as DOMClipperApi;
