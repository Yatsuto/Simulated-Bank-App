const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: '*', // allow all during dev; restrict this later in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// 🕵️ Log all incoming requests
app.use((req, res, next) => {
  console.log(`🛬 ${req.method} ${req.originalUrl}`);
  next();
});

//Db connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bank', require('./routes/banking'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
