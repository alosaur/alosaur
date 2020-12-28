import { Context } from "./context.ts";

export type IMiddleware<TState = unknown> =
  | PreRequestMiddleware<TState>
  | PostRequestMiddleware<TState>
  | MiddlewareTarget<TState>;

export interface PreRequestMiddleware<TState = unknown> {
  onPreRequest(context: Context<TState>): void;
}

export interface PostRequestMiddleware<TState = unknown> {
  onPreRequest(context: Context<TState>): void;
}

export interface MiddlewareTarget<TState = unknown> {
  onPreRequest(context: Context<TState>): void;
  onPostRequest(context: Context<TState>): void;
}
