import { BaseStorage as BucketStorage } from 'core/storage';
import { Request, ResponseBody, Resource } from 'shared/utils/localMessage';

export interface LocalMessageServerContext {
  bucketStorage: BucketStorage;
}

export interface RouterContext {
  request: Request;
  send: (body?: ResponseBody) => void;
}

export interface RequestHandler {
  (context: RouterContext): Promise<void>;
}

export type Routes = Record<Resource, RequestHandler>;
