const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
  tokens: [{ token: { type: String, required: true } }],
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const id = user._id.toString();

  const token = jwt.sign({ id }, 'helloworld');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredential = async (name, password) => {
  const user = await User.findOne({ name });

  if (!user) {
    throw new Error('User not found!');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Wrong password');
  }

  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;
  const password = user.password;

  if (user.isModified('password')) {
    const hashedPassword = await bcrypt.hash(password, 8);
    user.password = hashedPassword;
  }

  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
