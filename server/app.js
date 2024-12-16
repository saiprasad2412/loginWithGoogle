import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-google-oauth2";
import connectDB from "./db/connection.js"; // Assuming this initializes your MongoDB connection
import userDB from "./models/user.schema.js";
import postsRoutes from "./routes/Posts.routes.js"

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

app.use(express.json());
connectDB();

app.use("/feed",postsRoutes);

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

const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;

// Configure Passport with Google OAuth2 strategy
passport.use(
  new OAuth2Strategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "/auth/google/callback",
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Profile:", profile);

      try {
        const existingUser = await userDB.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = new userDB({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        });
        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userDB.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/dashboard",
    failureRedirect: "http://localhost:5173/login",
  })
);


app.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User not logged in",
    });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5173/");
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
