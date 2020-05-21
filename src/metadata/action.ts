import { RequestMethod } from "../types/request-method.ts";

export interface ActionMetadataArgs {
    type: RequestMethod;
    target: Object;
    method: string;
    route?: string | RegExp;
}