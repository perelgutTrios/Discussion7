
// API functions for subject CRUD operations
const API_BASE = '/api';


/**
 * Fetch all discussion subjects
 * @returns {Promise<Array>} List of subjects
 */
export async function getSubjects() {
  const res = await fetch(`${API_BASE}/subjects`);
  return res.json();
}


/**
 * Create a new subject
 * @param {string} title
 * @param {string} description
 * @param {string} token - JWT for authentication
 * @returns {Promise<object>} API response
 */
export async function createSubject(title, description, token) {
  const res = await fetch(`${API_BASE}/subjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, description })
  });
  return res.json();
}
