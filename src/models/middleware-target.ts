import { HttpContext } from "./http-context.ts";

export type IMiddleware<TState = unknown> =
  | PreRequestMiddleware<TState>
  | PostRequestMiddleware<TState>
  | MiddlewareTarget<TState>;

export interface PreRequestMiddleware<TState = unknown> {
  onPreRequest(context: HttpContext<TState>): void;
}

export interface PostRequestMiddleware<TState = unknown> {
  onPreRequest(context: HttpContext<TState>): void;
}

export interface MiddlewareTarget<TState = unknown> {
  onPreRequest(context: HttpContext<TState>): void;
  onPostRequest(context: HttpContext<TState>): void;
}
