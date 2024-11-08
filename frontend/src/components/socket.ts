import { io } from "socket.io-client";

interface PlayerProgress {
  x: number;
  y: number;
  elapsedTime: number;
  penalties: number;
  Level: string;
  userId: number; 
}


export const SocketConnection = (user:{isValid:boolean, userId:number|null,name:string}) => {

  if (!user.isValid || !user.userId) {
    console.log('User is not valid, socket connection not established');
    return null;
  }

  const socket = io("http://localhost:3000");

  const {userId,name,isValid}=user;

  console.log(userId,name,isValid);

    console.log("Boolean value: ",isValid)
 
  socket.on('connect', () => {
    console.log('Connected to WebSocket :', socket.id);
    
  });
  setInterval(() => {
    const latestlocation:PlayerProgress=JSON.parse(localStorage.getItem("playerProgress") || '{}' );

    latestlocation.userId=userId

    console.log("TOKEN : ",latestlocation);
    if(userId){
    socket.emit('myEvent', latestlocation);
  }
    
  }, 1000);

  return socket;
};
