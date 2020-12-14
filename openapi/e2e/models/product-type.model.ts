/**
 *
 */
export enum ProductTypeCategory {
  shop,
  clothes,
  education,
}

/**
 * Type of product
 */
export interface ProductType {
  id: number;
  type: ProductTypeCategory;
}
