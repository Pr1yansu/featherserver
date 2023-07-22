const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDb = require("./Config/db");
const UserRoutes = require("./Routes/UserRoute");
const PhotoRoutes = require("./Routes/PhotoRoute");
const CategoryRoutes = require("./Routes/CategoryRoute");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./Config/passport");
const { handleError } = require("./Utils/errohandler");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
connectDb();

app.use(cookieParser());

// Set up session middleware
app.use(
  session({
    secret: "your_session_secret_here",
    resave: false,
    saveUninitialized: false,
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
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());
app.enable("trust proxy");

app.use("/api/v1", UserRoutes);
app.use("/api/v1", PhotoRoutes);
app.use("/api/v1", CategoryRoutes);

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

app.get("/", (req, res) => {
  res.send("Hello Server is live");
});

app.use(handleError);
module.exports = app;
