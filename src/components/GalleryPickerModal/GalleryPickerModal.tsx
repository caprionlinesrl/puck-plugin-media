import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, ArrowLeft, Loader2, Check } from 'lucide-react';
import { Modal } from '../Modal';
import { SearchBar } from '../SearchBar';
import { LoadMoreButton } from '../LoadMoreButton';
import { ConfirmDialog } from '../ConfirmDialog';
import { SelectionToolbar } from '../SelectionToolbar';
import { ImageGrid } from '../ImageGrid/ImageGrid';
import { UploadDropzone } from '../UploadDropzone/UploadDropzone';
import { UploadQueue } from '../UploadQueue/UploadQueue';
import { useUpload } from '../../hooks/useUpload';
import type { GalleryPickerModalProps, GalleryItem, ImageItem, LocalizedString } from '../../types';
import styles from './GalleryPickerModal.module.css';

type ViewMode = 'list' | 'detail' | 'editImage';

const DEFAULT_UPLOAD_CONFIG = {
  accept: 'image/*',
  maxSize: 10 * 1024 * 1024,
  multiple: true,
};

const PAGE_SIZE = 20;

export function GalleryPickerModal({
  languages,
  galleryOptions,
  title = 'Select Gallery',
  selectedGallery: _initialSelectedGallery,
  onSelect,
  onClose,
  selectable = true,
}: GalleryPickerModalProps) {
  void _initialSelectedGallery;
  const { fetchList, fetch, create, delete: deleteGallery, upload, removeImage, updateImage } = galleryOptions;

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [gallerySelectMode, setGallerySelectMode] = useState(false);
  const [selectedGalleryIds, setSelectedGalleryIds] = useState<Set<string>>(new Set());
  const [imageSelectMode, setImageSelectMode] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'gallery' | 'image'>('gallery');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newGalleryName, setNewGalleryName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [altValues, setAltValues] = useState<LocalizedString>({});
  const [activeLang, setActiveLang] = useState(languages[0]?.code || 'it');
  const [isSaving, setIsSaving] = useState(false);
  const newGalleryInputRef = useRef<HTMLInputElement>(null);

  const {
    uploading,
    isUploading,
    addFiles,
    cancelUpload,
    clearCompleted,
    uploadConfig: mergedUploadConfig,
  } = useUpload({
    upload: async (file, callbacks) => {
      if (!selectedGalleryItem) throw new Error('No gallery selected');
      const result = await upload(selectedGalleryItem.id, file, callbacks);
      return Array.isArray(result) ? result[0] : result;
    },
    config: DEFAULT_UPLOAD_CONFIG,
    onUploadComplete: (newItem) => {
      if (selectedGalleryItem) {
        setSelectedGalleryItem((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            images: [newItem as ImageItem, ...prev.images],
            imageCount: (prev.imageCount || 0) + 1,
          };
        });
      }
    },
  });

  const loadGalleries = useCallback(
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

        setGalleries((prev) => (append ? [...prev, ...newItems] : newItems));
        setHasMore(more);
      } catch (error) {
        console.error('Failed to fetch galleries:', error);
        setGalleries([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchList]
  );

  const loadGalleryDetail = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const gallery = await fetch(id);
        setSelectedGalleryItem(gallery);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    },
    [fetch]
  );

  useEffect(() => {
    if (viewMode === 'list') {
      const timer = setTimeout(() => {
        setPage(1);
        loadGalleries(search, 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [search, loadGalleries, viewMode]);

  useEffect(() => {
    if (isCreating && newGalleryInputRef.current) {
      newGalleryInputRef.current.focus();
    }
  }, [isCreating]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadGalleries(search, nextPage, true);
  };

  const handleGalleryClick = (gallery: GalleryItem) => {
    if (gallerySelectMode) {
      setSelectedGalleryIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(gallery.id)) {
          newSet.delete(gallery.id);
        } else {
          newSet.add(gallery.id);
        }
        return newSet;
      });
    } else {
      setViewMode('detail');
      loadGalleryDetail(gallery.id);
    }
  };

  const handleCreateGallery = async () => {
    if (!newGalleryName.trim()) return;
    
    setCreateLoading(true);
    try {
      const newGallery = await create(newGalleryName.trim());
      setGalleries((prev) => [newGallery, ...prev]);
      setIsCreating(false);
      setNewGalleryName('');
    } catch (error) {
      console.error('Failed to create gallery:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSelectAllGalleries = () => {
    if (selectedGalleryIds.size === galleries.length) {
      setSelectedGalleryIds(new Set());
    } else {
      setSelectedGalleryIds(new Set(galleries.map((g) => g.id)));
    }
  };

  const handleSelectAllImages = () => {
    if (!selectedGalleryItem) return;
    if (selectedImageIds.size === selectedGalleryItem.images.length) {
      setSelectedImageIds(new Set());
    } else {
      setSelectedImageIds(new Set(selectedGalleryItem.images.map((img) => img.id)));
    }
  };

  const handleToggleImageSelect = (image: ImageItem) => {
    setSelectedImageIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(image.id)) {
        newSet.delete(image.id);
      } else {
        newSet.add(image.id);
      }
      return newSet;
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteTarget === 'gallery') {
        const deletePromises = Array.from(selectedGalleryIds).map((id) => deleteGallery(id));
        await Promise.all(deletePromises);
        setGalleries((prev) => prev.filter((g) => !selectedGalleryIds.has(g.id)));
        setSelectedGalleryIds(new Set());
        setGallerySelectMode(false);
      } else {
        if (!selectedGalleryItem) return;
        const removePromises = Array.from(selectedImageIds).map((imageId) =>
          removeImage(selectedGalleryItem.id, imageId)
        );
        await Promise.all(removePromises);
        setSelectedGalleryItem((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            images: prev.images.filter((img) => !selectedImageIds.has(img.id)),
            imageCount: (prev.imageCount || prev.images.length) - selectedImageIds.size,
          };
        });
        setSelectedImageIds(new Set());
        setImageSelectMode(false);
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditAlt = (image: ImageItem) => {
    setEditingImage(image);
    setAltValues(image.alt || {});
    setActiveLang(languages[0]?.code || 'it');
    setViewMode('editImage');
  };

  const handleAltChange = (langCode: string, value: string) => {
    setAltValues((prev) => ({
      ...prev,
      [langCode]: value,
    }));
  };

  const handleSaveAlt = async () => {
    if (!selectedGalleryItem || !editingImage || !updateImage) return;

    setIsSaving(true);
    try {
      await updateImage(selectedGalleryItem.id, editingImage.id, { alt: altValues });
      setSelectedGalleryItem((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          images: prev.images.map((img) =>
            img.id === editingImage.id ? { ...img, alt: altValues } : img
          ),
        };
      });
      setViewMode('detail');
      setEditingImage(null);
      setAltValues({});
    } catch (error) {
      console.error('Failed to update alt text:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectGallery = () => {
    if (selectedGalleryItem && onSelect) {
      onSelect(selectedGalleryItem);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isAllGalleriesSelected = galleries.length > 0 && selectedGalleryIds.size === galleries.length;
  const isSomeGalleriesSelected = selectedGalleryIds.size > 0 && selectedGalleryIds.size < galleries.length;
  const isAllImagesSelected = selectedGalleryItem && selectedGalleryItem.images.length > 0 && selectedImageIds.size === selectedGalleryItem.images.length;
  const isSomeImagesSelected = selectedImageIds.size > 0 && selectedGalleryItem && selectedImageIds.size < selectedGalleryItem.images.length;

  // Edit Image View
  if (viewMode === 'editImage' && editingImage) {
    return (
      <Modal
        title="Edit Image Details"
        onClose={handleClose}
        headerLeft={
          <button
            type="button"
            onClick={() => {
              setViewMode('detail');
              setEditingImage(null);
              setAltValues({});
            }}
            className={styles.backButton}
            aria-label="Back to gallery"
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
              disabled={isSaving || !updateImage}
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
              src={editingImage.url}
              alt={editingImage.filename || ''}
              className={styles.editImage}
            />
          </div>

          <div className={styles.editInfo}>
            <div className={styles.editInfoRow}>
              <span className={styles.editInfoLabel}>Filename</span>
              <span className={styles.editInfoValue}>{editingImage.filename}</span>
            </div>
            {editingImage.width && editingImage.height && (
              <div className={styles.editInfoRow}>
                <span className={styles.editInfoLabel}>Dimensions</span>
                <span className={styles.editInfoValue}>
                  {editingImage.width}×{editingImage.height}
                </span>
              </div>
            )}
            {editingImage.size && (
              <div className={styles.editInfoRow}>
                <span className={styles.editInfoLabel}>Size</span>
                <span className={styles.editInfoValue}>
                  {formatFileSize(editingImage.size)}
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

  // Detail View
  if (viewMode === 'detail' && selectedGalleryItem) {
    const renderDetailFooter = () => {
      if (imageSelectMode) {
        return (
          <SelectionToolbar
            selectedCount={selectedImageIds.size}
            totalCount={selectedGalleryItem.images.length}
            onSelectAll={handleSelectAllImages}
            onCancel={() => {
              setImageSelectMode(false);
              setSelectedImageIds(new Set());
            }}
            onDelete={() => {
              setDeleteTarget('image');
              setShowDeleteConfirm(true);
            }}
            isAllSelected={!!isAllImagesSelected}
            isIndeterminate={!!isSomeImagesSelected}
            deleteLabel="Remove"
          />
        );
      }

      if (selectable) {
        return (
          <div className={styles.footer}>
            <div className={styles.footerInfo}>
              <span className={styles.footerText}>
                {selectedGalleryItem.images.length} {selectedGalleryItem.images.length === 1 ? 'image' : 'images'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSelectGallery}
              className={styles.selectButton}
            >
              Select this Gallery
            </button>
          </div>
        );
      }

      return undefined;
    };

    return (
      <Modal
        title={selectedGalleryItem.name}
        onClose={handleClose}
        headerLeft={
          <button
            type="button"
            onClick={() => {
              setViewMode('list');
              setSelectedGalleryItem(null);
            }}
            className={styles.backButton}
            aria-label="Back to galleries"
          >
            <ArrowLeft size={20} />
          </button>
        }
        headerActions={
          !imageSelectMode && typeof removeImage === 'function' ? (
            <button
              type="button"
              onClick={() => setImageSelectMode(true)}
              className={styles.selectModeButton}
            >
              Select Items
            </button>
          ) : undefined
        }
        toolbar={
          !imageSelectMode ? (
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
          ) : undefined
        }
        footer={renderDetailFooter()}
        overlay={
          showDeleteConfirm ? (
            <ConfirmDialog
              title="Remove Images"
              message={`Are you sure you want to remove ${selectedImageIds.size} ${selectedImageIds.size > 1 ? 'images' : 'image'} from this gallery?`}
              confirmLabel={isDeleting ? 'Removing...' : `Remove ${selectedImageIds.size} ${selectedImageIds.size > 1 ? 'images' : 'image'}`}
              onConfirm={handleConfirmDelete}
              onCancel={() => setShowDeleteConfirm(false)}
              loading={isDeleting}
              variant="danger"
            />
          ) : undefined
        }
        loading={loading}
        empty={!loading && selectedGalleryItem.images.length === 0}
        emptyMessage="No images in this gallery. Upload some images above."
      >
        <ImageGrid
          items={selectedGalleryItem.images}
          onSelect={() => {}}
          onEditAlt={updateImage ? handleEditAlt : undefined}
          manageMode={imageSelectMode}
          selectedIds={selectedImageIds}
          onToggleSelect={handleToggleImageSelect}
        />
      </Modal>
    );
  }

  // List View (default)
  const renderListFooter = () => {
    if (gallerySelectMode) {
      return (
        <SelectionToolbar
          selectedCount={selectedGalleryIds.size}
          totalCount={galleries.length}
          onSelectAll={handleSelectAllGalleries}
          onCancel={() => {
            setGallerySelectMode(false);
            setSelectedGalleryIds(new Set());
          }}
          onDelete={() => {
            setDeleteTarget('gallery');
            setShowDeleteConfirm(true);
          }}
          isAllSelected={isAllGalleriesSelected}
          isIndeterminate={isSomeGalleriesSelected}
        />
      );
    }
    return undefined;
  };

  return (
    <Modal
      title={title}
      onClose={handleClose}
      headerActions={
        !gallerySelectMode && typeof deleteGallery === 'function' ? (
          <button
            type="button"
            onClick={() => setGallerySelectMode(true)}
            className={styles.selectModeButton}
          >
            Select Items
          </button>
        ) : undefined
      }
      toolbar={
        !gallerySelectMode ? (
          <div className={styles.toolbar}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search galleries..."
              autoFocus
            />
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className={styles.createButton}
            >
              <Plus size={18} />
              New Gallery
            </button>
          </div>
        ) : undefined
      }
      footer={renderListFooter()}
      overlay={
        showDeleteConfirm ? (
          <ConfirmDialog
            title="Delete Galleries"
            message={`Are you sure you want to delete ${selectedGalleryIds.size} ${selectedGalleryIds.size > 1 ? 'galleries' : 'gallery'}? This action cannot be undone.`}
            confirmLabel={isDeleting ? 'Deleting...' : `Delete ${selectedGalleryIds.size} ${selectedGalleryIds.size > 1 ? 'galleries' : 'gallery'}`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteConfirm(false)}
            loading={isDeleting}
            variant="danger"
          />
        ) : undefined
      }
      loading={loading && galleries.length === 0}
      empty={!loading && galleries.length === 0}
      emptyMessage="No galleries found"
    >
      {isCreating && (
        <div className={styles.createForm}>
          <input
            ref={newGalleryInputRef}
            type="text"
            value={newGalleryName}
            onChange={(e) => setNewGalleryName(e.target.value)}
            placeholder="Gallery name..."
            className={styles.createInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateGallery();
              if (e.key === 'Escape') {
                setIsCreating(false);
                setNewGalleryName('');
              }
            }}
          />
          <button
            type="button"
            onClick={handleCreateGallery}
            disabled={!newGalleryName.trim() || createLoading}
            className={styles.createSubmitButton}
          >
            {createLoading ? <Loader2 size={16} className={styles.spinner} /> : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreating(false);
              setNewGalleryName('');
            }}
            className={styles.createCancelButton}
          >
            Cancel
          </button>
        </div>
      )}

      <div className={styles.galleryGrid}>
        {galleries.map((gallery) => {
          const isSelected = selectedGalleryIds.has(gallery.id);
          return (
            <div key={gallery.id} className={styles.galleryCard}>
              <button
                type="button"
                onClick={() => handleGalleryClick(gallery)}
                className={`${styles.galleryCardButton} ${gallerySelectMode && isSelected ? styles.selected : ''}`}
              >
                {gallerySelectMode && (
                  <div className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}>
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                )}
                <div className={styles.galleryCover}>
                  {gallery.coverImage ? (
                    <img
                      src={gallery.coverImage.thumbnailUrl || gallery.coverImage.url}
                      alt=""
                    />
                  ) : (
                    <div className={styles.galleryCoverPlaceholder} />
                  )}
                </div>
                <div className={styles.galleryInfo}>
                  <span className={styles.galleryName}>{gallery.name}</span>
                  <span className={styles.galleryCount}>
                    {gallery.imageCount ?? gallery.images.length} {(gallery.imageCount ?? gallery.images.length) === 1 ? 'image' : 'images'}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <LoadMoreButton onClick={handleLoadMore} loading={loading} />
      )}
    </Modal>
  );
}
