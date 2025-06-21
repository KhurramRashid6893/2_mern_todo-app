import React, { useState } from 'react';
import axios from 'axios';
import '../css/addTodoForm.css';

const AddTodoForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!title.trim()) {
      alert('Title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Your session has expired. Please log in again.');
        return;
      }

      await axios.post('http://localhost:5000/api/todos', {
        title,
        description,
        priority,
        dueDate
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      onAdd();  // Trigger re-fetch
    } catch (err) {
      console.error('Error adding todo:', err.response || err);
      alert(err.response?.data?.msg || 'Failed to add task. Please try again.');
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
    <div className="add-todo-card">
      <div className="form-header">
        <h2>Add New Task ✨</h2>
        <p>Organize your work and life</p>
      </div>

      <form onSubmit={handleSubmit} className="add-todo-form">
        <div className="form-group">
          <label htmlFor="title">
            <span className="label-icon">📝</span> Task Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            <span className="label-icon">📄</span> Description (Optional)
          </label>
          <textarea
            id="description"
            placeholder="Add details..."
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

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="spinner"></span>
          ) : (
            <>
              <span className="btn-icon">➕</span> Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTodoForm;
