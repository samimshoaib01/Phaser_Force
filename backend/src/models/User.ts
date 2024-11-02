import mongoose, { Document,  } from 'mongoose';

interface IUser extends Document {
    name: string;
    googleID:string;
    email: string;
    password: string;
    createdAt: Date;
    photo:string;
}

const userSchema: mongoose.Schema<IUser> = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, },
    createdAt: { type: Date, default: Date.now, unique:true },
    googleID:{type:String,required:true},
    photo:{type:String},
    password:{type:String}
});
export const User = mongoose.model<IUser>('User', userSchema);

