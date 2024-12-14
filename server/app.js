require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("./db/connection");
const app = express();
const PORT=8080;
const session=require("express-session");
const passport=require("passport");
const OAuth2Strategy=require("passport-google-oauth2").Strategy;
const clientId=process.env.CLIENTID

const userDB= require("./modal/user.schema.js")

const clientSecret=process.env.CLIENTSECRET
app.use(cors({
    origin:"http://localhost:5173",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}));

//setup session
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID:clientId,
        clientSecret:clientSecret,
        callbackURL:"/auth/google/callback",
        scope:["email","profile"]
    },
    async(accessToken,refreshToken,profile,done)=>{
        console.log("profile",profile);
        
        try {
            const existingUser=await userDB.findOne({googleId:profile.id});
            if(existingUser){
                return done(null,existingUser);
            }
            const user=new userDB({
                googleId:profile.id,
                displayName:profile.displayName,
                email:profile.emails[0].value,
                image:profile.photos[0].value
            });
            await user.save();
            return done(null,user);
        } catch (error) {
            return done(error,null);
        }
    }
    
)
)

passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser(async(id,done)=>{
    try {
        const user=await userDB.findById(id);
        done(null,user);
    } catch (error) {
        done(error,null);
    }
});

//initialize google auth
app.get("/auth/google",passport.authenticate("google",{scope:["email","profile"]}));
app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:5173/dashboard",
    failureRedirect:"http://localhost:5173/login"
}));


app.use(express.json());
app.get("/",(req,res)=>{
    res.send("hello");
});

app.get("/login/sucess",(req,res)=>{
   if(req.user){
    res.status(200).json({
        success:true,
        message:"user logged in successfully",
        user:req.user
    })
   }
   else{
    res.status(401).json({
        success:false,
        message:"user not logged in"
    })
   }
});

app.get("/logout",(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("http://localhost:5173/");
    });
    
}); 

app.listen(PORT,()=>{
    console.log("server started");
});