// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toLocaleDateString(); // e.g., "7/15/2025"
    }
  },
  time: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toLocaleTimeString(); // e.g., "4:30:45 PM"
    }
  },
  likes: {
    type: Array,
    default: []
  }
}, {
  timestamps: true // Also adds createdAt and updatedAt
});

module.exports= mongoose.model('Post', postSchema);


