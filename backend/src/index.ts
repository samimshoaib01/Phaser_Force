
import express, { Response, Request } from 'express';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import cors from 'cors';
import { dbConnect } from './dbConnect';
import { User } from './models/User'; // Ensure you export IUser from your model
import bcrypt from "bcrypt"
import * as dotenv from 'dotenv';
dotenv.config();
// Define an interface that extends Document from Mongoose

interface IUser extends Document {
    name: string;
    googleID:string;
    email: string;
    password: string;
    createdAt: Date;
    photo:string;
}

import { Document } from 'mongoose';

interface IUserDocument extends Document, IUser {}

const app = express();

declare global {
    namespace Express {
        interface User extends IUser {}
        interface Request {
            user?: User;
        }
    }
}

dbConnect();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true // Enable cookies to be included in requests
}));

// Configure session
app.use(session({
    secret: 'your_session_secret', // Replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID|| "", // Replace with your Client ID
    clientSecret: process.env.CLIENT_SECRET || "",  // Replace with your Client Secret
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user already exists
        let user = await User.findOne({ googleID: profile.id }) as IUserDocument; // Type assertion to IUserDocument

        if (!user) {
            // If not, create a new user
            user = await User.create({
                googleID: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value || null,
                photo: profile.photos?.[0]?.value || null,
                password:""
            }) as IUserDocument; // Type assertion to IUserDocument
        }

        return done(null, user); // user is now of type IUserDocument
    } catch (error) {
        return done(error, undefined);
    }
}));

// Serialize user
passport.serializeUser((user: IUser, done) => {
    done(null, user);
});

passport.deserializeUser((user: IUser, done) => {
    done(null, user);
});

// Google Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req: Request, res: Response) => {
        if (req.user) {
            const userId = req.user.googleID; // Accessing googleId
            const userName = req.user.name; // Accessing user's name
            // Redirect with user info
            res.redirect(`http://localhost:5173/game?userId=${userId}&userName=${encodeURIComponent(userName)}`);
        } else {
            res.redirect('/'); // Handle the case where user is undefined
        }
    }
);

app.get('/', (req, res) => {
    res.send("Error while signing In");
});

app.post("/auth/local",async (req,res)=>{

   try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("USER:" ,user);
    if (!user) {
         res.status(404).json({ message: "User not found" });
    }
    else{
        if (!user.password) {
            res.status(400).json({ 
             message: "This email is registered via Google. Please use Google sign-in." 
           });
         }
         else{
            const result =await bcrypt.compare(password,user.password);
            if(!result){
                res.status(400).json({message:"Wrong password"});
            }
            else 
            {
                res.status(200).send("Login successful");
            }
         }
    
    }
    } 
    catch (error) {
    res.send(411).send("Error while login user");
   }
   
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
