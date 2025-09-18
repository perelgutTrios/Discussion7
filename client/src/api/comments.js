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
