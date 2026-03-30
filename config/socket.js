import { Server } from "socket.io";
import corsOptions from "./corsOptions.js";

let io;
//to create io
export const init = (httpServer) => {
  io = new Server(httpServer, { cors: corsOptions });
  return io;
};
//to access our io from other components
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
