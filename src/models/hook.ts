import { HttpContext } from "./http-context.ts";

export type HookMethod = keyof HookTarget<void, void>;

export interface HookTarget<TState, TPayload> {
  onPreAction?(context: HttpContext<TState>, payload: TPayload): void;
  onPostAction?(context: HttpContext<TState>, payload: TPayload): void;
  onCatchAction?(context: HttpContext<TState>, payload: TPayload): void;
}
