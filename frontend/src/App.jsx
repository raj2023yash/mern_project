import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, PenLine, FileText } from 'lucide-react';
import { fetchPosts } from './api/posts';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import CreatePostModal from './components/CreatePostModal';
import PostDetailModal from './components/PostDetailModal';

const CATEGORIES = ['All', 'Technology', 'DevOps', 'FullStack', 'Tutorial', 'Architecture'];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // TanStack Query to fetch posts
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['posts', { search: searchTerm, category: activeCategory }],
    queryFn: () => fetchPosts({ search: searchTerm, category: activeCategory }),
    staleTime: 1000 * 30
  });

  const posts = data?.data || [];

  return (
    <div>
      <Navbar onOpenCreateModal={() => setIsCreateOpen(true)} />

      <main className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="tech-stack-row">
            <span className="tech-chip">MongoDB</span>
            <span className="tech-chip">Express.js</span>
            <span className="tech-chip">React.js</span>
            <span className="tech-chip">Node.js</span>
            <span className="tech-chip">TanStack Query</span>
            <span className="tech-chip">Docker</span>
            <span className="tech-chip">Google Cloud Run</span>
            <span className="tech-chip">GitHub Actions</span>
          </div>

          <h1 className="hero-title">
            Containerized MERN Stack Blog
          </h1>
          <p className="hero-subtitle">
            A production-ready full stack blog platform powered by TanStack Query for dynamic state caching,
            containerized with Docker & Docker Compose, and automated via GitHub Actions CI/CD.
          </p>
        </section>

        {/* Search, Filter & Action Bar */}
        <div className="control-bar">
          <div className="search-box">
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search posts by title, tag, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Post Grid & Status handling */}
        {isLoading && (
          <div className="empty-state">
            <div className="spinner"></div>
            <h3>Loading articles...</h3>
            <p>Fetching the latest blog entries via TanStack Query</p>
          </div>
        )}

        {isError && (
          <div className="empty-state" style={{ borderColor: 'rgba(244, 63, 94, 0.4)' }}>
            <h3 style={{ color: '#f43f5e' }}>Unable to load posts</h3>
            <p>{error?.message || 'Please check that the backend container is running.'}</p>
            <button className="btn-secondary" onClick={() => refetch()}>
              Retry Connection
            </button>
          </div>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="empty-state">
            <FileText size={48} color="#6366f1" style={{ margin: '0 auto 1rem' }} />
            <h3>No articles found</h3>
            <p>
              {searchTerm || activeCategory !== 'All'
                ? 'Try modifying your search query or filter category.'
                : 'Get started by publishing your first blog post!'}
            </p>
            <button className="btn-primary" onClick={() => setIsCreateOpen(true)}>
              <PenLine size={16} />
              <span>Create New Article</span>
            </button>
          </div>
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onSelectPost={(p) => setSelectedPost(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div>
            <strong>CSE 3395: Web Application Projects with React</strong>
            <p style={{ marginTop: '4px' }}>Assignment 4 &bull; Containerization, Cloud Deployment & CI/CD Automation</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>B.Tech CSIT 5th Sem</span>
            <span>Docker + Cloud Run</span>
            <span>GitHub Actions CI/CD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
