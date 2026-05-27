import { useState, useEffect, useRef } from 'react';
import { formatDateTime } from '../utils/dateUtils';
import { STATUS_HEX_COLORS, PRIORITY_COLORS } from '../constants/appConstants';
import ticketService from '../services/tickets';
import '../styles/TicketDetail.css';

export default function TicketDetail({ ticket, onBack, onUpdated }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const threadEndRef = useRef(null);

  useEffect(() => {
    loadThread();
  }, [ticket.id]);

  useEffect(() => {
    scrollToBottom();
  }, [threads]);

  const loadThread = async () => {
    try {
      setLoading(true);
      setError('');
      const threads = await ticketService.getTicketThread(ticket.id);
      setThreads(threads || []);
    } catch (err) {
      setError(err.message || 'Failed to load thread');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    setError('');

    try {
      const response = await ticketService.replyToTicket(ticket.id, {
        message: reply,
        senderName: 'Agent',
      });

      if (response.success) {
        setThreads([...threads, response.thread]);
        setReply('');
        onUpdated();
      }
    } catch (err) {
      setError(err.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    setError('');

    try {
      await ticketService.updateTicket(ticket.id, { status: newStatus });
      setCurrentTicket({ ...currentTicket, status: newStatus });
      onUpdated();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };


  return (
    <div className="ticket-detail-container">
      {error && <div className="error-banner">{error}</div>}

      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Tickets
        </button>
        <div className="header-info">
          <h1>#{currentTicket.id} - {currentTicket.title}</h1>
          <div className="header-meta">
            <span className="customer-info">
              {currentTicket.customerName || currentTicket.customerEmail || 'Unknown'}
            </span>
            <span className="ticket-date">
              Created {formatDateTime(currentTicket.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-controls">
        <div className="status-control">
          <label htmlFor="status-select">Status:</label>
          <select
            id="status-select"
            value={currentTicket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updatingStatus}
            className="status-select"
          >
            <option value="OPEN">Open</option>
            <option value="AI_RESPONDED">AI Responded</option>
            <option value="PENDING_HUMAN">Pending Human</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <span
            className="status-badge"
            style={{ backgroundColor: STATUS_HEX_COLORS[currentTicket.status] || '#cbd5e0' }}
          >
            {currentTicket.status.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="priority-display">
          <span>Priority:</span>
          <span
            className="priority-badge"
            style={{ backgroundColor: PRIORITY_COLORS[currentTicket.priority] }}
          >
            {currentTicket.priority}
          </span>
        </div>
      </div>

      {currentTicket.description && (
        <div className="ticket-description">
          <h3>Description</h3>
          <p>{currentTicket.description}</p>
        </div>
      )}

      <div className="thread-container">
        <h3>Conversation Thread</h3>
        {loading ? (
          <div className="loading-state">Loading thread...</div>
        ) : threads.length === 0 ? (
          <div className="empty-thread">
            <p>No messages yet. Start the conversation by replying below.</p>
          </div>
        ) : (
          <div className="thread-messages">
            {threads.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === 'agent' ? 'agent-message' : 'customer-message'}`}
              >
                <div className="message-header">
                  <strong className="sender-name">{msg.senderName}</strong>
                  <span className="message-time">{formatDateTime(msg.createdAt)}</span>
                </div>
                <div className="message-body">{msg.message}</div>
              </div>
            ))}
            <div ref={threadEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSendReply} className="reply-form">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply here..."
          disabled={sending}
          rows="4"
          required
        />
        <div className="reply-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={sending || !reply.trim()}
          >
            {sending ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
