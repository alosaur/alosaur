import { ParamType } from "../types/param.ts";
import { RequestBodyParseOptions } from "../models/request.ts";

export interface ParamMetadataArgs {
  type: ParamType;
  target: Object;
  method: string;
  // Index in function
  index: number;
  name?: string;
  transform?: any;
  bodyParseOptions?: RequestBodyParseOptions;
}
