const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find({});

    if (!users.length) {
      return res.status(404).send({
        message: 'There is no user.',
      });
    }

    res.status(200).send({
      message: 'success',
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.status(200).send({
      message: 'success',
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({
        message: 'Username already existed',
      });
    }

    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).send({
      message: 'success',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id });

    if (!deletedUser) {
      return res.status(404).send({
        message: 'User not found.',
      });
    }

    res.status(200).send({
      message: 'success',
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

module.exports = router;
