import { IImmediatelyResponse, ImmediatelyResponse } from "./response.ts";

/**
 * Main request/response object of
 */
export class Context<T = any> {
  public state?: T;
  public readonly response: IImmediatelyResponse = new ImmediatelyResponse();
}
