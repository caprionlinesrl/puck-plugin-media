import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { formatFileSize } from '../../hooks/useUpload';
import type { UploadingFile } from '../../types';
import styles from './UploadQueue.module.css';

export interface UploadQueueProps {
  files: UploadingFile[];
  onCancel: (id: string) => void;
  onClearCompleted: () => void;
}

export function UploadQueue({ files, onCancel, onClearCompleted }: UploadQueueProps) {
  if (files.length === 0) return null;

  const hasCompleted = files.some((f) => f.status === 'completed' || f.status === 'error');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>
          Uploading ({files.filter((f) => f.status === 'uploading' || f.status === 'pending').length})
        </span>
        {hasCompleted && (
          <button
            type="button"
            onClick={onClearCompleted}
            className={styles.clearButton}
          >
            Clear completed
          </button>
        )}
      </div>
      <div className={styles.list}>
        {files.map((file) => (
          <UploadItem key={file.id} file={file} onCancel={() => onCancel(file.id)} />
        ))}
      </div>
    </div>
  );
}

interface UploadItemProps {
  file: UploadingFile;
  onCancel: () => void;
}

function UploadItem({ file, onCancel }: UploadItemProps) {
  return (
    <div className={`${styles.item} ${styles[file.status]}`}>
      <div className={styles.preview}>
        {file.previewUrl ? (
          <img src={file.previewUrl} alt="" className={styles.previewImage} />
        ) : (
          <div className={styles.previewPlaceholder} />
        )}
        {file.status === 'uploading' && (
          <div className={styles.progressOverlay}>
            <div 
              className={styles.progressBar} 
              style={{ height: `${100 - file.progress}%` }}
            />
            <span className={styles.progressText}>{file.progress}%</span>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <span className={styles.filename} title={file.file.name}>
          {file.file.name}
        </span>
        <span className={styles.size}>{formatFileSize(file.file.size)}</span>
        {file.error && <span className={styles.error}>{file.error}</span>}
      </div>

      <div className={styles.actions}>
        {file.status === 'pending' && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            aria-label="Cancel upload"
          >
            <X size={16} />
          </button>
        )}
        {file.status === 'uploading' && (
          <Loader2 size={18} className={styles.spinner} />
        )}
        {file.status === 'completed' && (
          <CheckCircle size={18} className={styles.successIcon} />
        )}
        {file.status === 'error' && (
          <AlertCircle size={18} className={styles.errorIcon} />
        )}
      </div>
    </div>
  );
}
