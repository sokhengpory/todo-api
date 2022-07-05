const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Task = require('./task');

const userSchema = new mongoose.Schema(
  {
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
  },
  {
    toObject: { virtuals: true },
  }
);

// create virtual property name tasks
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

// create virtual property name totalTask
userSchema.virtual('totalTask', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
  count: true,
});

// delete sensitive data before sending to the respone
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.id;
  delete userObject.__v;

  return userObject;
};

// method use for generate authorization token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const id = user._id.toString();

  const token = jwt.sign({ id }, 'helloworld');

  // add new token to the existing tokens array
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// method use to find user with their credential
userSchema.statics.findByCredential = async (name, password) => {
  const user = await User.findOne({ name });

  if (!user) {
    throw new Error('User not found!');
  }

  // compare user password when login
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Wrong password');
  }

  return user;
};

// insert the virtual properties with the pre hook on findOne
userSchema.pre('findOne', function (next) {
  const user = this;
  user.populate({ path: 'tasks', select: 'description completed owner' });
  user.populate('totalTask');

  next();
});

// hash the plain password before save to the database with pre hook save
userSchema.pre('save', async function (next) {
  const user = this;
  const password = user.password;

  if (user.isModified('password')) {
    const hashedPassword = await bcrypt.hash(password, 8);
    user.password = hashedPassword;
  }

  next();
});

// delete all the tasks that associate with user when user is deleted
userSchema.pre('deleteOne', { document: true }, async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });

  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
