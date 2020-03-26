export type Resource = 'init' | 'rootBucket' | 'saveScrap';

export interface Request {
  type: 'request';
  requestId: string;
  resource: Resource;
  body: PlainObject;
}

export interface ResponseBody {
  success: boolean;
  [key: string]: unknown;
}

export interface Response {
  type: 'response';
  requestId: string;
  body: ResponseBody;
}

export function success(res: PlainObject = {}): ResponseBody {
  return {
    success: true,
    ...res
  };
}

export function fail(res: PlainObject = {}): ResponseBody {
  return {
    success: false,
    ...res
  };
}
