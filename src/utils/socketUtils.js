import prisma from "../prisma/prismaClient.js";
import AppError from "./appError.js";

export async function getUserBySupabaseId(supabaseId) {
  const user = await prisma.user.findUnique({ where: { supabaseId } });
  if (!user) throw new AppError("Пользователь не найден", 404);
  return user;
}