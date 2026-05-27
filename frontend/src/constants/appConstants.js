export const STATUS_COLORS = {
  OPEN: { bg: '#38a169', text: '#fff' },
  AI_RESPONDED: { bg: '#3182ce', text: '#fff' },
  PENDING_HUMAN: { bg: '#d69e2e', text: '#fff' },
  IN_PROGRESS: { bg: '#9f7aea', text: '#fff' },
  RESOLVED: { bg: '#718096', text: '#fff' },
};

// Simple hex colors for status (used for badges in tables/lists)
export const STATUS_HEX_COLORS = {
  OPEN: '#38a169',
  AI_RESPONDED: '#3182ce',
  PENDING_HUMAN: '#d69e2e',
  IN_PROGRESS: '#9f7aea',
  RESOLVED: '#718096',
};

export const PRIORITY_COLORS = {
  HIGH: '#e53e3e',
  MEDIUM: '#dd6b20',
  LOW: '#3182ce',
};

export const CATEGORY_COLORS = {
  BILLING: { bg: '#e6f7ff', text: '#0050b3' },
  TECHNICAL: { bg: '#f5f5f5', text: '#262626' },
  ACCOUNT: { bg: '#f9f0ff', text: '#7c3aed' },
  FEATURE_REQUEST: { bg: '#f0f9ff', text: '#0284c7' },
  GENERAL: { bg: '#f5f5f5', text: '#525252' },
};

export const SENDER_COLORS = {
  CUSTOMER: { bg: '#f0fdf4', border: '#38a169' },
  AGENT: { bg: '#edf2f7', border: '#667eea' },
  AI: { bg: '#f9f0ff', border: '#a855f7' },
};

export const STATUS_OPTIONS = [
  { value: '', label: 'All Tickets' },
  { value: 'OPEN', label: 'Open' },
  { value: 'AI_RESPONDED', label: 'AI Responded' },
  { value: 'PENDING_HUMAN', label: 'Pending Human' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
];

export const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

export const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'BILLING', label: 'Billing' },
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'ACCOUNT', label: 'Account' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
  { value: 'GENERAL', label: 'General' },
];

export const STATUS_VALUES = [
  'OPEN',
  'AI_RESPONDED',
  'PENDING_HUMAN',
  'IN_PROGRESS',
  'RESOLVED',
];
