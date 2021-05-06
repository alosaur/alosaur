import { ImmediatelyResponse } from "./response.ts";

export class Context<T = any> {
  public state?: T;
  public readonly response: ImmediatelyResponse = new ImmediatelyResponse();
}
