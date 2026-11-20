const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost
} = require('../controllers/postController');

router.route('/')
  .get(getAllPosts)
  .post(createPost);

router.route('/:id')
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

router.route('/:id/like')
  .patch(likePost);

module.exports = router;
