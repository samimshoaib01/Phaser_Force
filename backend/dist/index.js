"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const dbConnect_1 = require("./dbConnect");
const User_1 = require("./models/User"); // Ensure you export IUser from your model
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
(0, dbConnect_1.dbConnect)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true // Enable cookies to be included in requests
}));
// Configure session
app.use((0, express_session_1.default)({
    secret: 'your_session_secret', // Replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Configure Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: "1009690822082-1tsjkugfa5ttu2bv0d0mhta2t9irlb0f.apps.googleusercontent.com", // Replace with your Client ID
    clientSecret: "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", // Replace with your Client Secret
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user already exists
        let user = await User_1.User.findOne({ googleID: profile.id }); // Type assertion to IUserDocument
        if (!user) {
            // If not, create a new user
            user = await User_1.User.create({
                googleID: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value || null,
                photo: profile.photos?.[0]?.value || null,
                password: ""
            }); // Type assertion to IUserDocument
        }
        return done(null, user); // user is now of type IUserDocument
    }
    catch (error) {
        return done(error, undefined);
    }
}));
// Serialize user
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
// Google Auth Routes
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    if (req.user) {
        const userId = req.user.googleID; // Accessing googleId
        const userName = req.user.name; // Accessing user's name
        // Redirect with user info
        res.redirect(`http://localhost:5173/game?userId=${userId}&userName=${encodeURIComponent(userName)}`);
    }
    else {
        res.redirect('/'); // Handle the case where user is undefined
    }
});
app.get('/', (req, res) => {
    res.send("Error while signing In");
});
app.post("/auth/local", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        console.log("USER:", user);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        else {
            if (!user.password) {
                res.status(400).json({
                    message: "This email is registered via Google. Please use Google sign-in."
                });
            }
            else {
                const result = await bcrypt_1.default.compare(password, user.password);
                if (!result) {
                    res.status(400).json({ message: "Wrong password" });
                }
                else {
                    res.status(200).send("Login successful");
                }
            }
        }
    }
    catch (error) {
        console.log(error.message);
        res.send(411).send("Error while login user");
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
