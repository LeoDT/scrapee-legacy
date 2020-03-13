import { Socket } from 'net';
import { Request, ResponseBody, fail, success } from 'shared/utils/localMessage';

import { Routes, RouterContext } from './types';

export async function startRouter(socket: Socket, routes: Routes, request: Request): Promise<void> {
  const handler = routes[request.resource];

  if (handler) {
    const context: RouterContext = {
      request,
      send: (body: ResponseBody = success()) => {
        const res = JSON.stringify({ type: 'response', requestId: request.requestId, body });
        socket.write(res);

        console.log(`on send: ${res}`);
      }
    };

    return await handler(context);
  }

  socket.write(JSON.stringify({ type: 'response', requestId: request.requestId, body: fail() }));
}
