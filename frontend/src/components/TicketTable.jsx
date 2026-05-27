import { formatDate } from '../utils/dateUtils';
import TicketStatusBadge from './TicketStatusBadge';
import TicketCategoryBadge from './TicketCategoryBadge';
import './styles/TicketTable.css';

const PRIORITY_COLORS = {
  HIGH: '#e53e3e',
  MEDIUM: '#dd6b20',
  LOW: '#3182ce',
};

export default function TicketTable({ tickets, onRowClick, onDelete, loading }) {

  if (loading) {
    return <div className="loading-container">Loading tickets...</div>;
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="empty-state">
        <p>No tickets found</p>
      </div>
    );
  }

  return (
    <div className="tickets-table-wrapper">
      <table className="tickets-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Customer</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="clickable-row"
              onClick={() => onRowClick(ticket)}
            >
              <td className="ticket-id">#{ticket.id}</td>
              <td className="ticket-title">{ticket.title}</td>
              <td>
                <TicketCategoryBadge category={ticket.category || 'GENERAL'} />
              </td>
              <td>
                <TicketStatusBadge status={ticket.status} />
              </td>
              <td>
                <span
                  className="priority-badge"
                  style={{ backgroundColor: PRIORITY_COLORS[ticket.priority] }}
                >
                  {ticket.priority}
                </span>
              </td>
              <td className="ticket-customer">
                {ticket.customerName || ticket.customerEmail || '-'}
              </td>
              <td className="ticket-date">{formatDate(ticket.createdAt)}</td>
              <td className="ticket-actions" onClick={e => e.stopPropagation()}>
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDelete(ticket.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
