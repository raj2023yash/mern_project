const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogdb';

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`[MongoDB] Connected successfully to: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  })
  .catch((err) => {
    console.error('[MongoDB] Connection error:', err.message);
    process.exit(1);
  });
