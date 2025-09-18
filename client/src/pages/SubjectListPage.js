
// SubjectListPage displays all discussion subjects and navigation options
import React, { useEffect, useState } from 'react';
import { getSubjects } from '../api/subjects';
import { Link, useNavigate } from 'react-router-dom';

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
        {subjects.map(subj => (
          <li key={subj._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/subject/${subj._id}`}>{subj.title}</Link>
              <div className="small text-muted">
                By {subj.creator?.displayName || subj.creator?.username || 'Unknown'}
                {' | '}
                {new Date(subj.createdAt).toLocaleString()}
              </div>
            </div>
            <span className="badge bg-primary rounded-pill">{subj.commentCount || 0} comment{subj.commentCount === 1 ? '' : 's'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubjectListPage;
