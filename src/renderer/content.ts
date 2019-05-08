import { Responce } from "../models/responce.ts";

export function content(text: string, status: number = 200): Responce {
    return {
      body: new TextEncoder().encode(text),
      status
    }
}
