import { ActionParam, Body, Controller, Delete, Get, NotFoundError, Param, Post, Put } from "alosaur/mod.ts";
import { ProductService } from "../../services/product.service.ts";

@Controller("/products")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getAll() {
    return this.productService.getAll();
  }

  @Get("/:id")
  @ActionParam(0, Param("id"))
  async getById(id: string) {
    const product = await this.productService.getById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }

  @Post()
  @ActionParam(0, Body())
  create(body: { name: string; price: number }) {
    return this.productService.create(body);
  }

  @Put("/:id")
  @ActionParam(0, Param("id"))
  @ActionParam(1, Body())
  async update(id: string, body: { name?: string; price?: number }) {
    const product = await this.productService.update(id, body);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }

  @Delete("/:id")
  @ActionParam(0, Param("id"))
  async delete(id: string) {
    const deleted = await this.productService.delete(id);
    if (!deleted) {
      throw new NotFoundError("Product not found");
    }
    return { success: true };
  }
}
