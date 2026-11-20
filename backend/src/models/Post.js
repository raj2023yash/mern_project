const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    content: {
      type: String,
      required: [true, 'Post content is required']
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      default: 'Anonymous',
      trim: true
    },
    category: {
      type: String,
      default: 'Technology',
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80'
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);
