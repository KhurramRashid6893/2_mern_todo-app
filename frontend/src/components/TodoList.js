import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';
import '../css/todolist.css';

const TodoList = ({ userId }) => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const PAGE_SIZE = 5;

  const fetchTodos = useCallback(async (reset = false) => {
    if (!userId) return;

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please log in again.');
        return;
      }

      const res = await axios.get('http://localhost:5000/api/todos', {
        headers: { 'x-auth-token': token }
      });

      let data = res.data;

      // Apply filter
      data = data.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      });

      // Apply search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        data = data.filter(todo =>
          todo.title.toLowerCase().includes(term) ||
          (todo.description && todo.description.toLowerCase().includes(term))
        );
      }

      // Apply sort
      data = data.sort((a, b) => {
        if (sortBy === 'createdAt') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'dueDate') {
          return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        } else if (sortBy === 'priority') {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
      });

      const end = reset ? PAGE_SIZE : PAGE_SIZE * page;
      setTodos(data.slice(0, end));
      setHasMore(end < data.length);

    } catch (err) {
      console.error('Error fetching todos:', err.response || err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load tasks. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [userId, filter, sortBy, searchTerm, page]);

  useEffect(() => {
    if (userId) {
      fetchTodos(true);
    } else {
      setTodos([]);
      setError('Session expired. Please log in again.');
    }
  }, [fetchTodos, userId]);

  useEffect(() => {
    if (page > 1 && userId) {
      fetchTodos();
    }
  }, [page, fetchTodos, userId]);

  const loadMore = () => setPage(prev => prev + 1);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="todo-list-container">
      <AddTodoForm onAdd={() => fetchTodos(true)} />

      <div className="todo-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filter-sort-container">
          <div className="filter-buttons">
            <button
              onClick={() => { setPage(1); setFilter('all'); }}
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => { setPage(1); setFilter('active'); }}
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            >
              Active
            </button>
            <button
              onClick={() => { setPage(1); setFilter('completed'); }}
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            >
              Completed
            </button>
          </div>

          <div className="sort-container">
            <span className="sort-label">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => { setPage(1); setSortBy(e.target.value); }}
              className="sort-select"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && todos.length === 0 && userId && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tasks found</h3>
          <p>Try changing your filters or create a new task!</p>
        </div>
      )}

      <div className="todos-grid">
        {todos.map(todo => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onUpdate={() => fetchTodos(true)}
          />
        ))}
      </div>

      {!loading && hasMore && userId && (
        <div className="load-more-container">
          <button
            onClick={loadMore}
            className="load-more-btn"
          >
            Load More Tasks ➕
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoList;
