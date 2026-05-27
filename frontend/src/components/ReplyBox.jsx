import { useState, useEffect } from 'react';
import './styles/ReplyBox.css';

const MIN_LENGTH = 20;
const MAX_LENGTH = 700;

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

  const getValidationStatus = () => {
    const trimmedMessage = message.trim();
    const length = trimmedMessage.length;

    if (!trimmedMessage) {
      return { isValid: false, message: '', state: 'empty' };
    }

    if (length < MIN_LENGTH) {
      return {
        isValid: false,
        message: `Minimum ${MIN_LENGTH} characters required (${length}/${MIN_LENGTH})`,
        state: 'too-short',
      };
    }

    if (length > MAX_LENGTH) {
      return {
        isValid: false,
        message: `Maximum ${MAX_LENGTH} characters allowed (${length}/${MAX_LENGTH})`,
        state: 'too-long',
      };
    }

    return {
      isValid: true,
      message: `${length}/${MAX_LENGTH} characters`,
      state: 'valid',
    };
  };

  const validation = getValidationStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validation.isValid) {
      setError(validation.message);
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
        <div className="textarea-wrapper">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your reply here (minimum 20 characters, maximum 700)..."
            disabled={loading}
            rows="4"
            className={`reply-textarea ${validation.state}`}
            maxLength={MAX_LENGTH}
          />
          <div className={`char-count ${validation.state}`}>
            {validation.message}
          </div>
        </div>

        <div className="reply-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !validation.isValid}
            title={!validation.isValid ? validation.message : 'Send reply'}
          >
            {loading ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
