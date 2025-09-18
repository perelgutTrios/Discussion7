
// User model for authentication and profile info
const mongoose = require('mongoose');

/**
 * User schema
 * - username: email address (unique)
 * - password: hashed password
 * - displayName: user's display name
 * - phone: phone number in (###) ###-#### format
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // email
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    match: [/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone number must be in the format (###) ###-####']
  }
});

module.exports = mongoose.model('User', userSchema);
