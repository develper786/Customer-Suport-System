import { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import authService from '../services/auth';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from sessionStorage or global error handling will redirect to login
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setError('');
      await authService.logout();
      // Logout clears sessionStorage, navigate to login
      navigate('/login');
    } catch (err) {
      // Even if logout throws error, sessionStorage is cleared
      // Navigate to login anyway to ensure UI reflects logout
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {error && <div className="error-banner">{error}</div>}

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
            🎫 Ticket List
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
