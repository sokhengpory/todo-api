const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');

const router = express.Router();

// Get tasks
router.get('/', auth, async (req, res) => {
  const { _id: userId } = req.user;

  try {
    const tasks = await Task.find({ owner: userId }, { __v: 0 });

    if (!tasks.length) {
      return res.status(404).send({ message: 'Task not found.' });
    }

    res.status(200).send({
      message: 'success',
      total: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

// Get specific task
router.get('/:id', auth, async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  try {
    const task = await Task.findOne({ _id, owner }, { __v: 0 });

    if (!task) {
      return res.status(404).send({
        message: 'Task not found.',
      });
    }

    res.status(200).send({
      task,
    });
  } catch (error) {
    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  const { description, completed } = req.body;
  const { _id: owner } = req.user;

  try {
    const task = new Task({
      description,
      completed,
      owner,
    });

    await task.save();

    res.status(201).send({
      message: 'success',
      task,
    });
  } catch (error) {
    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

// Update task
router.patch('/:id', auth, async (req, res) => {
  const { id: _id } = req.params;
  const updateBodyKey = Object.keys(req.body);
  const validUpdate = ['description', 'completed'];

  const isValid = updateBodyKey.every((el) => validUpdate.includes(el));

  if (!isValid) {
    return res.status(400).send({
      message: 'Invalid Update',
    });
  }

  try {
    const updatedTask = await Task.findOneAndUpdate({ _id }, req.body, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).send({ message: 'Task not found.' });
    }

    res.status(200).send({
      message: 'success',
      data: updatedTask,
    });
  } catch (error) {
    res.status(404).send({
      message: 'fail',
      error,
    });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  const { id: _id } = req.params;

  try {
    const task = await Task.findOneAndDelete({
      _id,
    });

    if (!task) {
      return res.status(404).send({ message: 'Task not found.' });
    }

    res.status(200).send({
      message: 'success',
    });
  } catch (error) {
    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

module.exports = router;
