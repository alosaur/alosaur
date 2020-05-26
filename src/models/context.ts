import { Request } from './request.ts';
import { Response } from './response.ts';
import { ServerRequest } from '../mod.ts';

export class Context {
   public readonly request: Request;
   public readonly response: Response;

   constructor(serverRequest: ServerRequest) {
     this.request = new Request(serverRequest);
     this.response = new Response();
   }

}