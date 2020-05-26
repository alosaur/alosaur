import { Context } from './context.ts';

export interface MiddlewareTarget<TState> {
    onPreRequest(context: Context<TState>): void;
    onPostRequest(context: Context<TState>): void;
}
