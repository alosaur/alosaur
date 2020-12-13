import { ObjectKeyAny } from "../../src/mod.ts";

const global: ObjectKeyAny = {};

export function getOpenApiMetadataArgsStorage<TState>(): OpenApiArgsStorage<
  TState
> {
  if (!(global as any).OpenApiMetadataArgsStorage) {
    (global as any).OpenApiMetadataArgsStorage = new OpenApiArgsStorage();
  }

  return (global as any).OpenApiMetadataArgsStorage;
}

/**
 * Produces response data
 */
export interface OpenApiActionData {
  code: number;
  type?: any;
  description: string;

  /**
   * MediaType by default
   * @example application/json
   */
  mediaType?: string;
}

export interface OpenApiActionArgs {
  object: Object; // object of declaration
  target: Object;
  action: string;
  data: OpenApiActionData;
}

/**
 * Storage all openapi metadata read from decorators.
 */
export class OpenApiArgsStorage<TState> {
  /**
   * Registered actions.
   */
  actionProduces: OpenApiActionArgs[] = [];

  /**
   * Set of uses class and interface names
   */
  usableClassNamesSet: Set<string> = new Set<string>();
}
