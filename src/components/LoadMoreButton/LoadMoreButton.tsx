import { Loader2 } from 'lucide-react';
import styles from './LoadMoreButton.module.css';

export interface LoadMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export function LoadMoreButton({ onClick, loading = false }: LoadMoreButtonProps) {
  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={styles.button}
      >
        {loading ? (
          <>
            <Loader2 size={16} className={styles.spinner} />
            Loading...
          </>
        ) : (
          'Load more'
        )}
      </button>
    </div>
  );
}
