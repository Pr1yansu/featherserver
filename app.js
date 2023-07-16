const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDb = require("./config/db");
const UserRoutes = require("./Routes/UserRoute");
const PhotoRoutes = require("./Routes/PhotoRoute");
const CategoryRoutes = require("./Routes/CategoryRoute");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./Config/passport");
const { handleError } = require("./Utils/errohandler");
const bodyparser = require("body-parser");

const app = express();
connectDb();

// Set up session middleware
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "development" ? true : false,
      httpOnly: process.env.NODE_ENV === "development" ? true : false,
      sameSite: process.env.NODE_ENV === "development" ? true : "none",
    },
  })
);

// Initialize Passport and restore authentication state from session
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");

app.use("/api/v1", UserRoutes);
app.use("/api/v1", PhotoRoutes);
app.use("/api/v1", CategoryRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      massage: "Logout Success",
    });
  });
});

app.use(handleError);
module.exports = app;
