import { Context } from './context.ts';

export interface MiddlewareTarget {
    onPreRequest(context: Context): void;
    onPostRequest(context: Context): void;
}
