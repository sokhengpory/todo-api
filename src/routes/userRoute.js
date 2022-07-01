const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send({
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

// Sign Up
router.post('/', async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();

    res.status(200).send({
      message: 'success',
      data: {
        user,
        token,
      },
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
