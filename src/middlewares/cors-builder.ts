import { MiddlewareTarget } from "../models/middleware-target.ts";
import { HttpContext } from "../models/http-context.ts";

export class CorsBuilder<T> implements MiddlewareTarget<T> {
  private headers: Map<string, string>;
  private allowAnyOrigin: boolean;
  private allowAnyMethod: boolean;
  private allowAnyHeader: boolean;

  constructor() {
    this.headers = new Map();
    this.allowAnyOrigin = false;
    this.allowAnyMethod = false;
    this.allowAnyHeader = false;
  }

  onPreRequest(context: HttpContext<T>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.allowAnyOrigin) {
        this.headers.set(
          "Access-Control-Allow-Origin",
          context.request.headers.get("Origin") || "",
        );
      }
      if (this.allowAnyMethod) {
        this.headers.set(
          "Access-Control-Allow-Methods",
          context.request.headers.get("Access-Control-Request-Method") || "",
        );
      }
      if (this.allowAnyHeader) {
        this.headers.set(
          "Access-Control-Allow-Headers",
          context.request.headers.get("Access-Control-Request-Headers") || "",
        );
      }

      if (context.request.method == "OPTIONS") {
        this.onPostRequest(context);

        context.response.status = 200;
        context.response.setImmediately();
      }

      resolve();
    });
  }

  onPostRequest(context: HttpContext<T>): Promise<void> {
    return new Promise<void>((resolve, rej) => {
      this.headers.forEach((el, key) => {
        context.response.headers.set(key, el);
      });
      resolve();
    });
  }

  WithOrigins(origins: string) {
    this.headers.set("Access-Control-Allow-Origin", origins);
    return this;
  }

  WithMethods(methods: string) {
    this.headers.set("Access-Control-Allow-Methods", methods);
    return this;
  }

  WithHeaders(headers: string) {
    this.headers.set("Access-Control-Allow-Headers", headers);
    return this;
  }

  AllowAnyOrigin() {
    this.allowAnyOrigin = true;
    return this;
  }

  AllowAnyMethod() {
    this.allowAnyMethod = true;
    return this;
  }

  AllowAnyHeader() {
    this.allowAnyHeader = true;
    return this;
  }

  AllowCredentials() {
    this.headers.set("Access-Control-Allow-Credentials", "true");
    return this;
  }
}
