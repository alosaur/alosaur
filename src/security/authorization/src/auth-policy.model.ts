import { SecurityContext } from "../../context/security-context.ts";

export type AuthPolicy = (
  context: SecurityContext,
) => Promise<boolean> | boolean;
