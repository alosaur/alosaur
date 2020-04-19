import { ServerRequest, Response } from '../mod.ts';

export interface MiddlwareTarget {
    onPreRequest(req: ServerRequest, res: Response): Promise<any>;
    onPostRequest(req: ServerRequest, res: Response, actionResult?: any): Promise<any>;
}
