const express = require("express");
const router = express.Router();
const Post = require("../models/post");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pinterest Clone' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
  
});


router.get("/profile", isLoggedIn, async (req, res) => {
  try {
    // Fetch user's posts
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.render('profile', { 
      user: req.user, 
      posts: posts 
    });
  } catch (error) {
    console.error('Error loading profile:', error);
    res.status(500).send('Error loading profile');
  }
});

router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
