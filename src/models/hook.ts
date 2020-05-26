import { Context } from './context.ts';

export interface HookTarget<T> {
    onPreAction?(context: Context, payload: T): void;
    onPostAction?(context: Context, payload: T): void;
    onCatchAction?(context: Context, payload: T): void; 
}