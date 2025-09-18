import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SubjectListPage from './pages/SubjectListPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import { createSubject } from './api/subjects';
import AddSubjectPage from './pages/AddSubjectPage';
import './App.css';

// Main application component for the Discussion Board
// Handles authentication, routing, and global navigation
function App() {
  // Track authentication state (true if token exists)
  const [isAuth, setIsAuth] = React.useState(!!localStorage.getItem('token'));

  // On the very first app load (per browser tab), clear any existing login token
  // This ensures the app always starts at the login page for a new session
  React.useEffect(() => {
    if (!sessionStorage.getItem('appLoaded')) {
      localStorage.removeItem('token');
      sessionStorage.clear();
      sessionStorage.setItem('appLoaded', 'true');
      setIsAuth(false); // force rerender to login page
    }
  }, []);

  // Logout handler: clears token, updates auth state, and redirects to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    window.location.href = '/login';
  };

  // Main app layout: navigation bar and route definitions
  return (
    <Router>
      {/* Navigation bar with app title and logout button (if logged in) */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand">Discussion Board</span>
          {isAuth && window.location.pathname !== '/login' && window.location.pathname !== '/register' && (
            <button className="btn btn-cancel ms-auto" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </nav>
      <div className="app-frame">
        {/* Define all app routes and enforce authentication where needed */}
        <Routes>
          {/* Login page: sets auth state on successful login */}
          <Route path="/login" element={<LoginPage onLogin={() => setIsAuth(true)} />} />
          {/* Registration page */}
          <Route path="/register" element={<RegisterPage />} />
          {/* Add subject page: requires authentication */}
          <Route path="/add-subject" element={isAuth ? <AddSubjectWrapper /> : <Navigate to="/login" />} />
          {/* Subject detail page: requires authentication */}
          <Route path="/subject/:subjectId" element={isAuth ? <SubjectDetailWrapper /> : <Navigate to="/login" />} />
          {/* Main subject list: requires authentication */}
          <Route path="/" element={isAuth ? <SubjectListPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}


// Wrapper for subject detail route: extracts subjectId from URL
function SubjectDetailWrapper() {
  const subjectId = window.location.pathname.split('/').pop();
  if (!subjectId) {
    return <Navigate to="/" />;
  }
  return <SubjectDetailPage subjectId={subjectId} />;
}

// Wrapper for add subject route: handles subject creation and error state
function AddSubjectWrapper() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  // Handles posting a new subject
  const handlePost = async (title, description) => {
    const token = localStorage.getItem('token');
    const res = await createSubject(title, description, token);
    if (res && res._id) {
      setError('');
      navigate('/');
    } else {
      setError(res.message || 'Error posting subject');
    }
  };
  return <AddSubjectPage onPost={handlePost} onCancel={() => navigate('/')} error={error} />;
}

export default App;
