import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { STATUS_COLORS, CATEGORY_COLORS } from '../constants/appConstants';
import { formatDate } from '../utils/dateUtils';
import TicketStatusBadge from './TicketStatusBadge';
import TicketCategoryBadge from './TicketCategoryBadge';
import metricsService from '../services/metrics';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [volumeTrend, setVolumeTrend] = useState(null);
  const [aiRatio, setAIRatio] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError('');

      const [overviewData, volumeData, aiData, rtData, ticketsData] = await Promise.all([
        metricsService.getOverview(),
        metricsService.getVolumeTrend('daily'),
        metricsService.getAIRatio(),
        metricsService.getResponseTime(),
        metricsService.getRecentTickets(),
      ]);

      setOverview(overviewData);
      setVolumeTrend(volumeData);
      setAIRatio(aiData);
      setResponseTime(rtData);
      setRecentTickets(ticketsData || []);
    } catch (err) {
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="home-container"><div className="loading-message">Loading dashboard...</div></div>;
  }

  if (error) {
    return <div className="home-container"><div className="error-message">{error}</div></div>;
  }

  // Prepare chart data
  const statusChartData = overview ? [
    { name: 'Open', value: overview.byStatus.OPEN || 0 },
    { name: 'AI Responded', value: overview.byStatus.AI_RESPONDED || 0 },
    { name: 'Pending Human', value: overview.byStatus.PENDING_HUMAN || 0 },
    { name: 'In Progress', value: overview.byStatus.IN_PROGRESS || 0 },
    { name: 'Resolved', value: overview.byStatus.RESOLVED || 0 },
  ] : [];

  const statusChartColors = [
    STATUS_COLORS.OPEN.hex,
    STATUS_COLORS.AI_RESPONDED.hex,
    STATUS_COLORS.PENDING_HUMAN.hex,
    STATUS_COLORS.IN_PROGRESS.hex,
    STATUS_COLORS.RESOLVED.hex,
  ];

  const categoryChartData = overview ? [
    { name: 'Billing', value: overview.byCategory.BILLING || 0 },
    { name: 'Technical', value: overview.byCategory.TECHNICAL || 0 },
    { name: 'Account', value: overview.byCategory.ACCOUNT || 0 },
    { name: 'Feature Request', value: overview.byCategory.FEATURE_REQUEST || 0 },
    { name: 'General', value: overview.byCategory.GENERAL || 0 },
  ] : [];

  const categoryChartColors = [
    CATEGORY_COLORS.BILLING.hex,
    CATEGORY_COLORS.TECHNICAL.hex,
    CATEGORY_COLORS.ACCOUNT.hex,
    CATEGORY_COLORS.FEATURE_REQUEST.hex,
    CATEGORY_COLORS.GENERAL.hex,
  ];

  const handleRecentTicketClick = (ticketId) => {
    navigate(`/dashboard/tickets/${ticketId}`);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <h1>Dashboard Overview</h1>
        <p className="subtitle">Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
      </div>

      {/* 4 Top Stat Cards */}
      {overview && (
        <div className="stats-grid">
          <div className="stat-card" style={{ borderLeftColor: '#667eea' }}>
            <div className="stat-value" style={{ color: '#667eea' }}>{overview.total}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: STATUS_COLORS.OPEN.hex }}>
            <div className="stat-value" style={{ color: STATUS_COLORS.OPEN.hex }}>{overview.byStatus.OPEN || 0}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: STATUS_COLORS.IN_PROGRESS.hex }}>
            <div className="stat-value" style={{ color: STATUS_COLORS.IN_PROGRESS.hex }}>{overview.byStatus.IN_PROGRESS || 0}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: STATUS_COLORS.RESOLVED.hex }}>
            <div className="stat-value" style={{ color: STATUS_COLORS.RESOLVED.hex }}>{overview.byStatus.RESOLVED || 0}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      )}

      {/* Bar Chart - By Status */}
      <div className="chart-section">
        <h3>Tickets by Status</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusChartColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart - By Category */}
      <div className="chart-section">
        <h3>Tickets by Category</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => {
                  const total = categoryChartData.reduce((sum, cat) => sum + cat.value, 0);
                  const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                  return `${percentage}%`;
                }}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryChartColors[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} tickets`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f7fafc', borderRadius: '6px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '13px' }}>
            {categoryChartData.map((item, idx) => {
              const total = categoryChartData.reduce((sum, cat) => sum + cat.value, 0);
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: categoryChartColors[idx] }} />
                  <span>{item.name}: <strong>{item.value}</strong> ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Volume Trend */}
      {volumeTrend && (
        <div className="metrics-section">
          <h3>Ticket Volume Trend (Last 7 Days)</h3>
          <div className="volume-summary">
            <p>
              Total tickets created: <strong>{volumeTrend.data.reduce((sum, point) => sum + point.count, 0)}</strong>
            </p>
            <p className="volume-details">
              {volumeTrend.data.map((point, idx) => (
                <span key={idx}>
                  {point.date}: <strong>{point.count}</strong>{idx < volumeTrend.data.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* AI vs Human Ratio */}
      {aiRatio && (
        <div className="metrics-row">
          <div className="metric-card">
            <h4>AI Handled</h4>
            <div className="metric-value" style={{ color: '#a855f7' }}>{aiRatio.aiCount} tickets</div>
            <div className="metric-subtext">{aiRatio.aiPercentage.toFixed(1)}% of handled</div>
            <div className="metric-bar">
              <div className="metric-bar-fill" style={{ width: `${aiRatio.aiPercentage}%`, backgroundColor: '#a855f7' }} />
            </div>
          </div>
          <div className="metric-card">
            <h4>Agent Handled</h4>
            <div className="metric-value" style={{ color: '#3182ce' }}>{aiRatio.agentCount} tickets</div>
            <div className="metric-subtext">{aiRatio.agentPercentage.toFixed(1)}% of handled</div>
            <div className="metric-bar">
              <div className="metric-bar-fill" style={{ width: `${aiRatio.agentPercentage}%`, backgroundColor: '#3182ce' }} />
            </div>
          </div>
        </div>
      )}

      {/* Response Time Metrics */}
      {responseTime && (
        <div className="metrics-row">
          <div className="metric-card">
            <h4>Avg First Response</h4>
            <div className="metric-value" style={{ color: '#667eea' }}>
              {responseTime.averageFirstResponseHours.toFixed(1)}h
            </div>
            <div className="metric-subtext">From creation to first agent message</div>
          </div>
          <div className="metric-card">
            <h4>Avg Resolution Time</h4>
            <div className="metric-value" style={{ color: '#667eea' }}>
              {responseTime.averageResolutionHours.toFixed(1)}h
            </div>
            <div className="metric-subtext">From creation to resolution</div>
          </div>
        </div>
      )}

      {/* Recent Tickets */}
      {recentTickets && recentTickets.length > 0 && (
        <div className="recent-section">
          <h3>Recent Tickets</h3>
          <table className="recent-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Customer</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((ticket) => (
                <tr key={ticket.id} className="clickable-row" onClick={() => handleRecentTicketClick(ticket.id)}>
                  <td className="ticket-title">{ticket.title}</td>
                  <td><TicketStatusBadge status={ticket.status} /></td>
                  <td>
                    <span className="priority-badge" style={{ backgroundColor: '#e53e3e' }}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td><TicketCategoryBadge category={ticket.category} /></td>
                  <td>{ticket.customerName || '-'}</td>
                  <td>{formatDate(ticket.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
