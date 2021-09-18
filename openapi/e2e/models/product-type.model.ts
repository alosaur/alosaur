/**/
export enum ProductTypeEnum {
  shop,
  clothes,
  education,
}

/**
 * Type of product
 */
export interface ProductType {
  id: number;
  type: ProductTypeEnum;
}
