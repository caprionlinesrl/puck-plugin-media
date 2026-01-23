import { useState, useEffect, useCallback } from 'react';
import { FileText, File, ArrowLeft, Loader2, Check, Pencil } from 'lucide-react';
import { Modal } from '../Modal';
import { SearchBar } from '../SearchBar';
import { LoadMoreButton } from '../LoadMoreButton';
import { ConfirmDialog } from '../ConfirmDialog';
import { SelectionToolbar } from '../SelectionToolbar';
import { UploadDropzone } from '../UploadDropzone/UploadDropzone';
import { UploadQueue } from '../UploadQueue/UploadQueue';
import { useUpload, formatFileSize } from '../../hooks/useUpload';
import type { MediaDocumentPickerModalProps, MediaDocumentItem, LocalizedString } from '../../types';
import styles from './DocumentPickerModal.module.css';

type ViewMode = 'picker' | 'edit';

const DEFAULT_UPLOAD_CONFIG = {
  accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
  maxSize: 20 * 1024 * 1024,
  multiple: true,
};

const PAGE_SIZE = 20;

export function MediaDocumentPickerModal({
  languages,
  documentOptions,
  title = 'Select Document',
  selectedDocument,
  onSelect,
  onClose,
  selectable = true,
}: MediaDocumentPickerModalProps) {
  const { fetchList, upload, update, delete: deleteDocument, uploadConfig } = documentOptions;

  const [view, setView] = useState<ViewMode>('picker');
  const [editingItem, setEditingItem] = useState<MediaDocumentItem | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<MediaDocumentItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaDocumentItem | null>(null);
  const [titleValues, setTitleValues] = useState<LocalizedString>({});
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
      setItems((prev) => [newItem as MediaDocumentItem, ...prev]);
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
        console.error('Failed to fetch documents:', error);
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
    if (selectedDocument) {
      const existingItem = items.find((item) => item.id === selectedDocument.id);
      if (existingItem) {
        setSelectedItem(existingItem);
      }
    }
  }, [selectedDocument, items]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadItems(search, nextPage, true);
  };

  const handleDocumentClick = (item: MediaDocumentItem) => {
    if (selectMode) {
      setSelectedForDelete((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    } else {
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      } else {
        setSelectedItem(item);
      }
    }
  };

  const handleConfirmSelection = () => {
    if (!selectedItem || !onSelect) return;
    onSelect(selectedItem);
  };

  const handleEditTitle = (item: MediaDocumentItem) => {
    setEditingItem(item);
    setTitleValues(item.title || {});
    setActiveLang(languages[0]?.code || 'it');
    setView('edit');
  };

  const handleTitleChange = (langCode: string, value: string) => {
    setTitleValues((prev) => ({
      ...prev,
      [langCode]: value,
    }));
  };

  const handleSaveTitle = async () => {
    if (!editingItem || !update) return;

    setIsSaving(true);
    try {
      await update(editingItem.id, { title: titleValues });
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, title: titleValues } : item
        )
      );
      if (selectedItem?.id === editingItem.id) {
        setSelectedItem((prev) => prev ? { ...prev, title: titleValues } : null);
      }
      setView('picker');
      setEditingItem(null);
      setTitleValues({});
    } catch (error) {
      console.error('Failed to update title:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedForDelete.size === items.length) {
      setSelectedForDelete(new Set());
    } else {
      setSelectedForDelete(new Set(items.map((item) => item.id)));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDocument || selectedForDelete.size === 0) return;

    setIsDeleting(true);
    try {
      const deletePromises = Array.from(selectedForDelete).map((id) => deleteDocument(id));
      await Promise.all(deletePromises);

      setItems((prev) => prev.filter((item) => !selectedForDelete.has(item.id)));
      
      if (selectedItem && selectedForDelete.has(selectedItem.id)) {
        setSelectedItem(null);
      }

      setShowDeleteConfirm(false);
      setSelectedForDelete(new Set());
      setSelectMode(false);
    } catch (error) {
      console.error('Failed to delete documents:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <FileText size={20} className={styles.pdfIcon} />;
    }
    return <File size={20} className={styles.fileIcon} />;
  };

  const isAllSelected = items.length > 0 && selectedForDelete.size === items.length;
  const isSomeSelected = selectedForDelete.size > 0 && selectedForDelete.size < items.length;

  // Edit View
  if (view === 'edit' && editingItem) {
    return (
      <Modal
        title="Edit Document Details"
        onClose={handleClose}
        size="small"
        headerLeft={
          <button
            type="button"
            onClick={() => {
              setView('picker');
              setEditingItem(null);
              setTitleValues({});
            }}
            className={styles.backButton}
            aria-label="Back to list"
          >
            <ArrowLeft size={20} />
          </button>
        }
        footer={
          <div className={styles.editFooter}>
            <div />
            <button
              type="button"
              onClick={handleSaveTitle}
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
            <div className={styles.editIcon}>
              {getIcon(editingItem.mimeType)}
            </div>
          </div>

          <div className={styles.editInfo}>
            <div className={styles.editInfoRow}>
              <span className={styles.editInfoLabel}>Filename</span>
              <span className={styles.editInfoValue}>{editingItem.filename}</span>
            </div>
            <div className={styles.editInfoRow}>
              <span className={styles.editInfoLabel}>Type</span>
              <span className={styles.editInfoValue}>
                {editingItem.extension?.toUpperCase()}
              </span>
            </div>
            <div className={styles.editInfoRow}>
              <span className={styles.editInfoLabel}>Size</span>
              <span className={styles.editInfoValue}>
                {formatFileSize(editingItem.size)}
              </span>
            </div>
          </div>

          <div className={styles.editField}>
            <div className={styles.editFieldHeader}>
              <label className={styles.editFieldLabel}>Title</label>
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
              value={titleValues[activeLang] || ''}
              onChange={(e) => handleTitleChange(activeLang, e.target.value)}
              placeholder={`Title in ${languages.find(l => l.code === activeLang)?.label || activeLang}...`}
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
            <div className={styles.footerIcon}>
              {getIcon(selectedItem.mimeType)}
            </div>
            <span className={styles.footerFilename}>
              {selectedItem.filename}
            </span>
            <span className={styles.footerMeta}>
              {selectedItem.extension?.toUpperCase()} - {formatFileSize(selectedItem.size)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleConfirmSelection}
            className={styles.selectButton}
          >
            Select Document
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
      size="small"
      headerActions={
        !selectMode && deleteDocument ? (
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
            placeholder="Search documents..."
            autoFocus={!selectMode}
          />
        </div>
      }
      footer={renderFooter()}
      overlay={
        showDeleteConfirm ? (
          <ConfirmDialog
            title="Delete Documents"
            message={`Are you sure you want to delete ${selectedForDelete.size} document${selectedForDelete.size > 1 ? 's' : ''}? This action cannot be undone.`}
            confirmLabel={isDeleting ? 'Deleting...' : `Delete ${selectedForDelete.size} document${selectedForDelete.size > 1 ? 's' : ''}`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteConfirm(false)}
            loading={isDeleting}
            variant="danger"
          />
        ) : undefined
      }
      loading={loading && items.length === 0}
      empty={!loading && items.length === 0}
      emptyMessage="No documents found"
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

      <div className={styles.documentList}>
        {items.map((item) => {
          const isSelected = selectMode 
            ? selectedForDelete.has(item.id)
            : selectedItem?.id === item.id;
          
          return (
            <div key={item.id} className={styles.documentItemContainer}>
              <button
                type="button"
                onClick={() => handleDocumentClick(item)}
                className={`${styles.documentItem} ${isSelected ? styles.selected : ''}`}
              >
                {selectMode && (
                  <div className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}>
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                )}
                <div className={styles.documentIcon}>
                  {getIcon(item.mimeType)}
                </div>
                <div className={styles.documentInfo}>
                  <span className={styles.documentName}>
                    {item.title?.[languages[0]?.code] || item.filename}
                  </span>
                  <span className={styles.documentMeta}>
                    {item.extension?.toUpperCase()} - {formatFileSize(item.size)}
                  </span>
                </div>
                {!selectMode && selectedItem?.id === item.id && (
                  <div className={styles.checkmark}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
              {!selectMode && update && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTitle(item);
                  }}
                  className={styles.editButton}
                  aria-label="Edit title"
                >
                  <Pencil size={14} />
                </button>
              )}
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
