const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const bcrypt = require("bcrypt");
const User = require("../Models/User");

// Local Strategy for username/password authentication
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // Find the user with the provided email
        const user = await User.findOne({ email });
        // If user not found or password doesn't match, return error
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // If user found and password matches, return user object
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google Strategy for Google OAuth authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists with the Google ID
        let user = await User.findOne({ googleId: profile.id });
        // If user not found, create a new user with Google ID
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: {
              publicId: "default",
              url: profile.photos[0].value,
            },
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user object to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user object from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
