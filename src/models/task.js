const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Number,
    required: true,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
