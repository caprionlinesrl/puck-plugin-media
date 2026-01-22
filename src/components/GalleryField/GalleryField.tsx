import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FieldLabel } from '@puckeditor/core';
import { Images, X } from 'lucide-react';
import { GalleryPickerModal } from '../GalleryPickerModal/GalleryPickerModal';
import type { GalleryFieldProps, GalleryItem } from '../../types';
import styles from './GalleryField.module.css';

export function GalleryField({
  value,
  onChange,
  field,
  languages,
  galleryOptions,
}: GalleryFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (gallery: GalleryItem) => {
    onChange(gallery);
    setIsModalOpen(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const previewImages = value?.images?.slice(0, 4) || [];
  const remainingCount = (value?.images?.length || 0) - 4;

  return (
    <FieldLabel label={field.label || 'Gallery'}>
      <div className={styles.container}>
        {value ? (
          <div className={styles.preview}>
            <div className={styles.header}>
              <span className={styles.name}>{value.name}</span>
              <span className={styles.count}>
                {value.images.length} {value.images.length === 1 ? 'image' : 'images'}
              </span>
            </div>
            
            {previewImages.length > 0 && (
              <div className={styles.thumbnails}>
                {previewImages.map((img) => (
                  <div key={img.id} className={styles.thumbnail}>
                    <img src={img.url} alt="" />
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className={styles.more}>
                    +{remainingCount}
                  </div>
                )}
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleOpenModal}
                className={styles.changeButton}
              >
                Change Gallery
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className={styles.removeButton}
                aria-label="Remove gallery"
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
            <Images size={24} />
            <span>Select gallery</span>
          </button>
        )}
      </div>

      {isModalOpen && createPortal(
        <GalleryPickerModal
          languages={languages}
          galleryOptions={galleryOptions}
          title="Select Gallery"
          onSelect={handleSelect}
          onClose={() => setIsModalOpen(false)}
        />,
        document.body
      )}
    </FieldLabel>
  );
}
