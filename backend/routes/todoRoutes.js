const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

// GET all todos for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// POST create a new todo
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ msg: 'Title is required' });
    }

    const newTodo = new Todo({
      title,
      description,
      priority,
      dueDate,
      user: req.user
    });

    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    console.error('Error saving todo:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PUT update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    let todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ msg: 'Todo not found' });

    if (!todo.user.equals(req.user)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.priority = priority || todo.priority;
    todo.dueDate = dueDate || todo.dueDate;
    todo.completed = completed !== undefined ? completed : todo.completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE remove a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ msg: 'Todo not found' });

    if (!todo.user.equals(req.user)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await todo.remove();
    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
