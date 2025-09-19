
// Comment model for subject comments
const mongoose = require('mongoose');

/**
 * Comment schema
 * - content: comment text
 * - author: reference to User who wrote the comment
 * - subject: reference to Subject being commented on
 * - createdAt: timestamp
 */

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who disliked
});

module.exports = mongoose.model('Comment', commentSchema);
