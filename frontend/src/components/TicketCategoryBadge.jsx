import { CATEGORY_COLORS } from '../constants/appConstants';

export default function TicketCategoryBadge({ category }) {
  const safeCategory = category || 'GENERAL';
  const colors = CATEGORY_COLORS[safeCategory] || { bg: '#f5f5f5', text: '#525252' };

  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {safeCategory}
    </span>
  );
}
