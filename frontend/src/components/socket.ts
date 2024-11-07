
import { io } from "socket.io-client";

// Create a function to initialize the socket with user info
export const SocketConnection = (isvalid:boolean) => {
    console.log("Boolean value: ",isvalid)
  if (isvalid==false) {
    console.log('User is not valid, socket connection not established');
    return null;
  }

  // Pass the userId as a query parameter during socket connection
  const socket = io("http://localhost:3000");

  socket.on('connect', () => {
    console.log('Connected to WebSocket :', socket.id);
  });

  return socket;
};
