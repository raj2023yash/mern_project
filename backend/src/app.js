const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (Essential for Docker and Cloud Run)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'mern-blog-backend'
  });
});

// API Routes
app.use('/api/posts', postRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('MERN Blog Application API is running successfully.');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

module.exports = app;
