import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import TicketPage from './pages/TicketPage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="/dashboard/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="tickets" element={<TicketPage />} />
            <Route path="tickets/:id" element={<TicketDetailsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to={sessionStorage.getItem('user') ? "/dashboard/home" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
