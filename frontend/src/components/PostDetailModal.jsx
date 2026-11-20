import { X, Calendar, Heart, Tag } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likePost } from '../api/posts';

export default function PostDetailModal({ post, onClose }) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => likePost(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  if (!post) return null;

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="card-category" style={{ position: 'static' }}>
            {post.category || 'General'}
          </span>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {post.coverImage && (
          <div style={{ borderRadius: '12px', overflow: 'hidden', maxHeight: '280px', marginBottom: '1.25rem' }}>
            <img
              src={post.coverImage}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', lineHeight: 1.3 }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="author-avatar">
              {(post.author || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <strong style={{ color: '#f1f5f9' }}>{post.author || 'Anonymous'}</strong>
              <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          <button
            className={`icon-btn like-btn ${post.likes > 0 ? 'liked' : ''}`}
            onClick={() => likeMutation.mutate()}
            style={{ fontSize: '1rem', padding: '0.5rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}
          >
            <Heart size={18} fill={post.likes > 0 ? 'currentColor' : 'none'} />
            <span>{post.likes || 0} Likes</span>
          </button>
        </div>

        <div style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>
          {post.content}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <Tag size={16} color="#94a3b8" />
            {post.tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
