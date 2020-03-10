import { DOMClipperApi } from 'shared/dom-clipper/api';

function request(resource: string, body?: PlainObject): Promise<PlainObject> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: 'nativeRequest',
        resource,
        body
      },
      (res: PlainObject) => {
        if (res) {
          if (res.error && res.errorMessage && res.errorName) {
            reject(Error(res.errorMessage as string));
          } else {
            resolve(res);
          }
        }
      }
    );
  });
}

export const api = {
  init: () => request('init'),
  loadBuckets: () => request('buckets'),
  saveScrap: body => request('saveScrap', body)
} as DOMClipperApi;
