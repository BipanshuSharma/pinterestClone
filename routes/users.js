const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");

const router = express.Router();

// passport setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// register route
router.post("/register", (req, res) => {
  const { username, password, email, fullName } = req.body;

  const newUser = new User({ username, email, fullName });

  User.register(newUser, password, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

// login route
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })
);


module.exports = router;
