import axios from 'axios';

// Automatically determine base URL:
// 1. Explicit env variable if defined (VITE_API_BASE_URL)
// 2. http://localhost:5000/api if running Vite dev server locally on port 3000
// 3. Relative '/api' if deployed to cloud or served unified
const defaultUrl = (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3000')
  ? 'http://localhost:5000/api'
  : '/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchPosts = async ({ search = '', category = 'All' } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (category && category !== 'All') params.category = category;

  const response = await api.get('/posts', { params });
  return response.data;
};

export const fetchPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data.data;
};

export const updatePost = async ({ id, ...postData }) => {
  const response = await api.put(`/posts/${id}`, postData);
  return response.data.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

export const likePost = async (id) => {
  const response = await api.patch(`/posts/${id}/like`);
  return response.data.data;
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    return { status: 'OFFLINE', error: error.message };
  }
};
