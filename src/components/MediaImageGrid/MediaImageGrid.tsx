import { Pencil, Check } from 'lucide-react';
import type { MediaImageGridProps, MediaImageItem } from '../../types';
import styles from './ImageGrid.module.css';

export function MediaImageGrid({
  items,
  onSelect,
  selectedId,
  onEditAlt,
  manageMode = false,
  selectedIds,
  onToggleSelect,
}: MediaImageGridProps) {
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleItemClick = (item: MediaImageItem) => {
    if (manageMode && onToggleSelect) {
      onToggleSelect(item);
    } else {
      onSelect(item);
    }
  };

  const handleEditClick = (e: React.MouseEvent, item: MediaImageItem) => {
    e.stopPropagation();
    onEditAlt?.(item);
  };

  const isSelected = (item: MediaImageItem): boolean => {
    if (manageMode) {
      return selectedIds?.has(item.id) ?? false;
    }
    return selectedId === item.id;
  };

  return (
    <div className={styles.grid}>
      {items.map((item) => {
        const selected = isSelected(item);
        const isSelectedForInsert = !manageMode && selectedId === item.id;

        return (
          <div key={item.id} className={styles.itemContainer}>
            <button
              type="button"
              onClick={() => handleItemClick(item)}
              className={`${styles.item} ${isSelectedForInsert ? styles.selected : ''}`}
              title={item.filename}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.filename || ''}
                  className={styles.image}
                  loading="lazy"
                />
                {manageMode && (
                  <div className={`${styles.checkbox} ${selected ? styles.checkboxChecked : ''}`}>
                    {selected && <Check size={14} strokeWidth={3} />}
                  </div>
                )}
                {isSelectedForInsert && (
                  <div className={styles.checkmark}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
            <div className={styles.info}>
              <div className={styles.infoRow}>
                <div className={styles.infoText}>
                  {item.filename && (
                    <span className={styles.filename}>{item.filename}</span>
                  )}
                  <span className={styles.meta}>
                    {item.width && item.height && (
                      <span>{item.width}×{item.height}</span>
                    )}
                    {item.size && (
                      <span>{formatFileSize(item.size)}</span>
                    )}
                  </span>
                </div>
                {!manageMode && onEditAlt && (
                  <button
                    type="button"
                    onClick={(e) => handleEditClick(e, item)}
                    className={styles.editButton}
                    aria-label="Edit alt"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
