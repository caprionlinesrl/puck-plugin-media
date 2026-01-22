# @caprionlinesrl/puck-plugin-media

A Puck plugin for media management with support for images, galleries, and documents.

## Features

- **Image Field** - Select images with upload, multilingual alt text, and bulk delete
- **Gallery Field** - Create and manage image galleries with drag & drop upload
- **Document Field** - Upload and manage documents with multilingual titles
- **Media Panel** - Browse and manage all media directly in Puck's sidebar
- **Upload Support** - Drag & drop with progress tracking and file validation
- **Multilingual** - Alt text and titles in multiple languages
- **Search & Pagination** - Filter and load more items
- **Manage Mode** - Bulk select and delete items
- **Fully Typed** - Complete TypeScript support

## Installation

```bash
npm install @caprionlinesrl/puck-plugin-media
# or
yarn add @caprionlinesrl/puck-plugin-media
```

## Quick Start

### 1. Create the plugin

```tsx
import { createMediaPlugin } from '@caprionlinesrl/puck-plugin-media';

const mediaPlugin = createMediaPlugin({
  languages: [
    { code: 'it', label: 'Italiano' },
    { code: 'en', label: 'English' },
  ],

  image: {
    fetchList: async ({ query, page, pageSize }) => {
      const res = await fetch(`/api/images?q=${query || ''}&page=${page}&limit=${pageSize}`);
      const data = await res.json();
      return { items: data.items, hasMore: data.hasMore };
    },
    upload: async (file, { onProgress }) => {
      // Upload implementation with progress callback
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/images/upload', { method: 'POST', body: formData });
      return res.json();
    },
    update: async (id, data) => {
      const res = await fetch(`/api/images/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id) => {
      await fetch(`/api/images/${id}`, { method: 'DELETE' });
    },
  },

  // Optional: Gallery support
  gallery: {
    fetchList: async (params) => { /* ... */ },
    fetch: async (id) => { /* ... */ },
    create: async (name) => { /* ... */ },
    delete: async (id) => { /* ... */ },
    upload: async (galleryId, file, callbacks) => { /* ... */ },
    removeImage: async (galleryId, imageId) => { /* ... */ },
    updateImage: async (galleryId, imageId, data) => { /* ... */ },
  },

  // Optional: Document support
  document: {
    fetchList: async (params) => { /* ... */ },
    upload: async (file, callbacks) => { /* ... */ },
    update: async (id, data) => { /* ... */ },
    delete: async (id) => { /* ... */ },
  },
});
```

### 2. Add to Puck

```tsx
import { Puck } from '@puckeditor/core';
import '@caprionlinesrl/puck-plugin-media/styles.css';

<Puck
  config={config}
  data={pageData}
  plugins={[mediaPlugin]}
/>
```

### 3. Use fields in your blocks

```tsx
const config = {
  components: {
    Hero: {
      fields: {
        backgroundImage: {
          type: 'image',
          label: 'Background Image',
        },
        title: {
          type: 'text',
          label: 'Title',
        },
      },
      render: ({ backgroundImage, title }) => (
        <div style={{ backgroundImage: `url(${backgroundImage?.url})` }}>
          <h1>{title}</h1>
        </div>
      ),
    },
    
    PhotoGallery: {
      fields: {
        gallery: {
          type: 'gallery',
          label: 'Photo Gallery',
        },
      },
      render: ({ gallery }) => (
        <div className="gallery">
          {gallery?.images.map((img) => (
            <img key={img.id} src={img.url} alt={img.alt?.en || ''} />
          ))}
        </div>
      ),
    },
    
    Download: {
      fields: {
        document: {
          type: 'document',
          label: 'Download File',
        },
      },
      render: ({ document }) => (
        <a href={document?.url} download>
          {document?.title?.en || document?.filename}
        </a>
      ),
    },
  },
};
```

## Configuration

### Languages

```typescript
interface Language {
  code: string;   // e.g., 'en', 'it', 'de'
  label: string;  // e.g., 'English', 'Italiano', 'Deutsch'
}

// Default languages if not specified
const DEFAULT_LANGUAGES = [
  { code: 'it', label: 'Italiano' },
  { code: 'en', label: 'English' },
];
```

### Image Options

```typescript
interface ImageOptions {
  // Required: Fetch paginated list of images
  fetchList: (params: FetchListParams) => Promise<ImageItem[] | FetchListResult<ImageItem>>;
  
  // Optional: Upload new images
  upload?: (file: File, callbacks: UploadCallbacks) => Promise<ImageItem | ImageItem[]>;
  
  // Optional: Update image metadata (alt text)
  update?: (id: string, data: { alt?: LocalizedString }) => Promise<ImageItem>;
  
