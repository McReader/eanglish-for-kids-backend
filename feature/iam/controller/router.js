const express = require("express");
const passport = require("../service/passport");

const router = express.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ id: req.user.id });
});

module.exports = router;
