import { Plus, Sparkles, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '../api/posts';

export default function Navbar({ onOpenCreateModal }) {
  const { data: health, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
    refetchInterval: 30000 // Polling every 30s
  });

  const isOnline = !isLoading && health && health.status === 'OK';

  return (
    <header className="navbar">
      <div className="container nav-content">
        <a href="#" className="brand">
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <span>Cloud<span style={{ color: '#38bdf8' }}>Blog</span></span>
          <span className="brand-badge">MERN + CI/CD</span>
        </a>

        <div className="nav-actions">
          <div className={`health-pill ${isOnline ? '' : 'offline'}`} title="Backend Service Health Check">
            <span className="status-dot"></span>
            <Activity size={14} />
            <span>API: {isOnline ? 'Online' : 'Offline / Connecting'}</span>
          </div>

          <button className="btn-primary" onClick={onOpenCreateModal}>
            <Plus size={18} />
            <span>Create Post</span>
          </button>
        </div>
      </div>
    </header>
  );
}
