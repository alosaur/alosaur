import { Context } from './context.ts';

export type HookMethod = keyof HookTarget<void, void>;

export interface HookTarget<TState, TPayload> {
    onPreAction?(context: Context<TState>, payload: TPayload): void;
    onPostAction?(context: Context<TState>, payload: TPayload): void;
    onCatchAction?(context: Context<TState>, payload: TPayload): void;
}