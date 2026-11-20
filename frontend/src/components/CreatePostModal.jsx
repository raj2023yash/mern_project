import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api/posts';

export default function CreatePostModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Technology',
    tags: '',
    coverImage: '',
    content: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setFormData({
        title: '',
        author: '',
        category: 'Technology',
        tags: '',
        coverImage: '',
        content: ''
      });
      setErrorMsg('');
      onClose();
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to publish post');
    }
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorMsg('Please enter both title and content.');
      return;
    }

    createMutation.mutate({
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Publish New Blog Post</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#f43f5e',
            padding: '0.6rem 0.9rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g., Deploying MERN Apps with Docker & Cloud Run"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                name="author"
                className="form-input"
                placeholder="Your name"
                value={formData.author}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Technology">Technology</option>
                <option value="DevOps">DevOps & Cloud</option>
                <option value="FullStack">Full Stack React</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Architecture">Architecture</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="form-input"
              placeholder="docker, react, kubernetes, cicd"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Cover Image URL (Optional)</label>
            <input
              type="url"
              name="coverImage"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={formData.coverImage}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              className="form-textarea"
              rows={5}
              placeholder="Write your article thoughts, technical notes, or findings..."
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={createMutation.isPending}
            >
              <Send size={16} />
              <span>{createMutation.isPending ? 'Publishing...' : 'Publish Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
