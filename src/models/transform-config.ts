export type TransformTypeKeys = "body" | string;

export type TransformConfigMap = Map<TransformTypeKeys, TransformConfig>;

export interface TransformConfig {
  type: TransformTypeKeys;
  getTransform: any;
}

export interface TransformBodyOption {
  transform: any | Function;
  type: TransformTypeKeys;
  config?: TransformConfigMap;
}
