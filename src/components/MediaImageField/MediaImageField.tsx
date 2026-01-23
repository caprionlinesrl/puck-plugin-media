import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FieldLabel } from '@puckeditor/core';
import { ImagePlus, X } from 'lucide-react';
import { MediaImagePickerModal } from '../MediaImagePickerModal/MediaImagePickerModal';
import type { MediaImageFieldProps, MediaImageItem } from '../../types';
import styles from './ImageField.module.css';

export function MediaImageField({
  value,
  onChange,
  field,
  languages,
  imageOptions,
}: MediaImageFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (item: MediaImageItem) => {
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

  const getAltDisplay = (): string => {
    if (!value?.alt) return '';
    for (const lang of languages) {
      if (value.alt[lang.code]) {
        return value.alt[lang.code] as string;
      }
    }
    return '';
  };

  return (
    <FieldLabel label={field.label || 'Image'}>
      <div className={styles.container}>
        {value ? (
          <div className={styles.preview}>
            <img
              src={value.url}
              alt={getAltDisplay()}
              className={styles.image}
            />
            <div className={styles.overlay}>
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
                aria-label="Remove image"
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
            <ImagePlus size={24} />
            <span>Select image</span>
          </button>
        )}
      </div>

      {isModalOpen && createPortal(
        <MediaImagePickerModal
          languages={languages}
          imageOptions={imageOptions}
          title="Select Image"
          selectedImage={value}
          onSelect={handleSelect}
          onClose={() => setIsModalOpen(false)}
        />,
        document.body
      )}
    </FieldLabel>
  );
}
