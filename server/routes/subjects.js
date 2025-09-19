
// Routes for creating and listing discussion subjects
const express = require('express');
const Subject = require('../models/Subject');
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
 * Create a new subject
 * Requires authentication
 * Validates title and description
 */
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  if (!title || title.length > 100) {
    return res.status(400).json({ message: 'Title is required and must be under 100 characters.' });
  }
  if (!description || description.length > 1000) {
    return res.status(400).json({ message: 'Description is required and must be under 1000 characters.' });
  }
  try {
    // Save new subject with creator info
    const subject = new Subject({ title, description, creator: req.user.userId });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get all subjects
 * Populates creator info and comment counts for each subject
 */
router.get('/', async (req, res) => {
  try {
    // Find all subjects, newest first
    const subjects = await Subject.find()
      .populate('creator', 'username displayName')
      .sort({ createdAt: -1 });

    // Get comment counts for each subject
    const Comment = require('../models/Comment');
    const subjectIds = subjects.map(s => s._id);
    const counts = await Comment.aggregate([
      { $match: { subject: { $in: subjectIds } } },
      { $group: { _id: '$subject', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[c._id.toString()] = c.count; });

    // Attach comment count to each subject
    const subjectsWithCount = subjects.map(s => ({
      ...s.toObject(),
      commentCount: countMap[s._id.toString()] || 0
    }));
    res.json(subjectsWithCount);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * Like or dislike a subject
 * POST /api/subjects/:id/like { action: 'like' | 'dislike' }
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
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    // Remove user from both arrays first
    subject.likes = subject.likes.filter(id => id.toString() !== userId);
    subject.dislikes = subject.dislikes.filter(id => id.toString() !== userId);
    if (action === 'like') {
      subject.likes.push(userId);
    } else if (action === 'dislike') {
      subject.dislikes.push(userId);
    }
    // If action is null or 'null', just remove from both (already done above)
    await subject.save();
    res.json({ likes: subject.likes, dislikes: subject.dislikes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
