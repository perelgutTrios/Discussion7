
// Subject model for discussion board topics
const mongoose = require('mongoose');

/**
 * Subject schema
 * - title: subject title (max 100 chars)
 * - description: subject description (max 1000 chars)
 * - creator: reference to User who created the subject
 * - createdAt: timestamp
 */

const subjectSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who disliked
});

module.exports = mongoose.model('Subject', subjectSchema);
