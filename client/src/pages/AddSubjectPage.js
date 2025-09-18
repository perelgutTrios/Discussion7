
// AddSubjectPage provides a form to create a new discussion subject
import React, { useState } from 'react';

/**
 * AddSubjectPage component
 * @param {function} onPost - callback to create subject
 * @param {function} onCancel - callback to return to subject list
 * @param {string} error - error message from parent
 */
function AddSubjectPage({ onPost, onCancel, error }) {
  // State for form fields and messages
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  /**
   * Handles form submission for new subject
   * Validates title and description, then calls onPost
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || title.length > 100) {
      setMessage('Title is required and must be under 100 characters.');
      return;
    }
    if (!description || description.length > 1000) {
      setMessage('Description is required and must be under 1000 characters.');
      return;
    }
    setMessage('');
    onPost(title, description);
  };

  // Render add subject form and messages
  return (
    <div>
      <div className="page-header">Add New Subject</div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} maxLength={1000} required rows={4} />
        </div>
        {/* Show validation or error message */}
        {(message || error) && <div className="alert alert-danger">{message || error}</div>}
        {/* Post and Cancel buttons */}
        <button className="btn btn-add me-2" type="submit">Post Subject</button>
        <button className="btn btn-cancel" type="button" onClick={onCancel}>Return to List</button>
      </form>
    </div>
  );
}

export default AddSubjectPage;
