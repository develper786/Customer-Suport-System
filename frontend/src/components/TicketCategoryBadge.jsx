const CATEGORY_COLORS = {
  BILLING: { bg: '#e6f7ff', text: '#0050b3' },
  TECHNICAL: { bg: '#f5f5f5', text: '#262626' },
  ACCOUNT: { bg: '#f9f0ff', text: '#7c3aed' },
  FEATURE_REQUEST: { bg: '#f0f9ff', text: '#0284c7' },
  GENERAL: { bg: '#f5f5f5', text: '#525252' },
};

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
