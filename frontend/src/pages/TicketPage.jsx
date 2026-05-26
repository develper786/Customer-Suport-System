import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/tickets';
import TicketTable from '../components/TicketTable';
import TicketFilters from '../components/TicketFilters';
import TicketModal from '../components/TicketModal';
import '../styles/pages/TicketPage.css';

export default function TicketPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, statusFilter, priorityFilter, categoryFilter]);

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

  const applyFilters = () => {
    let filtered = tickets;

    if (statusFilter) {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    setFilteredTickets(filtered);
  };

  const handleViewTicket = (ticket) => {
    navigate(`/dashboard/tickets/${ticket.id}`);
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

  return (
    <div className="ticket-page">
      {error && <div className="error-banner">{error}</div>}

      <div className="page-header">
        <h1>Support Tickets</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Ticket
        </button>
      </div>

      <TicketFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        categoryFilter={categoryFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onCategoryChange={setCategoryFilter}
      />

      <div className="tickets-section">
        <div className="section-header">
          <h2>Tickets ({filteredTickets.length})</h2>
        </div>
        <TicketTable
          tickets={filteredTickets}
          onRowClick={handleViewTicket}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

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
