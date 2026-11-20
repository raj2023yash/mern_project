import { Heart, Trash2, Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likePost, deletePost } from '../api/posts';

export default function PostCard({ post, onSelectPost }) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => likePost(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const handleLike = (e) => {
    e.stopPropagation();
    likeMutation.mutate();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      deleteMutation.mutate();
    }
  };

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  return (
    <article className="post-card" onClick={() => onSelectPost(post)}>
      <div className="card-image-wrap">
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80'}
          alt={post.title}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <span className="card-category">{post.category || 'General'}</span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{post.title}</h3>
        <p className="card-excerpt">{post.content}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="tags-list">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">#{tag}</span>
            ))}
          </div>
        )}

        <div className="card-footer">
          <div className="author-meta">
            <div className="author-avatar">
              {(post.author || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{post.author || 'Anonymous'}</div>
              <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Calendar size={12} />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className={`icon-btn like-btn ${post.likes > 0 ? 'liked' : ''}`}
              onClick={handleLike}
              title="Like this post"
            >
              <Heart size={16} fill={post.likes > 0 ? 'currentColor' : 'none'} />
              <span>{post.likes || 0}</span>
            </button>

            <button
              className="icon-btn delete-btn"
              onClick={handleDelete}
              title="Delete post"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
