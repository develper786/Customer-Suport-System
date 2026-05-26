import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/auth';

/**
 * ProtectedRoute Component
 * Verifies user authentication before allowing access to protected pages
 *
 * Features:
 * - Checks sessionStorage for user
 * - Verifies session with backend API call to /api/me
 * - Handles loading state while verifying
 * - Redirects to login on unauthorized (401)
 * - Uses global error handling from axios interceptors
 * - Relies on httpOnly session cookies for actual auth (JSESSIONID)
 */
export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = resolved
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // First check sessionStorage (fast path)
        const storedUser = authService.getStoredUser();
        if (!storedUser) {
          setIsAuthenticated(false);
          return;
        }

        // Then verify session with backend
        // This ensures the session is still valid on the server
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          // If getCurrentUser fails (401), the global axios interceptor
          // will handle the redirect to login
          console.error('Session verification failed:', error);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  // Loading state - show nothing while verifying
  if (isAuthenticated === null) {
    return (
      <div className="loading-container">
        <p>Verifying authentication...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated - render protected content
  return <Outlet context={{ user }} />;
}
