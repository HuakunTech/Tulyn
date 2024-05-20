import { z } from "zod";
import * as jose from "jose";

export const JwtToken = z.object({
  header: z.string(),
  payload: z.string(),
  signature: z.string(),
});
export type JwtToken = z.infer<typeof JwtToken>;
export function splitJwt(token: string): JwtToken {
  const [header, payload, signature] = token.split(".");
  return { header, payload, signature };
}
// class JWT
export function jwtIsValid(token: string): boolean {
  try {
    jose.decodeJwt(token);
    return true;
  } catch (error) {
    return false;
  }
}
