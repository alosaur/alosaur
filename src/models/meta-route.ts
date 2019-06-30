import { ParamArgs } from "../metadata/metadata.ts";

export interface MetaRoute{
  route: string;
  target: Object;
  action: string;
  method: string;
  // route params
  params: ParamArgs[];
}