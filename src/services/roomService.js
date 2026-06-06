export async function getMyRooms(supabaseId) {
  const user = await getUserBySupabaseId(supabaseId);
  const members = await prisma.roomMember.findMany({
    where: { userId: user.id },
    select: { roomId: true },
  });
  return members.map(m => m.roomId);
}

export async function getRoomById(id) {
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) throw new AppError('Комната не найдена', 404);
  return room;
}

export async function createRoom(name, supabaseId) {
  const user = await getUserBySupabaseId(supabaseId);
  const existing = await prisma.room.findUnique({ where: { name } });
  if (existing) throw new AppError('Комната с таким названием уже существует', 400);
  const room = await prisma.room.create({ data: { name } });
  await prisma.roomMember.create({ data: { roomId: room.id, userId: user.id } });
  return room;
}

export async function deleteRoom(id) {
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) throw new AppError('Комната не найдена', 404);
  await prisma.room.delete({ where: { id } });
}

export async function joinRoom(roomId, supabaseId) {
  const user = await getUserBySupabaseId(supabaseId);
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) throw new AppError('Комната не найдена', 404);

  const existing = await prisma.roomMember.findUnique({
    where: { userId_roomId: { userId: user.id, roomId } },
  });
  if (existing) return existing;
  return prisma.roomMember.create({ data: { roomId, userId: user.id } });
}