import { RequestMethod } from "../types/request-method.ts";

export interface ActionMetadataArgs {
    type: RequestMethod;
    object: Object, // object of declaration
    target: Object;
    method: string;
    route?: string | RegExp;
}