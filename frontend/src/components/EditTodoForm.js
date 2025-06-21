import React, { useState } from 'react';
import '../css/editTodoForm.css';
import apiClient from '../api';  // ✅ Use apiClient instead of direct axios

const EditTodoForm = ({ todo, onUpdate, onCancel }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState(todo.priority || 'medium');
  const [dueDate, setDueDate] = useState(todo.dueDate ? todo.dueDate.slice(0, 10) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Session expired. Please log in again.');
        return;
      }

      // ✅ Use apiClient so no hardcoded URL
      await apiClient.put(`/api/todos/${todo._id}`, {
        title,
        description,
        priority,
        dueDate
      }, {
        headers: { 'x-auth-token': token }
      });

      onUpdate();
      onCancel();
    } catch (err) {
      console.error('Error updating todo:', err.response || err);
      alert(err.response?.data?.msg || 'Failed to update task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'high', label: '🚨 High Priority', color: '#ff6b6b' },
    { value: 'medium', label: '⚠️ Medium Priority', color: '#4ecdc4' },
    { value: 'low', label: '🔽 Low Priority', color: '#ffd166' }
  ];

  return (
    <div className="edit-todo-card">
      <div className="form-header">
        <h2>Edit Task ✏️</h2>
        <p>Update your task details</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-todo-form">
        <div className="form-group">
          <label htmlFor="title">
            <span className="label-icon">📝</span> Task Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            <span className="label-icon">📄</span> Description
          </label>
          <textarea
            id="description"
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">
              <span className="label-icon">🚩</span> Priority
            </label>
            <div className="priority-options">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`priority-option ${priority === option.value ? 'active' : ''}`}
                  style={priority === option.value ? { backgroundColor: option.color } : {}}
                  onClick={() => setPriority(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">
              <span className="label-icon">📅</span> Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span className="btn-icon">💾</span> Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <span className="btn-icon">↩️</span> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTodoForm;
