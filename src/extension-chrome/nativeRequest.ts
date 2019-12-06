import uuid from 'shared/utils/uuid';

interface Request {
  type: 'request';
  requestId: string;
  resource: string;
  body: PlainObject;
}

interface Response {
  type: 'response';
  requestId: string;
  body: PlainObject;
}

let port: chrome.runtime.Port | null;
const sentRequests = new Map<
  string,
  {
    request: Request;
    resolve: (response?: PlainObject) => void;
    reject: (error?: Error) => void;
  }
>();

function handleMessage(msg: Response): void {
  if (msg.type === 'response') {
    const request = sentRequests.get(msg.requestId);

    if (request) {
      request.resolve(msg.body);
    }
  }
}

function initPort(): chrome.runtime.Port {
  port = chrome.runtime.connectNative('com.leodt.scrapee');
  port.onMessage.addListener(handleMessage);
  port.onDisconnect.addListener(function() {
    console.log('Disconnected');
    port = null;
  });

  return port;
}

export async function nativeRequest(
  resource: string,
  body: PlainObject = {}
): Promise<PlainObject> {
  if (!port) port = initPort();

  const request: Request = {
    type: 'request',
    requestId: uuid.uuid(),
    resource,
    body
  };

  port.postMessage(request);

  return new Promise((resolve, reject) => {
    sentRequests.set(request.requestId, {
      request,
      resolve,
      reject
    });
  });
}

export const api = {
  loadBuckets: () => nativeRequest('buckets')
};
