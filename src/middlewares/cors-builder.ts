import { MiddlwareTarget } from '../models/middlware-target.ts';
import { Response, ServerRequest } from '../mod.ts';


export class CorsBuilder implements MiddlwareTarget {
    private headers: Map<string, string>;
  
    constructor() {
      this.headers = new Map();
    }

    onPreRequest(request: ServerRequest, responce: Response) {
      return new Promise((res, rej) => {
        res();
      });
    }

    onPostRequest(request: ServerRequest, responce: Response) {
      return new Promise((resolve, rej) => {
        this.headers.forEach((el, key) => {
          
          if(responce.headers){
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

    AllowAnyMethod() {
      this.headers.set('Access-Control-Allow-Methods', '*');
      return this;
    }

    AllowAnyHeaders() {
      this.headers.set('Access-Control-Allow-Headers', '*');
      return this;
    }
  }