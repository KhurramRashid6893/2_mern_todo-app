import React, { useState } from 'react';
import axios from 'axios';
import '../css/todoItem.css';
import EditTodoForm from './EditTodoForm';

const TodoItem = ({ todo, onUpdate, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debug to check ID values
  console.log('DEBUG -> todo.user:', todo.user, 'currentUserId:', currentUserId);

  // Ensure both IDs are strings for comparison
  const showActions = todo.user?.toString() === currentUserId?.toString();

  const toggleComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/todos/${todo._id}`, {
        completed: !todo.completed
      }, {
        headers: { 'x-auth-token': token }
      });
      onUpdate();
    } catch (err) {
      console.error('Error updating todo:', err.response || err);
      alert(err.response?.data?.msg || 'Failed to update task');
    }
  };

  const deleteTodo = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/todos/${todo._id}`, {
        headers: { 'x-auth-token': token }
      });
      onUpdate();
    } catch (err) {
      console.error('Error deleting todo:', err.response || err);
      alert(err.response?.data?.msg || 'Failed to delete task');
      setIsDeleting(false);
    }
  };

  const priorityColors = {
    high: '#ff6b6b',
    medium: '#4ecdc4',
    low: '#ffd166'
  };

  const priorityIcons = {
    high: '🚨',
    medium: '⚠️',
    low: '🔽'
  };

  if (isEditing) {
    return (
      <EditTodoForm
        todo={todo}
        onUpdate={() => {
          onUpdate();
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className={`todo-item ${isDeleting ? 'deleting' : ''}`} data-priority={todo.priority}>
      <div className="todo-content">
        <div className="todo-header">
          <div
            className="priority-indicator"
            style={{ backgroundColor: priorityColors[todo.priority] }}
          >
            {priorityIcons[todo.priority]} {todo.priority}
          </div>
          <h2 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
            {todo.completed ? '✅ ' : '📌 '}{todo.title}
          </h2>
        </div>

        {todo.description && (
          <div className="todo-description">
            <span className="description-icon">📝</span>
            {todo.description}
          </div>
        )}

        <div className="todo-meta">
          {todo.dueDate && (
            <div className="due-date">
              <span className="meta-icon">📅</span>
              Due: {new Date(todo.dueDate).toLocaleDateString()}
            </div>
          )}
          <div className="created-date">
            <span className="meta-icon">⏱️</span>
            Created: {new Date(todo.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* TEMP: Always show actions for testing */}
      <div className="todo-actions">
        <button onClick={toggleComplete} className="action-btn complete-btn">
          {todo.completed ? '↩️ Undo' : '✔️ Complete'}
        </button>
        <button onClick={() => setIsEditing(true)} className="action-btn edit-btn">
          ✏️ Edit
        </button>
        <button onClick={deleteTodo} className="action-btn delete-btn">
          {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete'}
        </button>
      </div>

      {/* 👉 Once debugged, switch back to:
      {showActions && (
        <div className="todo-actions"> ... </div>
      )} 
      */}
    </div>
  );
};

export default TodoItem;
