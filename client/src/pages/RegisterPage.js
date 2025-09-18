
// RegisterPage handles user registration, validation, and navigation to login
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';


/**
 * RegisterPage component
 * Handles registration form, validation, and redirects to login on success
 */
function RegisterPage() {
  // State for form fields and messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Validation helpers for each field
  const validateEmail = email => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const validatePassword = pw => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
  const validatePhone = phone => /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);

  /**
   * Handles registration form submission
   * Validates all fields, calls backend API, and redirects on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate email
    if (!validateEmail(username)) {
      setMessage('Please enter a valid email address.');
      return;
    }
    // Validate password
    if (!validatePassword(password)) {
      setMessage('Password must be at least 8 characters, include uppercase, lowercase, and a digit.');
      return;
    }
    // Validate display name
    if (!displayName || displayName.length < 2) {
      setMessage('Display name is required.');
      return;
    }
    // Validate phone number
    if (!validatePhone(phone)) {
      setMessage('Phone number must be in the format (###) ###-####');
      return;
    }
    // Call backend API
    const res = await register(username, password, displayName, phone);
    if (res.message === 'User registered successfully') {
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } else {
      setMessage(res.message || 'Registration failed.');
    }
  };

  // Render registration form and messages
  return (
    <div>
      <div className="page-header">Register</div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email (UserID)</label>
          <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required type="email" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          <div className="form-text">At least 8 characters, 1 uppercase, 1 lowercase, 1 digit</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Display Name</label>
          <input className="form-control" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="(###) ###-####" />
        </div>
        {/* Register button */}
        <button className="btn btn-add" type="submit">Register</button>
      </form>
      {/* Show registration or error message */}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default RegisterPage;
