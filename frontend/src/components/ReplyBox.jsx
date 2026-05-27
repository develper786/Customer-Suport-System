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

  const validateMessage = () => {
    const isTrimmed = message.trim();
    const charCount = isTrimmed.length;

    const validation = {
      isTrimmed: !!isTrimmed,
      charCount: charCount,
      isTooShort: charCount > 0 && charCount < MIN_LENGTH,
      isTooLong: charCount > MAX_LENGTH,
      isValid: charCount >= MIN_LENGTH && charCount <= MAX_LENGTH,
      message: '',
      state: 'empty',
    };

    // Determine state and message
    if (!validation.isTrimmed) {
      validation.state = 'empty';
      validation.message = '';
    } else if (validation.isTooShort) {
      validation.state = 'too-short';
      validation.message = `Minimum ${MIN_LENGTH} characters required (${charCount}/${MIN_LENGTH})`;
    } else if (validation.isTooLong) {
      validation.state = 'too-long';
      validation.message = `Maximum ${MAX_LENGTH} characters allowed (${charCount}/${MAX_LENGTH})`;
    } else {
      validation.state = 'valid';
      validation.message = `${charCount}/${MAX_LENGTH} characters`;
    }

    return validation;
  };

  const validation = validateMessage();

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    if (newMessage.length <= MAX_LENGTH) {
      setMessage(newMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setError('');
    try {
      await onReplySubmit({
        body: message.trim(),
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
            onChange={handleMessageChange}
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

        <div className="validation-info">
          {validation.isTrimmed && (
            <span className={`validation-badge ${validation.state}`}>
              {validation.isTooShort && '⚠️ Too short'}
              {validation.isTooLong && '❌ Too long'}
              {validation.isValid && '✅ Valid'}
            </span>
          )}
        </div>

        <div className="reply-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !validation.isValid}
            title={!validation.isValid ? validation.message || 'Message must be between 20 and 700 characters' : 'Send reply'}
          >
            {loading ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
