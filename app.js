const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const cors = require("cors");

const { SESSION_SECRET } = process.env;

const passport = require("./feature/iam/service/passport");

const authRouter = require("./feature/iam/controller/router");
const categoriesRouter = require("./feature/categories/controller/router");

const app = express();

app.use(logger("dev"));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/api/categories", categoriesRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
