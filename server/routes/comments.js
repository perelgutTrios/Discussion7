
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

module.exports = router;
