import { ServerResponse, ServerRequest } from '../mod.ts';

export interface HookTarget<T> {
    onPreAction?(request: ServerRequest, response: ServerResponse, payload: T): void;
    onPostAction?(request: ServerRequest, response: ServerResponse, payload: T, result?: any): void;
    onCatchAction?(request: ServerRequest, response: ServerResponse, payload: T, error?: any): void; 
}