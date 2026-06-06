import { createRemoteJWKSet, jwtVerify } from "jose";
import config from "../config.js";
import AppError from "../utils/appError.js";
// Создание набора JWK (JWKS)
const JWKS = createRemoteJWKSet(
  new URL(`${config.supabase.url}/auth/v1/.well-known/jwks.json`),
);

const ISSUER = `${config.supabase.url}/auth/v1`;

export default async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Вы не авторизованы", 401));
  }

  const token = authHeader.slice(7).trim();

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: "authenticated",
    });

    req.user = payload;
    next();
  } catch (err) {
    console.error("JWT verify error:", err?.message);
    return next(new AppError("Недействительный или истёкший токен", 401));
  }
}