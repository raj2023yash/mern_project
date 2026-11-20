const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const app = require('./app');
const Post = require('./models/Post');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blogdb';

async function seedInitialData() {
  const count = await Post.countDocuments();
  if (count === 0) {
    await Post.create([
      {
        title: 'Mastering Full-Stack Development with React & TanStack Query',
        content: 'TanStack Query (React Query) fundamentally changes how state is managed in modern web applications. By treating server state separately from client UI state, it provides automatic caching, background re-fetching, and declarative mutations.',
        author: 'Yash Raj Panda',
        category: 'FullStack',
        tags: ['react', 'tanstack-query', 'javascript', 'frontend'],
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        likes: 12
      },
      {
        title: 'Containerization Best Practices with Docker and Multi-Stage Builds',
        content: 'Docker containers ensure environment parity across local development, CI/CD runners, and production cloud hosts. Using Alpine Linux base images and multi-stage builds reduces image sizes from over 1GB to under 30MB.',
        author: 'DevOps Lead',
        category: 'DevOps',
        tags: ['docker', 'containers', 'devops', 'cloud'],
        coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop&q=80',
        likes: 8
      },
      {
        title: 'Automated CI/CD Pipelines with GitHub Actions and Google Cloud Run',
        content: 'GitHub Actions workflows automate the software lifecycle. On pull request, unit tests and linting execute. Upon merging into the main branch, container images are built, published to Docker Hub, and deployed seamlessly to Google Cloud Run.',
        author: 'Cloud Architect',
        category: 'Architecture',
        tags: ['cicd', 'github-actions', 'gcp', 'cloud-run'],
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        likes: 15
      }
    ]);
    console.log('[Database] Seeded 3 sample blog posts successfully.');
  }
}

async function startServer() {
  try {
    // Attempt connecting to the configured MongoDB URI with a short timeout
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`[MongoDB] Connected successfully to: ${MONGO_URI}`);
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to local/configured MongoDB (${err.message}). Starting embedded In-Memory MongoDB...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected to embedded In-Memory MongoDB at: ${inMemoryUri}`);
    } catch (memErr) {
      console.error('[MongoDB] Failed to start In-Memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }

  await seedInitialData();

  app.listen(PORT, () => {
    console.log(`[Server] Backend API running at http://localhost:${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[Server] Posts API: http://localhost:${PORT}/api/posts`);
  });
}

startServer();
