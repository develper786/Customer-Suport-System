import { useState, useEffect } from 'react';
import ticketService from '../services/tickets';
import TicketModal from './TicketModal';
import TicketDetail from './TicketDetail';
import '../styles/Tickets.css';

const STATUS_COLORS = {
  OPEN: '#38a169',
  AI_RESPONDED: '#3182ce',
  PENDING_HUMAN: '#d69e2e',
  IN_PROGRESS: '#9f7aea',
  RESOLVED: '#718096',
};

const PRIORITY_COLORS = {
  HIGH: '#e53e3e',
  MEDIUM: '#dd6b20',
  LOW: '#3182ce',
};

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets(statusFilter);
  }, [tickets, statusFilter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ticketService.getTickets();
      setTickets(data);
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = (status) => {
    setStatusFilter(status);
    if (status) {
      setFilteredTickets(tickets.filter(t => t.status === status));
    } else {
      setFilteredTickets(tickets);
    }
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await ticketService.deleteTicket(id);
      setTickets(tickets.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete ticket');
    }
  };

  const handleModalSave = () => {
    setShowModal(false);
    loadTickets();
  };

  const handleDetailBack = () => {
    setSelectedTicket(null);
    loadTickets();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (selectedTicket) {
    return (
      <TicketDetail
        ticket={selectedTicket}
        onBack={handleDetailBack}
        onUpdated={loadTickets}
      />
    );
  }

  return (
    <div className="tickets-container">
      {error && <div className="error-banner">{error}</div>}

      <div className="tickets-header">
        <h1>Support Tickets</h1>
        <button className="btn-primary" onClick={handleCreate} disabled={loading}>
          + New Ticket
        </button>
      </div>

      <div className="tickets-filters">
        <button
          className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
          onClick={() => filterTickets('')}
          disabled={loading}
        >
          All ({tickets.length})
        </button>
        <button
          className={`filter-btn ${statusFilter === 'OPEN' ? 'active' : ''}`}
          onClick={() => filterTickets('OPEN')}
          disabled={loading}
        >
          Open ({tickets.filter(t => t.status === 'OPEN').length})
        </button>
        <button
          className={`filter-btn ${statusFilter === 'AI_RESPONDED' ? 'active' : ''}`}
          onClick={() => filterTickets('AI_RESPONDED')}
          disabled={loading}
        >
          AI Responded ({tickets.filter(t => t.status === 'AI_RESPONDED').length})
        </button>
        <button
          className={`filter-btn ${statusFilter === 'PENDING_HUMAN' ? 'active' : ''}`}
          onClick={() => filterTickets('PENDING_HUMAN')}
          disabled={loading}
        >
          Pending ({tickets.filter(t => t.status === 'PENDING_HUMAN').length})
        </button>
        <button
          className={`filter-btn ${statusFilter === 'IN_PROGRESS' ? 'active' : ''}`}
          onClick={() => filterTickets('IN_PROGRESS')}
          disabled={loading}
        >
          In Progress ({tickets.filter(t => t.status === 'IN_PROGRESS').length})
        </button>
        <button
          className={`filter-btn ${statusFilter === 'RESOLVED' ? 'active' : ''}`}
          onClick={() => filterTickets('RESOLVED')}
          disabled={loading}
        >
          Resolved ({tickets.filter(t => t.status === 'RESOLVED').length})
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Loading tickets...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="empty-state">
          <p>No tickets found</p>
          <p className="empty-state-hint">
            {statusFilter ? 'Try changing the filter' : 'Create a new ticket to get started'}
          </p>
        </div>
      ) : (
        <div className="tickets-table-wrapper">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} onClick={() => handleViewTicket(ticket)} className="clickable-row">
                  <td className="ticket-id">#{ticket.id}</td>
                  <td className="ticket-title">{ticket.title}</td>
                  <td className="ticket-customer">
                    {ticket.customerName || ticket.customerEmail || '-'}
                  </td>
                  <td>
                    <span
                      className="badge status-badge"
                      style={{ backgroundColor: STATUS_COLORS[ticket.status] }}
                    >
                      {ticket.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge priority-badge"
                      style={{ backgroundColor: PRIORITY_COLORS[ticket.priority] }}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="ticket-date">{formatDate(ticket.createdAt)}</td>
                  <td className="ticket-actions" onClick={e => e.stopPropagation()}>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(ticket.id)}
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
      )}

      {showModal && (
        <TicketModal
          ticket={null}
          onSave={handleModalSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
