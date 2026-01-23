import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Modal } from '../Modal';
import { SearchBar } from '../SearchBar';
import { LoadMoreButton } from '../LoadMoreButton';
import { ConfirmDialog } from '../ConfirmDialog';
import { SelectionToolbar } from '../SelectionToolbar';
import { MediaImageGrid } from '../MediaImageGrid/MediaImageGrid';
import { UploadDropzone } from '../UploadDropzone/UploadDropzone';
import { UploadQueue } from '../UploadQueue/UploadQueue';
import { useUpload } from '../../hooks/useUpload';
import type { MediaImagePickerModalProps, MediaImageItem, LocalizedString } from '../../types';
import styles from './ImagePickerModal.module.css';

const DEFAULT_UPLOAD_CONFIG = {
  accept: 'image/*',
  maxSize: 10 * 1024 * 1024,
  multiple: true,
};

const PAGE_SIZE = 20;

type ModalView = 'picker' | 'edit';

export function MediaImagePickerModal({
  languages,
  imageOptions,
  title = 'Select Image',
  selectedImage,
  onSelect,
  onClose,
  selectable = true,
}: MediaImagePickerModalProps) {
  const { fetchList, upload, update, delete: deleteImage, uploadConfig } = imageOptions;

  const [view, setView] = useState<ModalView>('picker');
  const [editingItem, setEditingItem] = useState<MediaImageItem | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<MediaImageItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaImageItem | null>(null);
  const [altValues, setAltValues] = useState<LocalizedString>({});
  const [activeLang, setActiveLang] = useState(languages[0]?.code || 'it');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canUpload = !!upload;
  const {
    uploading,
    isUploading,
    addFiles,
    cancelUpload,
    clearCompleted,
    uploadConfig: mergedUploadConfig,
  } = useUpload({
    upload: upload || (async () => { throw new Error('Upload not configured'); }),
    config: uploadConfig || DEFAULT_UPLOAD_CONFIG,
    onUploadComplete: (newItem) => {
      setItems((prev) => [newItem as MediaImageItem, ...prev]);
    },
  });

  const loadItems = useCallback(
    async (searchQuery: string, pageNum: number, append = false) => {
      setLoading(true);
      try {
        const result = await fetchList({
          query: searchQuery || undefined,
          page: pageNum,
          pageSize: PAGE_SIZE,
        });

        const newItems = Array.isArray(result) ? result : result.items;
        const more = Array.isArray(result) ? newItems.length === PAGE_SIZE : (result.hasMore ?? false);

        setItems((prev) => (append ? [...prev, ...newItems] : newItems));
        setHasMore(more);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        setItems([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchList]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadItems(search, 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, loadItems]);

  useEffect(() => {
    if (selectedImage) {
      const existingItem = items.find((item) => item.id === selectedImage.id);
      if (existingItem) {
        setSelectedItem(existingItem);
      }
    }
  }, [selectedImage, items]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadItems(search, nextPage, true);
  };

  const handleImageClick = (item: MediaImageItem) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleConfirmSelection = () => {
    if (!selectedItem || !onSelect) return;
    onSelect(selectedItem);
  };

  const handleEditAlt = (item: MediaImageItem) => {
    setEditingItem(item);
    setAltValues(item.alt || {});
    setActiveLang(languages[0]?.code || 'it');
    setView('edit');
  };

  const handleAltChange = (langCode: string, value: string) => {
    setAltValues((prev) => ({
      ...prev,
      [langCode]: value,
    }));
  };

  const handleSaveAlt = async () => {
    if (!editingItem || !update) return;

    setIsSaving(true);
    try {
      await update(editingItem.id, { alt: altValues });
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, alt: altValues } : item
        )
      );
      if (selectedItem?.id === editingItem.id) {
        setSelectedItem((prev) => prev ? { ...prev, alt: altValues } : null);
      }
      setView('picker');
      setEditingItem(null);
      setAltValues({});
    } catch (error) {
      console.error('Failed to update alt text:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSelect = (item: MediaImageItem) => {
    setSelectedForDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item.id)) {
        newSet.delete(item.id);
      } else {
        newSet.add(item.id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedForDelete.size === items.length) {
      setSelectedForDelete(new Set());
    } else {
      setSelectedForDelete(new Set(items.map((item) => item.id)));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteImage || selectedForDelete.size === 0) return;

    setIsDeleting(true);
    try {
      const deletePromises = Array.from(selectedForDelete).map((id) => deleteImage(id));
      await Promise.all(deletePromises);
      setItems((prev) => prev.filter((item) => !selectedForDelete.has(item.id)));
      if (selectedItem && selectedForDelete.has(selectedItem.id)) {
        setSelectedItem(null);
      }
      setShowDeleteConfirm(false);
      setSelectedForDelete(new Set());
      setSelectMode(false);
    } catch (error) {
      console.error('Failed to delete images:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isAllSelected = items.length > 0 && selectedForDelete.size === items.length;
  const isSomeSelected = selectedForDelete.size > 0 && selectedForDelete.size < items.length;

  // Edit View
  if (view === 'edit' && editingItem) {
    return (
      <Modal
        title="Edit Image Details"
        onClose={handleClose}
        headerLeft={
          <button
            type="button"
            onClick={() => {
              setView('picker');
              setEditingItem(null);
              setAltValues({});
            }}
            className={styles.backButton}
            aria-label="Back to grid"
          >
            <ArrowLeft size={20} />
          </button>
        }
        footer={
          <div className={styles.editFooter}>
            <div />
            <button
              type="button"
              onClick={handleSaveAlt}
              className={styles.saveButton}
              disabled={isSaving || !update}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        }
      >
        <div className={styles.editContent}>
          <div className={styles.editPreview}>
            <img
              src={editingItem.url}
              alt={editingItem.filename || ''}
              className={styles.editImage}
            />
          </div>

          <div className={styles.editInfo}>
            <div className={styles.editInfoRow}>
              <span className={styles.editInfoLabel}>Filename</span>
              <span className={styles.editInfoValue}>{editingItem.filename}</span>
            </div>
            {editingItem.width && editingItem.height && (
              <div className={styles.editInfoRow}>
                <span className={styles.editInfoLabel}>Dimensions</span>
                <span className={styles.editInfoValue}>
                  {editingItem.width}×{editingItem.height}
                </span>
              </div>
            )}
            {editingItem.size && (
              <div className={styles.editInfoRow}>
                <span className={styles.editInfoLabel}>Size</span>
                <span className={styles.editInfoValue}>
                  {formatFileSize(editingItem.size)}
                </span>
              </div>
            )}
          </div>

          <div className={styles.editField}>
            <div className={styles.editFieldHeader}>
              <label className={styles.editFieldLabel}>Alt</label>
              <div className={styles.langTabs}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setActiveLang(lang.code)}
                    className={`${styles.langTab} ${activeLang === lang.code ? styles.langTabActive : ''}`}
                  >
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={altValues[activeLang] || ''}
              onChange={(e) => handleAltChange(activeLang, e.target.value)}
              placeholder={`Alt text in ${languages.find(l => l.code === activeLang)?.label || activeLang}...`}
              className={styles.editInput}
            />
          </div>
        </div>
      </Modal>
    );
  }

  // Picker View
  const renderFooter = () => {
    if (selectMode) {
      return (
        <SelectionToolbar
          selectedCount={selectedForDelete.size}
          totalCount={items.length}
          onSelectAll={handleSelectAll}
          onCancel={() => {
            setSelectMode(false);
            setSelectedForDelete(new Set());
          }}
          onDelete={() => setShowDeleteConfirm(true)}
          isAllSelected={isAllSelected}
          isIndeterminate={isSomeSelected}
        />
      );
    }

    if (selectedItem && selectable) {
      return (
        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            <img
              src={selectedItem.thumbnailUrl || selectedItem.url}
              alt=""
              className={styles.footerImage}
            />
            <span className={styles.footerFilename}>
              {selectedItem.filename}
            </span>
            {selectedItem.width && selectedItem.height && (
              <span className={styles.footerMeta}>
                {selectedItem.width}×{selectedItem.height}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleConfirmSelection}
            className={styles.selectButton}
          >
            Select Image
          </button>
        </div>
      );
    }

    return undefined;
  };

  return (
    <Modal
      title={title}
      onClose={handleClose}
      headerActions={
        !selectMode && deleteImage ? (
          <button
            type="button"
            onClick={() => setSelectMode(true)}
            className={styles.selectModeButton}
          >
            Select Items
          </button>
        ) : undefined
      }
      toolbar={
        <div className={styles.toolbar}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search images..."
            autoFocus={!selectMode}
          />
        </div>
      }
      footer={renderFooter()}
      overlay={
        showDeleteConfirm ? (
          <ConfirmDialog
            title="Delete Images"
            message={`Are you sure you want to delete ${selectedForDelete.size} image${selectedForDelete.size > 1 ? 's' : ''}? This action cannot be undone.`}
            confirmLabel={isDeleting ? 'Deleting...' : `Delete ${selectedForDelete.size} image${selectedForDelete.size > 1 ? 's' : ''}`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteConfirm(false)}
            loading={isDeleting}
            variant="danger"
          />
        ) : undefined
      }
      loading={loading && items.length === 0}
      empty={!loading && items.length === 0}
      emptyMessage="No images found"
    >
      {canUpload && !selectMode && (
        <div className={styles.uploadSection}>
          <UploadDropzone
            onFilesSelected={addFiles}
            config={mergedUploadConfig}
            disabled={isUploading && uploading.length >= 10}
          />
          {uploading.length > 0 && (
            <UploadQueue
              files={uploading}
              onCancel={cancelUpload}
              onClearCompleted={clearCompleted}
            />
          )}
        </div>
      )}

      <MediaImageGrid
        items={items}
        onSelect={handleImageClick}
        selectedId={selectedItem?.id}
        onEditAlt={update ? handleEditAlt : undefined}
        manageMode={selectMode}
        selectedIds={selectedForDelete}
        onToggleSelect={handleToggleSelect}
      />

      {hasMore && (
        <LoadMoreButton onClick={handleLoadMore} loading={loading} />
      )}
    </Modal>
  );
}
