import * as messageService from "../../services/messageService.js";
import prisma from "../../prisma/prismaClient.js";
import { getUserBySupabaseId } from "../../utils/socketUtils.js";

export function handleSendMessage(socket, chatNamespace) {
  return async (roomId, content) => {
    try {
      if (!content || content.trim() === "") {
        return socket.emit("error", { message: "Сообщение не может быть пустым" });
      }

      const user = await getUserBySupabaseId(socket.data.user.sub);

      const member = await prisma.roomMember.findUnique({
        where: { userId_roomId: { userId: user.id, roomId } },
      });

      if (!member) {
        return socket.emit("error", { message: "Вы не являетесь участником этой комнаты" });
      }

      const message = await messageService.createMessage(
        roomId,
        socket.data.user.sub,
        content
      );

      chatNamespace.to(roomId).emit("message:receive", {
        id: message.id,
        content: message.content,
        senderId: message.sender.id,
        senderName: message.sender.name || message.sender.email,
        createdAt: message.createdAt,
        roomId
      });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  };
}

export function handleDisconnect(socket, chatNamespace) {
  return async () => {
    try {
      const user = socket.data.user;
      if (user) {
        const dbUser = await getUserBySupabaseId(user.sub);
        const memberRooms = await prisma.roomMember.findMany({
          where: { userId: dbUser.id },
          select: { roomId: true }
        });

        for (const member of memberRooms) {
          chatNamespace.to(member.roomId).emit("user:offline", {
            userId: dbUser.id,
            username: user.name || user.email
          });
        }
      }
    } catch (error) {
      return;
    }
  };
}