const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // Make sure path is correct

// Route for feed
router.get('/feed', async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.render('feed', { posts, user: req.user });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;
