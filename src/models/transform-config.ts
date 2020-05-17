export type TransformConfigMap = Map<
  "body" | string,
  TransformConfig
>;

export interface TransformConfig {
  type: "body" | string;
  getTransform: any;
}
