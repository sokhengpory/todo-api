const express = require('express');
const cors = require('cors');
const taskRoute = require('./routes/taskRoute');
const userRoute = require('./routes/userRoute');
require('./db/mongoose');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/tasks', taskRoute);
app.use('/users', userRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
