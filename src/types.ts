import type { ReactNode } from 'react';

// =============================================================================
// LANGUAGE CONFIGURATION
// =============================================================================

/**
 * Language configuration for multilingual fields
 */
export interface Language {
  code: string;
  label: string;
}

/**
 * Default languages when not specified
 */
export const DEFAULT_LANGUAGES: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' },
];

/**
 * Localized string value (e.g., { en: 'Hello', it: 'Ciao' })
 */
export type LocalizedString = Record<string, string | undefined>;

// =============================================================================
// IMAGE TYPES
// =============================================================================

/**
 * Image item - used both for API responses and stored values in Puck JSON
 */
export interface MediaImageItem {
  /** Unique identifier */
  id: string;
  /** Full URL to the image file */
  url: string;
  /** Original filename */
  filename?: string;
  /** Alt text (multilingual) */
  alt?: LocalizedString;
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
  /** File size in bytes */
  size?: number;
  /** Thumbnail URL for faster loading in picker (falls back to url if not provided) */
  thumbnailUrl?: string;
  /** Creation date (useful for cache invalidation) */
  createdAt?: string;
}

// =============================================================================
// DOCUMENT TYPES
// =============================================================================

/**
 * Document item - used both for API responses and stored values in Puck JSON
 */
export interface MediaDocumentItem {
  /** Unique identifier */
  id: string;
  /** Full URL to the document file */
  url: string;
  /** Original filename */
  filename: string;
  /** Display title (multilingual) */
  title?: LocalizedString;
  /** MIME type (e.g., 'application/pdf') */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** File extension (e.g., 'pdf', 'docx') */
  extension: string;
  /** Creation date (useful for cache invalidation) */
  createdAt?: string;
}

// =============================================================================
// GALLERY TYPES
// =============================================================================

/**
 * Gallery item - used both for API responses and stored values in Puck JSON
 */
export interface MediaGalleryItem {
  /** Unique identifier */
  id: string;
  /** Gallery name */
  name: string;
  /** Cover image for preview */
  coverImage?: MediaImageItem;
  /** Images in the gallery */
  images: MediaImageItem[];
  /** Number of images in the gallery (optional, can be calculated from images.length) */
  imageCount?: number;
  /** Creation date (useful for cache invalidation) */
  createdAt?: string;
}

// =============================================================================
// FETCH/UPLOAD TYPES
// =============================================================================

/**
 * Parameters passed to fetchList functions
 */
export interface FetchListParams {
  /** Search query string */
  query?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page */
  pageSize?: number;
  /** Additional filters */
  filters?: Record<string, unknown>;
}

/**
 * Result from fetchList - paginated result
 */
export interface FetchListResult<T> {
  /** Array of items */
  items: T[];
  /** Total number of items (for pagination) */
  total?: number;
  /** Whether there are more items to load */
  hasMore?: boolean;
}

/**
 * Generic fetch list function type
 */
export type FetchListFn<T> = (
  params: FetchListParams
) => Promise<T[] | FetchListResult<T>>;

/**
 * Callbacks passed to upload functions
 */
export interface UploadCallbacks {
  /** Called with upload progress (0-100) */
  onProgress: (percent: number) => void;
}

/**
 * Upload function that handles single or multiple files
 */
export type UploadFn<T> = (
  files: File | File[],
  callbacks: UploadCallbacks
) => Promise<T | T[]>;

/**
 * Configuration for file uploads
 */
export interface UploadConfig {
  /**
   * Accepted file types (MIME types or extensions)
   * @default 'image/*' for images, '*' for documents
   */
  accept?: string;

  /**
   * Maximum file size in bytes
   * @default 10485760 (10MB)
   */
  maxSize?: number;

  /**
   * Allow multiple file uploads
   * @default true
   */
  multiple?: boolean;
}

/**
 * Status of a file being uploaded
 */
export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'error';

/**
 * State of a file in the upload queue
 */
export interface UploadingFile {
  /** Unique ID for this upload */
  id: string;
  /** The file being uploaded */
  file: File;
  /** Upload progress (0-100) */
  progress: number;
  /** Current upload status */
  status: UploadStatus;
  /** Error message if status is 'error' */
  error?: string;
  /** Resulting item if status is 'completed' */
  result?: MediaImageItem | MediaDocumentItem;
  /** Preview URL for the file (blob URL) */
  previewUrl?: string;
}

// =============================================================================
// PLUGIN OPTIONS
// =============================================================================

/**
 * Image-related callbacks
 */
export interface MediaImageOptions {
  /** Function to fetch image list from your API */
  fetchList: FetchListFn<MediaImageItem>;
  /** Function to upload images (optional) */
  upload?: UploadFn<MediaImageItem>;
  /** Function to update image metadata (alt text) */
  update?: (id: string, data: { alt?: LocalizedString }) => Promise<MediaImageItem>;
  /** Function to delete an image (optional) */
  delete?: (id: string) => Promise<void>;
  /** Configuration for file uploads */
  uploadConfig?: UploadConfig;
}

/**
 * Gallery-related callbacks
 */
export interface MediaGalleryOptions {
  /** Function to fetch gallery list from your API (required) */
  fetchList: FetchListFn<MediaGalleryItem>;
  /** Function to fetch a single gallery by ID */
  fetch: (id: string) => Promise<MediaGalleryItem>;
  /** Function to create a new gallery */
  create: (name: string) => Promise<MediaGalleryItem>;
  /** Function to delete a gallery */
  delete: (id: string) => Promise<void>;
  /** Function to upload images to a gallery */
  upload: (
    galleryId: string,
    files: File | File[],
    callbacks: UploadCallbacks
  ) => Promise<MediaImageItem | MediaImageItem[]>;
  /** Function to remove an image from a gallery */
  removeImage: (galleryId: string, imageId: string) => Promise<void>;
  /** Function to update image metadata within a gallery (optional - hides alt editing if not provided) */
  updateImage?: (
    galleryId: string,
    imageId: string,
    data: { alt?: LocalizedString }
  ) => Promise<MediaImageItem>;
}

