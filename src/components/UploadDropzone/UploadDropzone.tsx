import { useState, useRef, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { formatFileSize } from '../../hooks/useUpload';
import type { UploadConfig } from '../../types';
import styles from './UploadDropzone.module.css';

export interface UploadDropzoneProps {
  onFilesSelected: (files: FileList) => void;
  config: Required<UploadConfig>;
  disabled?: boolean;
}

export function UploadDropzone({
  onFilesSelected,
  config,
  disabled = false,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;

      if (disabled) return;

      const { files } = e.dataTransfer;
      if (files && files.length > 0) {
        onFilesSelected(files);
      }
    },
    [disabled, onFilesSelected]
  );

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (files && files.length > 0) {
        onFilesSelected(files);
        // Reset input so same file can be selected again
        e.target.value = '';
      }
    },
    [onFilesSelected]
  );

  const formatAcceptedTypes = (accept: string): string => {
    const types = accept.split(',').map((t) => t.trim());
    const formatted = types.map((type) => {
      if (type === 'image/*') return 'Images';
      if (type === 'image/jpeg') return 'JPG';
      if (type === 'image/png') return 'PNG';
      if (type === 'image/gif') return 'GIF';
      if (type === 'image/webp') return 'WebP';
      if (type === 'image/svg+xml') return 'SVG';
      return type.replace('image/', '').toUpperCase();
    });
    return formatted.join(', ');
  };

  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${disabled ? styles.disabled : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        multiple={config.multiple}
        onChange={handleInputChange}
        className={styles.input}
        disabled={disabled}
      />
      <Upload size={24} className={styles.icon} />
      <span className={styles.text}>
        {isDragging ? 'Drop files here' : 'Drop files here or click to upload'}
      </span>
      <span className={styles.hint}>
        {formatAcceptedTypes(config.accept)} (max {formatFileSize(config.maxSize)})
      </span>
    </div>
  );
}
