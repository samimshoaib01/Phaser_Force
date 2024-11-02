import mongoose from "mongoose";


export const dbConnect=async()=>{
    const uri="mongodb://localhost:27017/Phaser-Force";
    try{
        const connect = await mongoose.connect(uri);
        console.log("MongoDB connected " + connect.connection.host);
    }
    catch(e){
        console.log("Error: ",e);
        process.exit(1); 
    }
}
