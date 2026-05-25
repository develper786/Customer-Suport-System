import { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Customer Support</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard/home"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard/tickets"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Tickets
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p className="user-name">{user.username}</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
