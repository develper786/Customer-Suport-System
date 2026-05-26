import { useState, useEffect } from 'react';
import './styles/ReplyBox.css';

export default function ReplyBox({
  ticketId, onReplySubmit, loading }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    setError('');
    try {
      await onReplySubmit({
        body: message,
        senderType: 'AGENT',
        senderName: currentUser?.username || 'Agent',
      });
      setMessage('');
    } catch (err) {
      setError(err.message || 'Failed to send message');
    }
  };

  return (
    <div className="reply-box">
      <h3>Reply</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="reply-form">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply here..."
          disabled={loading}
          rows="4"
          className="reply-textarea"
        />
        <div className="reply-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !message.trim()}
          >
            {loading ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
