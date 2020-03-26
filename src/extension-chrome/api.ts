import { DOMClipperApi } from 'shared/dom-clipper/api';
import { Resource } from 'shared/utils/localMessage';

function request(resource: Resource, body?: PlainObject): Promise<PlainObject> {
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
  loadRootBucket: () => request('rootBucket'),
  saveScrap: body => request('saveScrap', body)
} as DOMClipperApi;
