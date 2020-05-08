import { ServerRequest, Response } from '../mod.ts';

export interface MiddlewareTarget {
    onPreRequest(req: ServerRequest, res: Response): Promise<any>;
    onPostRequest(req: ServerRequest, res: Response, actionResult?: any): Promise<any>;
}
