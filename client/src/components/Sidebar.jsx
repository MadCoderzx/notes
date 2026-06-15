import { NavLink } from 'react-router-dom';
import { FiHome, FiFileText, FiPlusSquare } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FiHome /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/notes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FiFileText /> <span>My Notes</span>
        </NavLink>
        <NavLink to="/notes/new" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FiPlusSquare /> <span>New Note</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
