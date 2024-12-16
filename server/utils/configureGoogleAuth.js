import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import userDB from '../models/user.schema.js';

const configureGoogleAuth = (clientId, clientSecret) => {
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
};

export default configureGoogleAuth;
