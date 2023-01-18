// prettier-ignore
import {
  CURVE,
  getPublicKey,
  getSharedSecret,
  Point,
  recoverPublicKey,
  schnorr,
  sign,
  Signature,
  signSync,
  utils,
  verify,
} from "./index.ts";
import { crypto } from "https://deno.land/std@0.171.0/crypto/mod.ts";

utils.sha256 = async (...msgs: Uint8Array[]): Promise<Uint8Array> => {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", utils.concatBytes(...msgs)));
};
utils.sha256Sync = (...msgs: Uint8Array[]): Uint8Array => {
  return new Uint8Array(crypto.subtle.digestSync("SHA-256", utils.concatBytes(...msgs)));
};

// prettier-ignore
export {
  CURVE,
  getPublicKey,
  getSharedSecret,
  Point,
  recoverPublicKey,
  schnorr,
  sign,
  Signature,
  signSync,
  utils,
  verify,
};
