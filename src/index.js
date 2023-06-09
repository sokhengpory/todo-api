const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs/promises');
const path = require('path');

require('dotenv').config();
require('./db/mongoose');

const taskRoute = require('./routes/taskRoute');
const userRoute = require('./routes/userRoute');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(logger());
app.use(fileUpload());

app.use('/tasks', taskRoute);
app.use('/users', userRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
