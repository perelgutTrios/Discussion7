
// SubjectDetailPage displays a single subject, its comments, and allows adding comments
import React, { useEffect, useState } from 'react';
import { getComments, createComment } from '../api/comments';
import { getSubjects } from '../api/subjects';
import { useNavigate } from 'react-router-dom';

/**
 * SubjectDetailPage component
 * @param {string} subjectId - ID of the subject to display
 * Shows subject details, comments, and allows posting new comments
 */
function SubjectDetailPage({ subjectId }) {
  // State for subject, comments, form fields, and messages
  const [subject, setSubject] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [refresh, setRefresh] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch subject details and comments on mount or refresh
  useEffect(() => {
    getSubjects().then(subjects => {
      const subj = subjects.find(s => s._id === subjectId);
      setSubject(subj);
    });
    getComments(subjectId).then(setComments);
  }, [subjectId, refresh]);

  /**
   * Handles posting a new comment
   * Validates input and calls backend API
   */
  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('You must be logged in to comment.');
      return;
    }
    if (!content.trim()) {
      setMessage('Comment cannot be empty.');
      return;
    }
    const res = await createComment(content, subjectId, token);
    if (res._id) {
      setContent('');
      setMessage('Comment posted!');
      setRefresh(r => !r);
    } else {
      setMessage(res.message || 'Error posting comment');
    }
  };

  // Show loading state if subject is not loaded
  if (!subject) return <div>Loading...</div>;

  // Render subject details, comments, and comment form
  return (
    <div>
      <div className="page-header">Display Subject</div>
      <h2>{subject.title}</h2>
      <h5 className="text-muted mb-2">
        By {subject.creator?.displayName || subject.creator?.username || 'Unknown'}
        {' | '}
        {new Date(subject.createdAt).toLocaleString()}
      </h5>
      <div className="mb-3">
        <strong>Description:</strong>
        <div className="mb-2">{subject.description || <span className="text-muted">No description</span>}</div>
      </div>
      <div className="mb-4">
        <h4>Comments</h4>
        {/* List all comments for this subject */}
        <ul className="list-group mb-3">
          {comments.map(c => (
            <li key={c._id} className="list-group-item">
              <strong>{c.author?.displayName || c.author?.username || 'Unknown'}:</strong> {c.content}
              <span className="text-muted float-end" style={{ fontSize: '0.9em' }}>{new Date(c.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        {/* Comment form */}
        <form className="mb-2" onSubmit={handleComment}>
          <label className="form-label">Comment</label>
          <div className="input-group">
            <input className="form-control" value={content} onChange={e => setContent(e.target.value)} placeholder="Add a comment..." required />
            <button className="btn btn-add" type="submit">Post</button>
            <button className="btn btn-cancel" type="button" onClick={() => navigate('/')}>Return to List</button>
          </div>
        </form>
        {/* Show info or error message */}
        {message && <div className="alert alert-info mt-2">{message}</div>}
      </div>
    </div>
  );
}

export default SubjectDetailPage;
