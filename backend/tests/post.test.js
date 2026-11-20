const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Post = require('../src/models/Post');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Post.deleteMany({});
});

describe('MERN Blog Backend API Tests', () => {
  test('GET /api/health should return status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('POST /api/posts should create a new blog post', async () => {
    const postPayload = {
      title: 'Containerization with Docker in 2026',
      content: 'Docker simplifies deployment and environment replication across servers.',
      author: 'Jane Doe',
      category: 'DevOps',
      tags: ['docker', 'devops', 'containers']
    };

    const res = await request(app)
      .post('/api/posts')
      .send(postPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postPayload.title);
    expect(res.body.data.tags).toContain('docker');
  });

  test('GET /api/posts should retrieve all created blog posts', async () => {
    await Post.create([
      { title: 'Post 1', content: 'Content 1', author: 'Author 1' },
      { title: 'Post 2', content: 'Content 2', author: 'Author 2' }
    ]);

    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.data.length).toBe(2);
  });

  test('GET /api/posts/:id should return single post', async () => {
    const post = await Post.create({
      title: 'Unique Post',
      content: 'Unique content here',
      author: 'Author'
    });

    const res = await request(app).get(`/api/posts/${post._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Unique Post');
  });

  test('PATCH /api/posts/:id/like should increment likes count', async () => {
    const post = await Post.create({
      title: 'Likeable Post',
      content: 'Great read',
      author: 'Author',
      likes: 5
    });

    const res = await request(app).patch(`/api/posts/${post._id}/like`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.likes).toBe(6);
  });

  test('DELETE /api/posts/:id should delete post', async () => {
    const post = await Post.create({
      title: 'To Be Deleted',
      content: 'Will be gone',
      author: 'Author'
    });

    const res = await request(app).delete(`/api/posts/${post._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Post deleted successfully');

    const check = await Post.findById(post._id);
    expect(check).toBeNull();
  });
});
