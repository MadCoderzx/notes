import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiHeart, FiFolder, FiPlus } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import dashboardService from '../services/dashboardService';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data.stats);
        setRecentNotes(response.data.recentNotes);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.name}</p>
          </div>
          <Link to="/notes/new" className="btn btn-primary">
            <FiPlus /> New Note
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><FiFileText /></div>
            <div className="stat-info">
              <span className="stat-value">{stats?.total_notes || 0}</span>
              <span className="stat-label">Total Notes</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon favorite"><FiHeart /></div>
            <div className="stat-info">
              <span className="stat-value">{stats?.favorite_count || 0}</span>
              <span className="stat-label">Favorites</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon category"><FiFolder /></div>
            <div className="stat-info">
              <span className="stat-value">{stats?.category_count || 0}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <section className="dashboard-section">
            <h2>Recent Notes</h2>
            {recentNotes.length === 0 ? (
              <p className="empty-text">No notes yet. Create your first note!</p>
            ) : (
              <div className="recent-list">
                {recentNotes.map((note) => (
                  <Link key={note.id} to={`/notes/${note.id}`} className="recent-item">
                    <div>
                      <h4>{note.title}</h4>
                      <span className="recent-date">{format(new Date(note.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    <span className="note-card-category">{note.category}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-section profile-section">
            <h2>Profile</h2>
            <div className="profile-info">
              <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <div>
                <h4>{user?.name}</h4>
                <p>{user?.email}</p>
                <span className="recent-date">
                  Member since {user?.created_at ? format(new Date(user.created_at), 'MMM yyyy') : 'N/A'}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
