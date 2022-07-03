const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

// Sign Up
router.post('/', async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();

    res.status(201).send({
      user,
      token,
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

// Sign in
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findByCredential(name, password);
    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get user detail
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send({
      user,
    });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
});

// Update user detail
router.patch('/me', auth, async (req, res) => {
  try {
    const updateBody = Object.keys(req.body);
    const validUpdate = ['name'];

    const isValidUpdate = validUpdate.every((el) => updateBody.includes(el));

    if (!isValidUpdate) {
      return res.status(400).send({ message: 'Invalid update.' });
    }

    const { user } = req;
    const updateContent = req.body;

    updateBody.forEach((key) => {
      user[key] = updateContent[key];
    });

    await user.save();

    res.status(200).send({
      message: 'success',
      user,
    });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
});

// Delete user
router.delete('/me', auth, async (req, res) => {
  try {
    // await User.deleteOne({ _id: req.user._id });
    const { user } = req;
    await user.deleteOne();

    res.status(200).send({
      message: 'success',
      user,
    });
  } catch (error) {
    res.status(500).send({
      message: 'fail',
      error,
    });
  }
});

module.exports = router;
