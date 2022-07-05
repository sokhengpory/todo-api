const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

// Signup
router.post('/', async (req, res) => {
  // create user from User model
  const user = new User(req.body);

  try {
    // generate auth token
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

// Login
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    // find user with their name and password
    const user = await User.findByCredential(name, password);
    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
});

// Logout
router.get('/logout', auth, async (req, res) => {
  try {
    const { user } = req;
    // filter out the current token from the existing tokens array
    const newTokens = user.tokens.filter((el) => el.token !== req.token);

    // delete token property from request object
    delete req.token;

    user.tokens = newTokens;
    await user.save();

    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send(error);
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
    const validUpdate = ['name', 'password'];

    // filter update field with valid update field
    const isValidUpdate = updateBody.every((el) => validUpdate.includes(el));

    if (!isValidUpdate) {
      return res.status(400).send({ message: 'Invalid update.' });
    }

    const { user } = req;
    const updateContent = req.body;

    // change user property with request body
    updateBody.forEach((key) => {
      user[key] = updateContent[key];
    });

    // then save to database
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
