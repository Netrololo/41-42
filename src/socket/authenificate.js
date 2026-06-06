
import { createRemoteJWKSet, jwtVerify } from "jose";
import config from "../config.js";

const JWKS = createRemoteJWKSet(
  new URL(`\${config.supabase.url}/auth/v1/.well-known/jwks.json`),
);

const ISSUER = `\${config.supabase.url}/auth/v1`;

export default async function socketAuthenticate(socket, next) {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Токен не предоставлен"));
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: "authenticated",
    });

    socket.data.user = payload;
    next();
  } catch (err) {
    return next(new Error("Недействительный или истёкший токен"));
  }
}