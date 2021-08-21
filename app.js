const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const categoriesRouter = require("./routes/categories");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/categories", categoriesRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
