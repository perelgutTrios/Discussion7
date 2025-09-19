
// Routes for creating and listing comments on subjects
const express = require('express');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * Middleware to verify JWT authentication
 * Adds decoded user info to req.user
 */
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

/**
 * Create a new comment on a subject
 * Requires authentication
 */
router.post('/', auth, async (req, res) => {
  const { content, subject } = req.body;
  try {
    // Save new comment with author and subject info
    const comment = new Comment({ content, subject, author: req.user.userId });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get all comments for a specific subject
 * Populates author info for each comment
 */
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const comments = await Comment.find({ subject: req.params.subjectId })
      .populate('author', 'username displayName')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * Like or dislike a comment
 * POST /api/comments/:id/like { action: 'like' | 'dislike' }
 * Requires authentication
 */
router.post('/:id/like', auth, async (req, res) => {
  const { action } = req.body; // 'like', 'dislike', null, or 'null'
  const userId = req.user.userId;
  console.log('Like/dislike action received:', action, typeof action);
  // Accept 'like', 'dislike', null, or 'null' (string)
  if (action !== 'like' && action !== 'dislike' && action !== null && action !== 'null') {
    return res.status(400).json({ message: 'Invalid action' });
  }
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    // Remove user from both arrays first
    comment.likes = comment.likes.filter(id => id.toString() !== userId);
    comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId);
    if (action === 'like') {
      comment.likes.push(userId);
    } else if (action === 'dislike') {
      comment.dislikes.push(userId);
    }
    // If action is null or 'null', just remove from both (already done above)
    await comment.save();
    res.json({ likes: comment.likes, dislikes: comment.dislikes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
