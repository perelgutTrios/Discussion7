
// Authentication routes for registration and login
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/**
 * Register a new user
 * Validates email, password, displayName, and phone
 * Returns 201 on success, 400 on validation error, 500 on server error
 */
router.post('/register', async (req, res) => {
  const { username, password, displayName, phone } = req.body;
  // Validate email format
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(username)) {
    return res.status(400).json({ message: 'A valid email address is required as userid.' });
  }
  // Validate password strength
  const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!pwRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters, include uppercase, lowercase, and a digit.' });
  }
  // Validate displayName presence
  if (!displayName || displayName.length < 2) {
    return res.status(400).json({ message: 'Display name is required.' });
  }
  // Validate phone format
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be in the format (###) ###-####' });
  }
  try {
    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, displayName, phone });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Login route
 * Validates credentials and returns JWT token on success
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
