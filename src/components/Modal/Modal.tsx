import { useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import styles from './Modal.module.css';

export interface ModalProps {
  title: string;
  onClose: () => void;
  size?: 'default' | 'small';
  headerLeft?: React.ReactNode;
  headerActions?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  overlay?: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
}

export function Modal({
  title,
  onClose,
  size = 'default',
  headerLeft,
  headerActions,
  toolbar,
  children,
  footer,
  overlay,
  loading = false,
  empty = false,
  emptyMessage = 'No items found',
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={`${styles.modal} ${size === 'small' ? styles.small : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {headerLeft}
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <div className={styles.headerActions}>
            {headerActions}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className={styles.closeButton}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {toolbar && <div className={styles.toolbar}>{toolbar}</div>}

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <Loader2 size={32} className={styles.spinner} />
              <span>Loading...</span>
            </div>
          ) : (
            <>
              {children}
              {empty && <div className={styles.empty}>{emptyMessage}</div>}
            </>
          )}
        </div>

        {footer && <div className={styles.footer}>{footer}</div>}

        {overlay}
      </div>
    </div>
  );
}
