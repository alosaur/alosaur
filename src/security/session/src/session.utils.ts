import * as secp from "./secp256k1/mod.ts";

const enc = new TextEncoder();

export function getHash(text: string): Uint8Array {
  return (secp as any)!.utils.sha256Sync(enc.encode(text));
}
