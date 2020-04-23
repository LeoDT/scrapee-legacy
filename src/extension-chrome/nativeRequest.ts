import uuid from 'shared/utils/uuid';
import { Request, Response } from 'shared/utils/localMessage';

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
  const request = sentRequests.get(msg.requestId);

  if (msg.type === 'response') {
    if (request) {
      request.resolve(msg.body);
    }
  } else if (msg.type === 'request') {
    // TODO: connection error
    if (request) {
      request.reject(Error('connection error'));
    }
  }
}

function initPort(): chrome.runtime.Port {
  port = chrome.runtime.connectNative('com.leodt.scrapee');
  port.onMessage.addListener(handleMessage);
  port.onDisconnect.addListener(function () {
    console.log('Disconnected');
    port = null;
  });

  return port;
}

export async function nativeRequest(body: PlainObject = {}): Promise<PlainObject> {
  if (!port) port = initPort();

  const request: Request = {
    type: 'graphql',
    requestId: uuid.uuid(),
    body,
  };

  port.postMessage(request);

  return new Promise((resolve, reject) => {
    sentRequests.set(request.requestId, {
      request,
      resolve,
      reject,
    });
  });
}