/**
 * Document-related callbacks
 */
export interface MediaDocumentOptions {
  /** Function to fetch document list from your API */
  fetchList: FetchListFn<MediaDocumentItem>;
  /** Function to upload documents (optional - hides upload area if not provided) */
  upload?: UploadFn<MediaDocumentItem>;
  /** Function to update document metadata (title) (optional - hides edit icon if not provided) */
  update?: (id: string, data: { title?: LocalizedString }) => Promise<MediaDocumentItem>;
  /** Function to delete a document (optional - hides manage button if not provided) */
  delete?: (id: string) => Promise<void>;
  /** Configuration for file uploads */
  uploadConfig?: UploadConfig;
}

/**
 * Plugin configuration options
 */
export interface MediaPluginOptions {
  /**
   * Languages for multilingual fields (alt, title)
   * @default [{ code: 'it', label: 'Italiano' }, { code: 'en', label: 'English' }]
   */
  languages?: Language[];

  /**
   * Image-related configuration (required)
   */
  mediaImage: MediaImageOptions;

  /**
   * Gallery-related configuration (optional)
   */
  mediaGallery?: MediaGalleryOptions;

  /**
   * Document-related configuration (optional)
   */
  mediaDocument?: MediaDocumentOptions;
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Internal props passed to MediaImageField component
 */
export interface MediaImageFieldProps {
  name: string;
  value: MediaImageItem | null;
  onChange: (value: MediaImageItem | null) => void;
  field: {
    label?: string;
    [key: string]: unknown;
  };
  languages: Language[];
  imageOptions: MediaImageOptions;
}

/**
 * Internal props passed to MediaGalleryField component
 */
export interface MediaGalleryFieldProps {
  name: string;
  value: MediaGalleryItem | null;
  onChange: (value: MediaGalleryItem | null) => void;
  field: {
    label?: string;
    [key: string]: unknown;
  };
  languages: Language[];
  galleryOptions: MediaGalleryOptions;
}

/**
 * Internal props passed to MediaDocumentField component
 */
export interface MediaDocumentFieldProps {
  name: string;
  value: MediaDocumentItem | null;
  onChange: (value: MediaDocumentItem | null) => void;
  field: {
    label?: string;
    [key: string]: unknown;
  };
  languages: Language[];
  documentOptions: MediaDocumentOptions;
}

/**
 * Props for MediaImagePickerModal component
 */
export interface MediaImagePickerModalProps {
  languages: Language[];
  imageOptions: MediaImageOptions;
  title?: string;
  selectedImage?: MediaImageItem | null;
  onSelect?: (item: MediaImageItem) => void;
  onClose: () => void;
  /** When false, hides the "Select Image" button. Useful for media library mode. Default: true */
  selectable?: boolean;
}

/**
 * Props for MediaGalleryPickerModal component
 */
export interface MediaGalleryPickerModalProps {
  languages: Language[];
  galleryOptions: MediaGalleryOptions;
  title?: string;
  selectedGallery?: MediaGalleryItem | null;
  onSelect?: (gallery: MediaGalleryItem) => void;
  onClose: () => void;
  /** When false, hides the "Select Gallery" button. Useful for media library mode. Default: true */
  selectable?: boolean;
}

/**
 * Props for MediaDocumentPickerModal component
 */
export interface MediaDocumentPickerModalProps {
  languages: Language[];
  documentOptions: MediaDocumentOptions;
  title?: string;
  selectedDocument?: MediaDocumentItem | null;
  onSelect?: (item: MediaDocumentItem) => void;
  onClose: () => void;
  /** When false, hides the "Select Document" button. Useful for media library mode. Default: true */
  selectable?: boolean;
}

/**
 * Props for MediaImageGrid component
 */
export interface MediaImageGridProps {
  items: MediaImageItem[];
  onSelect: (item: MediaImageItem) => void;
  selectedId?: string;
  loading?: boolean;
  /** Callback when user clicks edit icon */
  onEditAlt?: (item: MediaImageItem) => void;
  /** Whether manage mode is active (for bulk delete) */
  manageMode?: boolean;
  /** Set of selected item IDs for bulk operations */
  selectedIds?: Set<string>;
  /** Callback when user toggles selection in manage mode */
  onToggleSelect?: (item: MediaImageItem) => void;
}

/**
 * Props for GalleryList component
 */
export interface GalleryListProps {
  items: MediaGalleryItem[];
  onSelect: (item: MediaGalleryItem) => void;
  onDelete?: (item: MediaGalleryItem) => void;
  selectedId?: string;
  loading?: boolean;
}

/**
 * Props for DocumentList component
 */
export interface DocumentListProps {
  items: MediaDocumentItem[];
  onSelect: (item: MediaDocumentItem) => void;
  selectedId?: string;
  loading?: boolean;
}

// =============================================================================
// PUCK PLUGIN TYPE
// =============================================================================

/**
 * Puck Plugin type
 */
export interface PuckPlugin {
  name: string;
  label?: string;
  icon?: ReactNode;
  render?: () => ReactNode;
  overrides?: {
    fieldTypes?: Record<string, (props: unknown) => ReactNode>;
    [key: string]: unknown;
  };
}
