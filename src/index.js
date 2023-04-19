const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();
require('./db/mongoose');

const taskRoute = require('./routes/taskRoute');
const userRoute = require('./routes/userRoute');

const app = express();

const PORT = process.env.PORT || 5000;
morgan.token('date', () => {
  return new Date().toLocaleString();
});

app.use(express.json());
app.use(cors());
app.use(
  morgan(
    '[:remote-addr] [:method - :url] [:date] [:status - :response-time ms]'
  )
);

app.get('/test', (req, res) => {
  return res.send({
    message: 'hello world',
  });
});
app.use('/tasks', taskRoute);
app.use('/users', userRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
