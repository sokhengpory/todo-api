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
