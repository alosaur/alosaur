import { MiddlwareTarget } from '../models/middlware-target.ts';
import { Response, ServerRequest } from '../mod.ts';


export class CorsBuilder implements MiddlwareTarget {
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

  onPreRequest(request: ServerRequest, responce: Response) {
    return new Promise((res, rej) => {
      if (this.allowAnyOrigin) {
        this.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin') || '');
      }
      if (this.allowAnyMethod) {
        this.headers.set('Access-Control-Allow-Methods', request.headers.get('Access-Control-Request-Method') || '');
      }
      if (this.allowAnyHeader) {
        this.headers.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') || '');
      }
      res();
    });
  }

  onPostRequest(request: ServerRequest, responce: Response) {
    return new Promise((resolve, rej) => {
      this.headers.forEach((el, key) => {

        if (responce.headers) {
          responce.headers.set(key, el);
        };

      });
      resolve();
    });
  }

  WithOrigins(origins: string) {
    this.headers.set('Access-Control-Allow-Origin', origins);
    return this;
  }

  WithMethods(methods: string) {
    this.headers.set('Access-Control-Allow-Methods', methods);
    return this;
  }

  WithHeaders(headers: string) {
    this.headers.set('Access-Control-Allow-Headers', headers);
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
    this.headers.set('Access-Control-Allow-Credentials', 'true')
    return this;
  }
}