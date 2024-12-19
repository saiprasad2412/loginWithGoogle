import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import connectDB from "./db/connection.js";
import postsRoutes from "./routes/Posts.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js"
import path from "path";
import { fileURLToPath } from "url";

import configureGoogleAuth from "./utils/configureGoogleAuth.js";

dotenv.config();

const app = express();
const PORT = 8080;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

connectDB();
app.use(express.json({ limit: "10mb" })); // Adjust size limit as needed
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Setup session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Google authentication
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;
configureGoogleAuth(clientId, clientSecret);

//routes
app.use("/feed", postsRoutes);
app.use("/auth", authRoutes);  
app.use('/users', userRouter)

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
