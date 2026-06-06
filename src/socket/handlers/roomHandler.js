import * as roomService from "../../services/roomService.js";
import prisma from "../../prisma/prismaClient.js";
import { getUserBySupabaseId } from "../../utils/socketUtils.js";

export function handleJoinRoom(socket, chatNamespace) {
  return async (roomId) => {
    try {
      const user = await getUserBySupabaseId(socket.data.user.sub);

      await roomService.joinRoom(roomId, socket.data.user.sub);

      socket.join(roomId);

      const members = await prisma.roomMember.findMany({
        where: { roomId },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      socket.emit("room:users", members.map((m) => m.user));

      socket.to(roomId).emit("user:online", {
        userId: user.id,
        username: user.name || user.email,
      });

      socket.emit("room:joined", { roomId });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  };
}

export function handleLeaveRoom(socket, chatNamespace) {
  return async (roomId) => {
    try {
      const user = await getUserBySupabaseId(socket.data.user.sub);

      const member = await prisma.roomMember.findUnique({
        where: { userId_roomId: { userId: user.id, roomId } },
      });

      if (!member) {
        return socket.emit("error", { message: "Вы не в этой комнате" });
      }

      await roomService.leaveRoom(roomId, socket.data.user.sub);

      socket.leave(roomId);

      socket.to(roomId).emit("user:offline", {
        userId: user.id,
        username: user.name || user.email,
      });

      socket.emit("room:left", { roomId });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  };
}