import socketAuthenticate from "./authenticate.js";

import {
  handleJoinRoom,
  handleLeaveRoom,
} from "./handlers/roomHandler.js";

import {
  handleSendMessage,
  handleDisconnect,
} from "./handlers/messageHandler.js";

export default function initializeSocket(io) {
  const chatNamespace = io.of("/chat");

  chatNamespace.use((socket, next) => {
    socketAuthenticate(socket, next);
  });

  chatNamespace.on("connection", (socket) => {
    socket.on("room:join", handleJoinRoom(socket, chatNamespace));
    socket.on("room:leave", handleLeaveRoom(socket, chatNamespace));
    socket.on("message:send", handleSendMessage(socket, chatNamespace));
    socket.on("disconnect", handleDisconnect(socket, chatNamespace));

    socket.on("error", (error) => {
      return;
    });
  });
}