import axios from 'axios';

// Get base URL from environment or default to local backend URL /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