  // Optional: Delete an image (enables Manage mode)
  delete?: (id: string) => Promise<void>;
  
  // Optional: Upload configuration
  uploadConfig?: UploadConfig;
}
```

### Gallery Options

```typescript
interface GalleryOptions {
  // Required: Fetch paginated list of galleries
  fetchList: (params: FetchListParams) => Promise<GalleryItem[] | FetchListResult<GalleryItem>>;
  
  // Required: Fetch single gallery with all images
  fetch: (id: string) => Promise<GalleryItem>;
  
  // Required: Create a new gallery
  create: (name: string) => Promise<GalleryItem>;
  
  // Optional: Delete a gallery (enables Manage mode)
  delete?: (id: string) => Promise<void>;
  
  // Required: Upload images to a gallery
  upload: (galleryId: string, file: File, callbacks: UploadCallbacks) => Promise<ImageItem | ImageItem[]>;
  
  // Optional: Remove an image from a gallery (enables image Manage mode)
  removeImage?: (galleryId: string, imageId: string) => Promise<void>;
  
  // Optional: Update image metadata within a gallery
  updateImage?: (galleryId: string, imageId: string, data: { alt?: LocalizedString }) => Promise<ImageItem>;
}
```

### Document Options

```typescript
interface DocumentOptions {
  // Required: Fetch paginated list of documents
  fetchList: (params: FetchListParams) => Promise<DocumentItem[] | FetchListResult<DocumentItem>>;
  
  // Optional: Upload new documents
  upload?: (file: File, callbacks: UploadCallbacks) => Promise<DocumentItem | DocumentItem[]>;
  
  // Optional: Update document metadata (title)
  update?: (id: string, data: { title?: LocalizedString }) => Promise<DocumentItem>;
  
  // Optional: Delete a document (enables Manage mode)
  delete?: (id: string) => Promise<void>;
  
  // Optional: Upload configuration
  uploadConfig?: UploadConfig;
}
```

### Upload Configuration

```typescript
interface UploadConfig {
  // Accepted file types (default: 'image/*' for images, common doc types for documents)
  accept?: string;
  
  // Maximum file size in bytes (default: 10MB for images, 20MB for documents)
  maxSize?: number;
  
  // Allow multiple file selection (default: true)
  multiple?: boolean;
}
```

## Types

### ImageItem

```typescript
interface ImageItem {
  id: string;
  url: string;
  filename?: string;
  alt?: LocalizedString;      // { it: 'Testo alt', en: 'Alt text' }
  width?: number;
  height?: number;
  size?: number;              // File size in bytes
  thumbnailUrl?: string;      // For faster loading in grids
  createdAt?: string;
}
```

### GalleryItem

```typescript
interface GalleryItem {
  id: string;
  name: string;
  coverImage?: ImageItem;
  images: ImageItem[];
  imageCount?: number;
  createdAt?: string;
}
```

### DocumentItem

```typescript
interface DocumentItem {
  id: string;
  url: string;
  filename: string;
  title?: LocalizedString;    // { it: 'Titolo', en: 'Title' }
  mimeType: string;           // e.g., 'application/pdf'
  size: number;               // File size in bytes
  extension: string;          // e.g., 'pdf', 'docx'
  createdAt?: string;
}
```

### LocalizedString

```typescript
interface LocalizedString {
  [languageCode: string]: string;
}

// Example
const alt: LocalizedString = {
  it: 'Tramonto sulla costa',
  en: 'Coastal sunset',
};
```

### FetchListParams

```typescript
interface FetchListParams {
  query?: string;     // Search query
  page?: number;      // Page number (1-indexed)
  pageSize?: number;  // Items per page (default: 20)
}
```

### FetchListResult

```typescript
interface FetchListResult<T> {
  items: T[];
  total?: number;
  hasMore?: boolean;
}
```

### UploadCallbacks

```typescript
interface UploadCallbacks {
  onProgress?: (percent: number) => void;
}
```

## Components

For advanced customization, you can import individual components:

```typescript
import {
  // Fields (for custom block configurations)
  ImageField,
  GalleryField,
  DocumentField,
  
  // Modals (for custom implementations)
  ImagePickerModal,
  GalleryPickerModal,
  DocumentPickerModal,
  
  // Media Panel (shown in Puck sidebar)
  MediaPanel,
  
  // Upload components
  UploadDropzone,
  UploadQueue,
  
  // Hook
  useUpload,
  formatFileSize,
} from '@caprionlinesrl/puck-plugin-media';
```

## Styling

The plugin uses CSS Modules with vanilla CSS that matches Puck's design language. Import the styles in your app:

```tsx
import '@caprionlinesrl/puck-plugin-media/styles.css';
```

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- React 18+
- Puck 0.21+

## License

MIT
