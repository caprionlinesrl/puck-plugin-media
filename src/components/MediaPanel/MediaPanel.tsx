import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Image, Images, FileText } from 'lucide-react';
import { ImagePickerModal } from '../ImagePickerModal/ImagePickerModal';
import { GalleryPickerModal } from '../GalleryPickerModal/GalleryPickerModal';
import { DocumentPickerModal } from '../DocumentPickerModal/DocumentPickerModal';
import type { Language, ImageOptions, GalleryOptions, DocumentOptions } from '../../types';
import styles from './MediaPanel.module.css';

export interface MediaPanelProps {
  languages: Language[];
  imageOptions: ImageOptions;
  galleryOptions?: GalleryOptions;
  documentOptions?: DocumentOptions;
}

type ModalType = 'image' | 'gallery' | 'document' | null;

export function MediaPanel({
  languages,
  imageOptions,
  galleryOptions,
  documentOptions,
}: MediaPanelProps) {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <div className={styles.panel}>
      <button
        type="button"
        className={styles.item}
        onClick={() => setOpenModal('image')}
      >
        <Image size={20} />
        <span>Images</span>
      </button>

      {galleryOptions && (
        <button
          type="button"
          className={styles.item}
          onClick={() => setOpenModal('gallery')}
        >
          <Images size={20} />
          <span>Gallery</span>
        </button>
      )}

      {documentOptions && (
        <button
          type="button"
          className={styles.item}
          onClick={() => setOpenModal('document')}
        >
          <FileText size={20} />
          <span>Documents</span>
        </button>
      )}

      {openModal === 'image' && createPortal(
        <ImagePickerModal
          languages={languages}
          imageOptions={imageOptions}
          title="Media Library"
          selectable={false}
          onClose={handleCloseModal}
        />,
        document.body
      )}

      {openModal === 'gallery' && galleryOptions && createPortal(
        <GalleryPickerModal
          languages={languages}
          galleryOptions={galleryOptions}
          title="Gallery Library"
          selectable={false}
          onClose={handleCloseModal}
        />,
        document.body
      )}

      {openModal === 'document' && documentOptions && createPortal(
        <DocumentPickerModal
          languages={languages}
          documentOptions={documentOptions}
          title="Document Library"
          selectable={false}
          onClose={handleCloseModal}
        />,
        document.body
      )}
    </div>
  );
}
