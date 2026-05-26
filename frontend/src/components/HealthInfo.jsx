import { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import '../styles/HealthInfo.css';

export default function HealthInfo() {
  const [health, setHealth] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const healthRes = await axiosInstance.get('/health');
        setHealth(healthRes.data);

        const infoRes = await axiosInstance.get('/health/info');
        setInfo(infoRes.data);

        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch backend health info');
        console.error('Health check error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  if (loading) {
    return <div className="health-container"><p>Checking backend status...</p></div>;
  }

  return (
    <div className="health-container">
      <h2>Backend Status</h2>

      {error && (
        <div className="health-error">
          <p>{error}</p>
        </div>
      )}

      {health && (
        <div className="health-card">
          <div className="status-badge" style={{ backgroundColor: health.status === 'UP' ? '#10b981' : '#ef4444' }}>
            {health.status}
          </div>
          <p><strong>Message:</strong> {health.message}</p>
          <p><strong>Version:</strong> {health.version}</p>
          <p><strong>Database:</strong> {health.database}</p>
          <p><strong>Last Updated:</strong> {new Date(health.timestamp).toLocaleTimeString()}</p>
        </div>
      )}

      {info && (
        <div className="info-card">
          <h3>System Information</h3>
          <p><strong>App Name:</strong> {info.app_name}</p>
          <p><strong>Version:</strong> {info.version}</p>
          <p><strong>Environment:</strong> {info.environment}</p>
          <p><strong>Java Version:</strong> {info.java_version}</p>
          <p><strong>OS:</strong> {info.os_name}</p>
        </div>
      )}
    </div>
  );
}
