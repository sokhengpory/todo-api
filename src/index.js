const express = require('express');
const taskRoute = require('./routes/taskRoute');
const userRoute = require('./routes/userRoute');
require('./db/mongoose');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/tasks', taskRoute);
app.use('/users', userRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
