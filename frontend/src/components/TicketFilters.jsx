import { STATUS_OPTIONS, PRIORITY_OPTIONS, CATEGORY_OPTIONS } from '../constants/appConstants';
import './styles/TicketFilters.css';

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
          {STATUS_OPTIONS.map(status => (
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
          {PRIORITY_OPTIONS.map(priority => (
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
          {CATEGORY_OPTIONS.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
