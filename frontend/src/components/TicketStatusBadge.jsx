const STATUS_COLORS = {
  OPEN: { bg: '#38a169', text: '#fff' },
  AI_RESPONDED: { bg: '#3182ce', text: '#fff' },
  PENDING_HUMAN: { bg: '#d69e2e', text: '#fff' },
  IN_PROGRESS: { bg: '#9f7aea', text: '#fff' },
  RESOLVED: { bg: '#718096', text: '#fff' },
};

export default function TicketStatusBadge({ status }) {
  const safeStatus = status || 'OPEN';
  const colors = STATUS_COLORS[safeStatus] || { bg: '#cbd5e0', text: '#2d3748' };

  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '6px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {safeStatus.replace(/_/g, ' ')}
    </span>
  );
}
