const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minLength: [2, 'Username must be 2 or more characters.'],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [6, 'Password must be 6 or more characters.'],
    validate(value) {
      if (value.includes('password')) {
        throw new Error('Password cannot contain the word "password"');
      }
    },
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
