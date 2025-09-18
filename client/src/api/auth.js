
// API functions for authentication (register and login)
const API_BASE = '/api';


/**
 * Register a new user
 * @param {string} username - email address
 * @param {string} password
 * @param {string} displayName
 * @param {string} phone - phone number in (###) ###-#### format
 * @returns {Promise<object>} API response
 */
export async function register(username, password, displayName, phone) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, displayName, phone })
  });
  return res.json();
}


/**
 * Log in a user
 * @param {string} username - email address
 * @param {string} password
 * @returns {Promise<object>} API response (with token on success)
 */
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}
