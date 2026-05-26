import TicketStatusBadge from './TicketStatusBadge';
import './styles/StatusActions.css';

const STATUSES = [
  'OPEN',
  'AI_RESPONDED',
  'PENDING_HUMAN',
  'IN_PROGRESS',
  'RESOLVED',
];

export default function StatusActions({ ticket, onStatusChange, updating }) {
  return (
    <div className="status-actions">
      <div className="action-section">
        <label htmlFor="status-select">Update Status:</label>
        <select
          id="status-select"
          value={ticket.status}
          onChange={(e) => onStatusChange(e.target.value)}
          disabled={updating}
          className="status-select"
        >
          {STATUSES.map(status => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <div className="current-status">
          <span>Current:</span>
          <TicketStatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="action-section">
        <label>Ticket Info:</label>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">ID:</span>
            <span className="info-value">#{ticket.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Priority:</span>
            <span className="info-value">{ticket.priority}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Category:</span>
            <span className="info-value">{ticket.category || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Customer:</span>
            <span className="info-value">{ticket.customerName || ticket.customerEmail || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
