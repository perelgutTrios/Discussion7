
// SubjectDetailPage displays a single subject, its comments, and allows adding comments
import React, { useEffect, useState } from 'react';
import { getComments, createComment, likeComment } from '../api/comments';
import { getSubjects, likeSubject } from '../api/subjects';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

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

  // Like/dislike logic for subject
  const handleSubjectLikeDislike = async (action) => {
    if (!token) {
      setMessage('You must be logged in to like or dislike.');
      return;
    }
    const userId = JSON.parse(atob(token?.split('.')[1] || 'e30='))?.userId;
    const likesArr = subject.likes || [];
    const dislikesArr = subject.dislikes || [];
    const userLiked = likesArr.includes(userId);
    const userDisliked = dislikesArr.includes(userId);
    let newAction = action;
    if ((action === 'like' && userLiked) || (action === 'dislike' && userDisliked)) {
      newAction = null;
    }
    const res = await likeSubject(subject._id, newAction, token);
    if (res.likes !== undefined && res.dislikes !== undefined) {
      setSubject(s => ({ ...s, likes: Array(res.likes).fill(userId).slice(0, res.likes), dislikes: Array(res.dislikes).fill(userId).slice(0, res.dislikes) }));
      setRefresh(r => !r);
    }
  };

  // Like/dislike logic for comments
  const handleCommentLikeDislike = async (comment, action) => {
    if (!token) {
      setMessage('You must be logged in to like or dislike.');
      return;
    }
    const userId = JSON.parse(atob(token?.split('.')[1] || 'e30='))?.userId;
    const likesArr = comment.likes || [];
    const dislikesArr = comment.dislikes || [];
    const userLiked = likesArr.includes(userId);
    const userDisliked = dislikesArr.includes(userId);
    let newAction = action;
    if ((action === 'like' && userLiked) || (action === 'dislike' && userDisliked)) {
      newAction = null;
    }
    const res = await likeComment(comment._id, newAction, token);
    if (Array.isArray(res.likes) && Array.isArray(res.dislikes)) {
      setComments(comments => comments.map(c =>
        c._id === comment._id
          ? { ...c, likes: res.likes, dislikes: res.dislikes }
          : c
      ));
    }
  };

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

  // Like/dislike state for subject
  const userId = JSON.parse(atob(token?.split('.')[1] || 'e30='))?.userId;
  const likesArr = subject.likes || [];
  const dislikesArr = subject.dislikes || [];
  const userLiked = likesArr.includes(userId);
  const userDisliked = dislikesArr.includes(userId);
  const count = (likesArr.length || 0) - (dislikesArr.length || 0);

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
      {/* Like/dislike controls for subject */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <button
          className={`btn btn-sm border-success ${userLiked ? 'bg-success text-white' : 'bg-white text-success'}`}
          style={{ borderWidth: 2 }}
          onClick={() => handleSubjectLikeDislike('like')}
          aria-label="Like"
        >
          <i className={`bi bi-arrow-up${userLiked ? '-square-fill' : '-square'}`}></i>
        </button>
        <span className="fw-bold" style={{ minWidth: 24, textAlign: 'center' }}>{count}</span>
        <button
          className={`btn btn-sm border-danger ${userDisliked ? 'bg-danger text-white' : 'bg-white text-danger'}`}
          style={{ borderWidth: 2 }}
          onClick={() => handleSubjectLikeDislike('dislike')}
          aria-label="Dislike"
        >
          <i className={`bi bi-arrow-down${userDisliked ? '-square-fill' : '-square'}`}></i>
        </button>
      </div>
      <div className="mb-4">
        <h4>Comments</h4>
        {/* List all comments for this subject */}
        <ul className="list-group mb-3">
          {comments.map(c => {
            const cLikes = c.likes || [];
            const cDislikes = c.dislikes || [];
            const cUserLiked = cLikes.includes(userId);
            const cUserDisliked = cDislikes.includes(userId);
            const cCount = (cLikes.length || 0) - (cDislikes.length || 0);
            return (
              <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{c.author?.displayName || c.author?.username || 'Unknown'}:</strong> {c.content}
                  <span className="text-muted float-end" style={{ fontSize: '0.9em' }}>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className={`btn btn-sm border-success ${cUserLiked ? 'bg-success text-white' : 'bg-white text-success'}`}
                    style={{ borderWidth: 2 }}
                    onClick={() => handleCommentLikeDislike(c, 'like')}
                    aria-label="Like"
                  >
                    <i className={`bi bi-arrow-up${cUserLiked ? '-square-fill' : '-square'}`}></i>
                  </button>
                  <span className="fw-bold" style={{ minWidth: 24, textAlign: 'center' }}>{cCount}</span>
                  <button
                    className={`btn btn-sm border-danger ${cUserDisliked ? 'bg-danger text-white' : 'bg-white text-danger'}`}
                    style={{ borderWidth: 2 }}
                    onClick={() => handleCommentLikeDislike(c, 'dislike')}
                    aria-label="Dislike"
                  >
                    <i className={`bi bi-arrow-down${cUserDisliked ? '-square-fill' : '-square'}`}></i>
                  </button>
                </div>
              </li>
            );
          })}
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
