const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();

mongoose.connect('mongodb://localhost:27017/aptiver');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/api', userRouter);
app.use('/api/admin', adminRoutes);

app.listen(3001, () => console.log('server running...'));
