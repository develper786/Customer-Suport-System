import { STATUS_COLORS } from '../constants/appConstants';

export default function TicketStatusBadge({ status }) {
  const safeStatus = status || 'OPEN';
  const colorObj = STATUS_COLORS[safeStatus];
  const colors = colorObj ? { bg: colorObj.bg, text: colorObj.text } : { bg: '#cbd5e0', text: '#2d3748' };

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
