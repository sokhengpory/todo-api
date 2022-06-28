const express = require('express');
const Task = require('../models/task');

const router = express.Router();

router.get('/', (req, res) => {
  try {
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

router.post('/', (req, res) => {
  try {
    res.status(201).send({
      message: 'success',
    });
  } catch (error) {
    res.status(400).send({
      message: 'fail',
      error,
    });
  }
});

router.patch('/:id', (req, res) => {
  try {
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

router.delete('/:id', (req, res) => {
  try {
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
