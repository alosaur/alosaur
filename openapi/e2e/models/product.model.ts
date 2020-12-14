import { ProductType } from "./product-type.model.ts";

/**
 * Entity of product
 */
export class Product {
  /**
   * @summary Identifer of code
   * @example 1
   */
  id?: number;

  /**
   * @summary Array of test case
   * @example [1,2,3]
   */
  arr?: number[];

  /**
   * @summary Type of product
   * @example {id:0}
   */
  type?: ProductType;

  description?: string;

  isPrimary?: boolean;

  object?: Object;

  objectKeyword?: object;

  identifer?: bigint;

  minType?: any;

  date?: Date;
}
