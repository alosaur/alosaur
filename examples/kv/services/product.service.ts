import { Injectable } from "alosaur/mod.ts";

export interface Product {
  id: string;
  name: string;
  price: number;
}

@Injectable()
export class ProductService {
  private kv!: Deno.Kv;

  async getKv(): Promise<Deno.Kv> {
    if (!this.kv) {
      this.kv = await Deno.openKv();
    }
    return this.kv;
  }

  async getAll(): Promise<Product[]> {
    const kv = await this.getKv();
    const products: Product[] = [];
    for await (const entry of kv.list<Product>({ prefix: ["products"] })) {
      products.push(entry.value);
    }
    return products;
  }

  async getById(id: string): Promise<Product | null> {
    const kv = await this.getKv();
    const result = await kv.get<Product>(["products", id]);
    return result.value;
  }

  async create(data: Omit<Product, "id">): Promise<Product> {
    const kv = await this.getKv();
    const id = crypto.randomUUID();
    const product: Product = { id, ...data };
    await kv.set(["products", id], product);
    return product;
  }

  async update(id: string, data: Partial<Omit<Product, "id">>): Promise<Product | null> {
    const kv = await this.getKv();
    const existing = await this.getById(id);
    if (!existing) return null;
    const updated: Product = { ...existing, ...data };
    await kv.set(["products", id], updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const kv = await this.getKv();
    const existing = await this.getById(id);
    if (!existing) return false;
    await kv.delete(["products", id]);
    return true;
  }
}
