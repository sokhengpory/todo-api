const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { _id: userId } = req.user;

  try {
    const tasks = await Task.find({ owner: userId }, { __v: 0 });

    if (!tasks.length) {
      return res.status(404).send({ message: 'Task not found.' });
    }

    res.status(200).send({
      message: 'success',
      tasks,
    });
  } catch (error) {
    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

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

router.patch('/:id', async (req, res) => {
  try {
    const updateTask = await Task.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    res.status(200).send({
      message: 'success',
      data: updateTask,
    });
  } catch (error) {
    res.status(404).send({
      message: 'fail',
      error,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
    });

    res.status(200).send({
      message: 'success',
    });
  } catch (error) {
    res.status(404).send({
      message: 'fail',
      error,
    });
  }
});

module.exports = router;
