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
  { code: 'it', label: 'Italiano' },
  { code: 'en', label: 'English' },
];

/**
 * Localized string value (e.g., { it: 'Ciao', en: 'Hello' })
 */
export type LocalizedString = Record<string, string | undefined>;

// =============================================================================
// IMAGE TYPES
// =============================================================================

/**
 * Image item - used both for API responses and stored values in Puck JSON
 */
export interface ImageItem {
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
export interface DocumentItem {
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
export interface GalleryItem {
  /** Unique identifier */
  id: string;
  /** Gallery name */
  name: string;
  /** Cover image for preview */
  coverImage?: ImageItem;
  /** Images in the gallery */
  images: ImageItem[];
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
  result?: ImageItem | DocumentItem;
  /** Preview URL for the file (blob URL) */
  previewUrl?: string;
}

// =============================================================================
// PLUGIN OPTIONS
// =============================================================================

/**
 * Image-related callbacks
 */
export interface ImageOptions {
  /** Function to fetch image list from your API */
  fetchList: FetchListFn<ImageItem>;
  /** Function to upload images (optional) */
  upload?: UploadFn<ImageItem>;
  /** Function to update image metadata (alt text) */
  update?: (id: string, data: { alt?: LocalizedString }) => Promise<ImageItem>;
  /** Function to delete an image (optional) */
  delete?: (id: string) => Promise<void>;
  /** Configuration for file uploads */
  uploadConfig?: UploadConfig;
}

/**
 * Gallery-related callbacks
 */
export interface GalleryOptions {
  /** Function to fetch gallery list from your API (required) */
  fetchList: FetchListFn<GalleryItem>;
  /** Function to fetch a single gallery by ID */
  fetch: (id: string) => Promise<GalleryItem>;
  /** Function to create a new gallery */
  create: (name: string) => Promise<GalleryItem>;
  /** Function to delete a gallery */
  delete: (id: string) => Promise<void>;
  /** Function to upload images to a gallery */
  upload: (
    galleryId: string,
    files: File | File[],
    callbacks: UploadCallbacks
  ) => Promise<ImageItem | ImageItem[]>;
  /** Function to remove an image from a gallery */
  removeImage: (galleryId: string, imageId: string) => Promise<void>;
  /** Function to update image metadata within a gallery (optional - hides alt editing if not provided) */
  updateImage?: (
    galleryId: string,
    imageId: string,
    data: { alt?: LocalizedString }
  ) => Promise<ImageItem>;
}

/**
 * Document-related callbacks
 */
export interface DocumentOptions {
  /** Function to fetch document list from your API */
  fetchList: FetchListFn<DocumentItem>;
  /** Function to upload documents (optional - hides upload area if not provided) */
  upload?: UploadFn<DocumentItem>;
  /** Function to update document metadata (title) (optional - hides edit icon if not provided) */
  update?: (id: string, data: { title?: LocalizedString }) => Promise<DocumentItem>;
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
  image: ImageOptions;

  /**
   * Gallery-related configuration (optional)
   */
  gallery?: GalleryOptions;

  /**
   * Document-related configuration (optional)
   */
  document?: DocumentOptions;
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Internal props passed to ImageField component
 */
export interface ImageFieldProps {
  name: string;
  value: ImageItem | null;
  onChange: (value: ImageItem | null) => void;
  field: {
    label?: string;
    [key: string]: unknown;
  };
  languages: Language[];
  imageOptions: ImageOptions;
}

/**
 * Internal props passed to GalleryField component
 */
export interface GalleryFieldProps {
  name: string;
  value: GalleryItem | null;
  onChange: (value: GalleryItem | null) => void;
  field: {
    label?: string;
    [key: string]: unknown;
  };
  languages: Language[];
  galleryOptions: GalleryOptions;
}

/**
 * Internal props passed to DocumentField component
 */
export interface DocumentFieldProps {
  name: string;
  value: DocumentItem | null;
  onChange: (value: DocumentItem | null) => void;
  field: {
    label?: string;
    [key: string]: unknown;
  };
  languages: Language[];
  documentOptions: DocumentOptions;
}

/**
 * Props for ImagePickerModal component
 */
export interface ImagePickerModalProps {
  languages: Language[];
  imageOptions: ImageOptions;
  title?: string;
  selectedImage?: ImageItem | null;
  onSelect?: (item: ImageItem) => void;
  onClose: () => void;
  /** When false, hides the "Select Image" button. Useful for media library mode. Default: true */
  selectable?: boolean;
}

/**
 * Props for GalleryPickerModal component
 */
export interface GalleryPickerModalProps {
  languages: Language[];
  galleryOptions: GalleryOptions;
  title?: string;
  selectedGallery?: GalleryItem | null;
  onSelect?: (gallery: GalleryItem) => void;
  onClose: () => void;
  /** When false, hides the "Select Gallery" button. Useful for media library mode. Default: true */
  selectable?: boolean;
}

/**
 * Props for DocumentPickerModal component
 */
export interface DocumentPickerModalProps {
  languages: Language[];
  documentOptions: DocumentOptions;
  title?: string;
  selectedDocument?: DocumentItem | null;
  onSelect?: (item: DocumentItem) => void;
  onClose: () => void;
  /** When false, hides the "Select Document" button. Useful for media library mode. Default: true */
  selectable?: boolean;
}

/**
 * Props for ImageGrid component
 */
export interface ImageGridProps {
  items: ImageItem[];
  onSelect: (item: ImageItem) => void;
  selectedId?: string;
  loading?: boolean;
  /** Callback when user clicks edit icon */
  onEditAlt?: (item: ImageItem) => void;
  /** Whether manage mode is active (for bulk delete) */
  manageMode?: boolean;
  /** Set of selected item IDs for bulk operations */
  selectedIds?: Set<string>;
  /** Callback when user toggles selection in manage mode */
  onToggleSelect?: (item: ImageItem) => void;
}

/**
 * Props for GalleryList component
 */
export interface GalleryListProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
  onDelete?: (item: GalleryItem) => void;
  selectedId?: string;
  loading?: boolean;
}

/**
 * Props for DocumentList component
 */
export interface DocumentListProps {
  items: DocumentItem[];
  onSelect: (item: DocumentItem) => void;
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
