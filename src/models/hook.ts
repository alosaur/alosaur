import { ServerResponse, ServerRequest } from '../mod.ts';

export interface HookTarget {
    onPreAction(request: ServerRequest, response: ServerResponse): ServerResponse;
    onPostAction(request: ServerRequest, response: ServerResponse): ServerResponse;
    onCatchAction(request: ServerRequest, response: ServerResponse, error: any): ServerResponse; 
}