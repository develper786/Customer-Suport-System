import './styles/TicketFilters.css';

const STATUSES = [
  { value: '', label: 'All Tickets' },
  { value: 'OPEN', label: 'Open' },
  { value: 'AI_RESPONDED', label: 'AI Responded' },
  { value: 'PENDING_HUMAN', label: 'Pending Human' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
];

const PRIORITIES = [
  { value: '', label: 'All Priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'BILLING', label: 'Billing' },
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'ACCOUNT', label: 'Account' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
  { value: 'GENERAL', label: 'General' },
];

export default function TicketFilters({ statusFilter, priorityFilter, categoryFilter, onStatusChange, onPriorityChange, onCategoryChange }) {
  return (
    <div className="ticket-filters">
      <div className="filter-group">
        <label htmlFor="status-filter">Status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filter-select"
        >
          {STATUSES.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority-filter">Priority:</label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="filter-select"
        >
          {PRIORITIES.map(priority => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="category-filter">Category:</label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          {CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
