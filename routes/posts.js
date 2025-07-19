const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/post');

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Show create post form
router.get('/create', isLoggedIn, (req, res) => {
  res.render('create-post', { user: req.user, messages: req.flash() });
});

// Handle post creation
router.post('/create', isLoggedIn, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error', 'Please select an image to upload');
      return res.redirect('/posts/create');
    }

    const { postText } = req.body;
    
    if (!postText || postText.trim().length === 0) {
      req.flash('error', 'Please add a description for your post');
      return res.redirect('/posts/create');
    }

    const newPost = new Post({
      postText: postText.trim(),
      imageUrl: '/uploads/' + req.file.filename,
      user: req.user._id
    });

    await newPost.save();
    req.flash('success', 'Post created successfully!');
    res.redirect('/feed');
  } catch (error) {
    console.error('Error creating post:', error);
    req.flash('error', 'Error creating post. Please try again.');
    res.redirect('/posts/create');
  }
});

// Like/unlike a post
router.post('/like/:postId', isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a post (only by the post owner)
router.delete('/delete/:postId', isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 