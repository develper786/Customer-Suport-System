import { useRef, useEffect } from 'react';
import { formatDateTime } from '../utils/dateUtils';
import { SENDER_COLORS } from '../constants/appConstants';
import './styles/MessageThread.css';

export default function MessageThread({ messages, loading }) {
  const threadEndRef = useRef(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
              <span className="message-time">{formatDateTime(msg.sentAt)}</span>
            </div>
            <div className="message-body">{msg.body}</div>
          </div>
        );
      })}
      <div ref={threadEndRef} />
    </div>
  );
}
