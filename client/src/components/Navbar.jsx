import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="logo">
          Notes App
        </Link>
      </div>
      <div className="navbar-menu">
        <button onClick={toggleTheme} className="btn-icon" title="Toggle theme">
          {isDark ? <FiSun /> : <FiMoon />}
        </button>
        {user && (
          <div className="navbar-user">
            <FiUser />
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="btn-icon" title="Logout">
              <FiLogOut />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
