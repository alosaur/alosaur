import * as secp from "./secp256k1/mod.ts";

const enc = new TextEncoder();

export async function getHash(text: string): Promise<Uint8Array> {
  return await (secp as any)!.utils.sha256(enc.encode(text));
}
