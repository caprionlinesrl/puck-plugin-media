import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Image, Images, FileText } from 'lucide-react';
import { MediaImagePickerModal } from '../MediaImagePickerModal/MediaImagePickerModal';
import { MediaGalleryPickerModal } from '../MediaGalleryPickerModal/MediaGalleryPickerModal';
import { MediaDocumentPickerModal } from '../MediaDocumentPickerModal/MediaDocumentPickerModal';
import type { Language, MediaImageOptions, MediaGalleryOptions, MediaDocumentOptions } from '../../types';
import styles from './MediaPanel.module.css';

export interface MediaPanelProps {
  languages: Language[];
  imageOptions: MediaImageOptions;
  galleryOptions?: MediaGalleryOptions;
  documentOptions?: MediaDocumentOptions;
}

type ModalType = 'mediaImage' | 'mediaGallery' | 'mediaDocument' | null;

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
        onClick={() => setOpenModal('mediaImage')}
      >
        <Image size={20} />
        <span>Images</span>
      </button>

      {galleryOptions && (
        <button
          type="button"
          className={styles.item}
          onClick={() => setOpenModal('mediaGallery')}
        >
          <Images size={20} />
          <span>Gallery</span>
        </button>
      )}

      {documentOptions && (
        <button
          type="button"
          className={styles.item}
          onClick={() => setOpenModal('mediaDocument')}
        >
          <FileText size={20} />
          <span>Documents</span>
        </button>
      )}

      {openModal === 'mediaImage' && createPortal(
        <MediaImagePickerModal
          languages={languages}
          imageOptions={imageOptions}
          title="Media Library"
          selectable={false}
          onClose={handleCloseModal}
        />,
        document.body
      )}

      {openModal === 'mediaGallery' && galleryOptions && createPortal(
        <MediaGalleryPickerModal
          languages={languages}
          galleryOptions={galleryOptions}
          title="Gallery Library"
          selectable={false}
          onClose={handleCloseModal}
        />,
        document.body
      )}

      {openModal === 'mediaDocument' && documentOptions && createPortal(
        <MediaDocumentPickerModal
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
