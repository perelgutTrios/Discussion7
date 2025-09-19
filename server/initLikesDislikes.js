// Script to initialize likes/dislikes for all existing subjects and comments
const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const Comment = require('./models/Comment');
require('dotenv').config();

async function initLikesDislikes() {
  await mongoose.connect(process.env.MONGO_URI);
  // Update all subjects
  await Subject.updateMany(
    { likes: { $exists: false } },
    { $set: { likes: [], dislikes: [] } }
  );
  // Update all comments
  await Comment.updateMany(
    { likes: { $exists: false } },
    { $set: { likes: [], dislikes: [] } }
  );
  console.log('Initialized likes/dislikes for all subjects and comments.');
  await mongoose.disconnect();
}

initLikesDislikes();
