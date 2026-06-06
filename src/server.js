import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import config from "./src/config.js";
import initializeSocket from "./socket/index.js";

const startServer = async () => {
  try {
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: { origin: config.cors.origin },
    });

    app.set("io", io);
    initializeSocket(io);

    httpServer.listen(config.port, () => {
      console.log(`Сервер запущен на порту http://localhost:\${config.port}`);
      console.log(`Документация доступна на http://localhost:\${config.port}/api/docs`);
    });
  } catch (err) {
    console.error("Не удалось запустить сервер:", err);
  }
};