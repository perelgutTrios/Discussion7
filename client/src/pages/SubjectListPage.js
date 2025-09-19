
// SubjectListPage displays all discussion subjects and navigation options
import React, { useEffect, useState } from 'react';
import { getSubjects } from '../api/subjects';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './SubjectListPage.css'; // For any custom styles
import { likeSubject } from '../api/subjects';

/**
 * SubjectListPage component
 * Shows all subjects, allows navigation to add subject or logout
 */
function SubjectListPage() {
  // State for subjects, messages, and navigation
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [refresh, setRefresh] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch subjects from backend on mount or refresh
  useEffect(() => {
    getSubjects().then(setSubjects);
  }, [refresh]);

  // No inline create; use Add Subject page for subject creation

  /**
   * Handles logout: clears token and navigates to login page
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Like/dislike button handler
  const handleLikeDislike = async (subjectId, action, userLiked, userDisliked) => {
    if (!token) {
      setMessage('You must be logged in to like or dislike.');
      return;
    }
    // Toggle logic: if already liked/disliked, remove; else set
    let newAction = action;
    if ((action === 'like' && userLiked) || (action === 'dislike' && userDisliked)) {
      newAction = null; // Remove like/dislike
    }
    // Only send 'like', 'dislike', or null
    if (newAction !== 'like' && newAction !== 'dislike' && newAction !== null) {
      return;
    }
    const res = await likeSubject(subjectId, newAction, token);
    if (Array.isArray(res.likes) && Array.isArray(res.dislikes)) {
      setSubjects(subjects => subjects.map(s =>
        s._id === subjectId
          ? { ...s, likes: res.likes, dislikes: res.dislikes }
          : s
      ));
    }
  };

  // Render subject list, add subject, and logout options
  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <span>List Subjects</span>
        {token && (
          <button className="btn btn-cancel" onClick={handleLogout}>Logout</button>
        )}
      </div>
      {/* Add subject button for authenticated users */}
      {token && (
        <div className="mb-4">
          <button className="btn btn-add" onClick={() => navigate('/add-subject')}>Add New Subject</button>
        </div>
      )}
      {/* Show info or error message */}
      {message && <div className="alert alert-info">{message}</div>}
      {/* List all subjects with comment counts and creator info */}
      <ul className="list-group">
        {subjects.map(subj => {
          // Like/dislike state for current user
          const userId = JSON.parse(atob(token?.split('.')[1] || 'e30='))?.userId;
          const likesArr = Array.isArray(subj.likes) ? subj.likes : [];
          const dislikesArr = Array.isArray(subj.dislikes) ? subj.dislikes : [];
          const userLiked = likesArr.includes(userId);
          const userDisliked = dislikesArr.includes(userId);
          const count = (likesArr.length || 0) - (dislikesArr.length || 0);
          return (
            <li key={subj._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <Link to={`/subject/${subj._id}`}>{subj.title}</Link>
                <div className="small text-muted">
                  By {subj.creator?.displayName || subj.creator?.username || 'Unknown'}
                  {' | '}
                  {new Date(subj.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                {/* Like button */}
                <button
                  className={`btn btn-sm border-success ${userLiked ? 'bg-success text-white' : 'bg-white text-success'}`}
                  style={{ borderWidth: 2 }}
                  onClick={() => handleLikeDislike(subj._id, 'like', userLiked, userDisliked)}
                  aria-label="Like"
                >
                  <i className={`bi bi-arrow-up${userLiked ? '-square-fill' : '-square'}`}></i>
                </button>
                {/* Count */}
                <span className="fw-bold" style={{ minWidth: 24, textAlign: 'center' }}>{count}</span>
                {/* Dislike button */}
                <button
                  className={`btn btn-sm border-danger ${userDisliked ? 'bg-danger text-white' : 'bg-white text-danger'}`}
                  style={{ borderWidth: 2 }}
                  onClick={() => handleLikeDislike(subj._id, 'dislike', userLiked, userDisliked)}
                  aria-label="Dislike"
                >
                  <i className={`bi bi-arrow-down${userDisliked ? '-square-fill' : '-square'}`}></i>
                </button>
                {/* Comment count */}
                <span className="badge bg-primary rounded-pill ms-2">{subj.commentCount || 0} comment{subj.commentCount === 1 ? '' : 's'}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SubjectListPage;
