import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../services/tickets';
import MessageThread from '../components/MessageThread';
import ReplyBox from '../components/ReplyBox';
import StatusActions from '../components/StatusActions';
import TicketCategoryBadge from '../components/TicketCategoryBadge';
import '../styles/pages/TicketDetailsPage.css';

export default function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadTicketAndMessages();
  }, [id]);

  const loadTicketAndMessages = async () => {
    try {
      setLoading(true);
      setError('');

      const ticketData = await ticketService.getTicketById(id);
      setTicket(ticketData);

      const messagesData = await ticketService.getMessages(id);
      setMessages(messagesData || []);
    } catch (err) {
      setError(err.message || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      setError('');

      const updated = await ticketService.updateTicket(id, { status: newStatus });
      setTicket(updated);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReplySubmit = async (messageData) => {
    try {
      setSendingMessage(true);
      setError('');

      const newMessage = await ticketService.addMessage(id, messageData);
      setMessages([...messages, newMessage]);
    } catch (err) {
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return <div className="loading-page">Loading ticket...</div>;
  }

  if (!ticket) {
    return (
      <div className="error-page">
        <p>Ticket not found</p>
        <button onClick={() => navigate('/dashboard/tickets')}>Back to Tickets</button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="ticket-details-page">
      {error && <div className="error-banner">{error}</div>}

      <div className="details-header">
        <button className="back-btn" onClick={() => navigate('/dashboard/tickets')}>
          ← Back to Tickets
        </button>
        <div className="header-content">
          <h1>#{ticket.id} - {ticket.title}</h1>
          <div className="header-meta">
            <span className="meta-item">
              <TicketCategoryBadge category={ticket.category || 'GENERAL'} />
            </span>
            <span className="meta-item">
              Created {formatDate(ticket.createdAt)}
            </span>
            <span className="meta-item">
              Updated {formatDate(ticket.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {ticket.description && (
        <div className="ticket-description">
          <h3>Description</h3>
          <p>{ticket.description}</p>
        </div>
      )}

      <StatusActions
        ticket={ticket}
        onStatusChange={handleStatusChange}
        updating={updatingStatus}
      />

      <div className="messages-section">
        <h2>Conversation</h2>
        <MessageThread messages={messages} loading={false} />
      </div>

      <ReplyBox
        ticketId={id}
        onReplySubmit={handleReplySubmit}
        loading={sendingMessage}
      />
    </div>
  );
}
