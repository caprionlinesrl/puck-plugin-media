import { Check } from 'lucide-react';
import styles from './SelectionToolbar.module.css';

export interface SelectionToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onCancel: () => void;
  onDelete: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  deleteLabel?: string;
}

export function SelectionToolbar({
  selectedCount,
  totalCount: _totalCount,
  onSelectAll,
  onCancel,
  onDelete,
  isAllSelected,
  isIndeterminate,
  deleteLabel = 'Delete',
}: SelectionToolbarProps) {
  // totalCount is kept in the interface for future use (e.g., "X of Y selected")
  void _totalCount;
  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        onClick={onSelectAll}
        className={`${styles.selectAllButton} ${isAllSelected ? styles.checked : ''} ${isIndeterminate ? styles.indeterminate : ''}`}
        aria-label={isAllSelected ? 'Deselect all' : 'Select all'}
      >
        <div className={styles.checkbox}>
          {isAllSelected && <Check size={14} strokeWidth={3} />}
          {isIndeterminate && !isAllSelected && <div className={styles.indeterminateLine} />}
        </div>
        <span>Select All</span>
      </button>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDelete}
          className={styles.deleteButton}
          disabled={selectedCount === 0}
        >
          {deleteLabel} ({selectedCount})
        </button>
      </div>
    </div>
  );
}
