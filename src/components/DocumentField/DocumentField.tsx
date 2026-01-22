import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FieldLabel } from '@puckeditor/core';
import { FileText, File, X } from 'lucide-react';
import { DocumentPickerModal } from '../DocumentPickerModal/DocumentPickerModal';
import { formatFileSize } from '../../hooks/useUpload';
import type { DocumentFieldProps, DocumentItem } from '../../types';
import styles from './DocumentField.module.css';

export function DocumentField({
  value,
  onChange,
  field,
  languages,
  documentOptions,
}: DocumentFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (item: DocumentItem) => {
    onChange(item);
    setIsModalOpen(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const getTitleDisplay = (): string => {
    if (value?.title) {
      for (const lang of languages) {
        if (value.title[lang.code]) {
          return value.title[lang.code] as string;
        }
      }
    }
    return value?.filename || '';
  };

  const getIcon = () => {
    if (value?.mimeType === 'application/pdf') {
      return <FileText size={24} className={styles.pdfIcon} />;
    }
    return <File size={24} className={styles.fileIcon} />;
  };

  return (
    <FieldLabel label={field.label || 'Document'}>
      <div className={styles.container}>
        {value ? (
          <div className={styles.preview}>
            <div className={styles.iconWrapper}>
              {getIcon()}
            </div>
            <div className={styles.info}>
              <span className={styles.title}>{getTitleDisplay()}</span>
              <span className={styles.meta}>
                {value.extension?.toUpperCase()} • {formatFileSize(value.size)}
              </span>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleOpenModal}
                className={styles.changeButton}
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className={styles.removeButton}
                aria-label="Remove document"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpenModal}
            className={styles.selectButton}
          >
            <FileText size={24} />
            <span>Select document</span>
          </button>
        )}
      </div>

      {isModalOpen && createPortal(
        <DocumentPickerModal
          languages={languages}
          documentOptions={documentOptions}
          title="Select Document"
          onSelect={handleSelect}
          onClose={() => setIsModalOpen(false)}
        />,
        document.body
      )}
    </FieldLabel>
  );
}
