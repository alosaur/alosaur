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

utils.sha256 = async (...msgs: Uint8Array[]): Promise<Uint8Array> => {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", utils.concatBytes(...msgs) as unknown as ArrayBuffer));
};
utils.sha256Sync = (...msgs: Uint8Array[]): Uint8Array => {
  return new Uint8Array((crypto.subtle as any).digestSync("SHA-256", utils.concatBytes(...msgs)));
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
