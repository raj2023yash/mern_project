const express = require('express');
const cors = require('cors');
const path = require('path');
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

// In production, serve the compiled React frontend from frontend/dist
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
const fs = require('fs');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res) => {
    // If request does not start with /api, serve the React app index.html
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    } else {
      res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
  });
} else {
  // Root fallback if frontend is not built
  app.get('/', (req, res) => {
    res.send('MERN Blog Application API is running successfully.');
  });

  // 404 handler for API routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found'
    });
  });
}

module.exports = app;
