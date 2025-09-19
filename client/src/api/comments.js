
/**
 * Like or dislike a comment
 * @param {string} commentId
 * @param {'like'|'dislike'|null} action - 'like', 'dislike', or null to remove
 * @param {string} token - JWT for authentication
 * @returns {Promise<object>} API response with new counts
 */
export async function likeComment(commentId, action, token) {
  // Always send an explicit action key, even if null
  const payload = { action: action === undefined ? null : action };
  const res = await fetch(`${API_BASE}/comments/${commentId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return res.json();
}
const API_BASE = '/api';

export async function getComments(subjectId) {
  const res = await fetch(`${API_BASE}/comments/subject/${subjectId}`);
  return res.json();
}

export async function createComment(content, subjectId, token) {
  const res = await fetch(`${API_BASE}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content, subject: subjectId })
  });
  return res.json();
}
