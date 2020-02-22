import { ParamArgs } from "../metadata/metadata.ts";

export interface MetaRoute{
  route: string;
  target: {[key: string]: any};
  action: string;
  method: string;
  // route params
  params: ParamArgs[];
}