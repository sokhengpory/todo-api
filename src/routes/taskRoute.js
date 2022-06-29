const express = require('express');
const Task = require('../models/task');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({}, { __v: 0 });

    if (!tasks.length) {
      return res.status(404).send({ message: 'Task not found.' });
    }

    res.status(200).send({
      message: 'success',
      data: tasks,
    });
  } catch (error) {
    res.status(404).send({
      message: 'fail',
      error,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();

    res.status(201).send({
      message: 'success',
      data: task,
    });
  } catch (error) {
    res.status(400).send({
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
