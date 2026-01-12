const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('dotenv');
const userRouter = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();

env.config();

mongoose.connect(process.env.DB_URL);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/api', userRouter);
app.use('/api/admin', adminRoutes);

app.listen(3001, () => console.log('server running...'));
