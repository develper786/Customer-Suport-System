import { useRef, useEffect } from 'react';
import './styles/MessageThread.css';

const SENDER_COLORS = {
  CUSTOMER: { bg: '#f0fdf4', border: '#38a169' },
  AGENT: { bg: '#edf2f7', border: '#667eea' },
  AI: { bg: '#f9f0ff', border: '#a855f7' },
};

export default function MessageThread({ messages, loading }) {
  const threadEndRef = useRef(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="thread-loading">Loading messages...</div>;
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="empty-thread">
        <p>No messages yet. Start the conversation by replying below.</p>
      </div>
    );
  }

  return (
    <div className="message-thread">
      {messages.map((msg) => {
        const colors = SENDER_COLORS[msg.senderType] || SENDER_COLORS.AGENT;
        return (
          <div
            key={msg.id}
            className="message"
            style={{
              backgroundColor: colors.bg,
              borderLeft: `4px solid ${colors.border}`,
            }}
          >
            <div className="message-header">
              <strong className="sender-name">{msg.senderName}</strong>
              <span className="message-time">{formatDate(msg.sentAt)}</span>
            </div>
            <div className="message-body">{msg.body}</div>
          </div>
        );
      })}
      <div ref={threadEndRef} />
    </div>
  );
}
