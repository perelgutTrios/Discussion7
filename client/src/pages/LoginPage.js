
// LoginPage handles user authentication and navigation to registration
import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

/**
 * LoginPage component
 * @param {function} onLogin - callback to set auth state in parent on successful login
 */
function LoginPage({ onLogin }) {
  // State for form fields and messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  /**
   * Handles login form submission
   * Calls backend API and stores token on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    if (res.token) {
      localStorage.setItem('token', res.token); // Save JWT
      setMessage('Login successful!');
      if (onLogin) onLogin(); // Notify parent
      navigate('/'); // Go to subject list
    } else {
      setMessage(res.message || 'Login failed');
    }
  };

  // Render login form and navigation
  return (
    <div>
      <div className="page-header">Login</div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="d-flex gap-2">
          {/* Login and Register buttons */}
          <button className="btn btn-info" type="submit">Login</button>
          <button className="btn btn-add" type="button" onClick={() => navigate('/register')}>Register</button>
        </div>
      </form>
      {/* Show login or error message */}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default LoginPage;
