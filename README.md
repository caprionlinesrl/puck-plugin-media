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

#### Option A: Using mock data (for demos/prototyping)

```tsx
import { createMediaPlugin } from '@caprionlinesrl/puck-plugin-media';
import { mockMediaConfig } from '@caprionlinesrl/puck-plugin-media/mocks';

// One-liner with mock data
const mediaPlugin = createMediaPlugin(mockMediaConfig);

// Or with custom options
const mediaPlugin = createMediaPlugin({
  ...mockMediaConfig,
  languages: [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
  ],
  mediaImage: {
    ...mockMediaConfig.mediaImage,
    uploadConfig: {
      accept: 'image/jpeg,image/png,image/webp',
      maxSize: 10 * 1024 * 1024, // 10MB
    },
  },
});
```

#### Option B: With your own API

```tsx
import { createMediaPlugin } from '@caprionlinesrl/puck-plugin-media';

const mediaPlugin = createMediaPlugin({
  languages: [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
  ],

  mediaImage: {
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
  mediaGallery: {
    fetchList: async (params) => { /* ... */ },
    fetch: async (id) => { /* ... */ },
    create: async (name) => { /* ... */ },
    delete: async (id) => { /* ... */ },
    upload: async (galleryId, file, callbacks) => { /* ... */ },
    removeImage: async (galleryId, imageId) => { /* ... */ },
    updateImage: async (galleryId, imageId, data) => { /* ... */ },
  },

  // Optional: Document support
  mediaDocument: {
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
          type: 'mediaImage',
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
          type: 'mediaGallery',
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
          type: 'mediaDocument',
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

## Mock Data

The plugin includes mock data for quick prototyping and demos. Import from the `/mocks` subpath:

```tsx
import { mockMediaConfig } from '@caprionlinesrl/puck-plugin-media/mocks';
```

`mockMediaConfig` provides:
- **12 sample images** from Unsplash with multilingual alt text
- **3 sample galleries** (Landscapes, Team, Portfolio)
- **4 sample documents** (PDF files)
- Full CRUD operations (in-memory, resets on page reload)
- Simulated upload with progress
- Search and pagination support

This is useful for:
- Quick demos and prototypes
- Testing your Puck configuration
- Development without a backend

> **Note:** Mock data is stored in memory and will reset on page reload.

## Configuration

### Languages

```typescript
interface Language {
  code: string;   // e.g., 'en', 'it', 'de'
  label: string;  // e.g., 'English', 'Italiano', 'Deutsch'
}

// Default languages if not specified
const DEFAULT_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' },
];
```

### MediaImageOptions

```typescript
interface MediaImageOptions {
  // Required: Fetch paginated list of images
  fetchList: (params: FetchListParams) => Promise<MediaImageItem[] | FetchListResult<MediaImageItem>>;
  
  // Optional: Upload new images
  upload?: (file: File, callbacks: UploadCallbacks) => Promise<MediaImageItem | MediaImageItem[]>;
  
  // Optional: Update image metadata (alt text)
  update?: (id: string, data: { alt?: LocalizedString }) => Promise<MediaImageItem>;
  
  // Optional: Delete an image (enables Manage mode)
  delete?: (id: string) => Promise<void>;
  
  // Optional: Upload configuration
  uploadConfig?: UploadConfig;
}
```

### MediaGalleryOptions

```typescript
interface MediaGalleryOptions {
  // Required: Fetch paginated list of galleries
  fetchList: (params: FetchListParams) => Promise<MediaGalleryItem[] | FetchListResult<MediaGalleryItem>>;
  
  // Required: Fetch single gallery with all images
  fetch: (id: string) => Promise<MediaGalleryItem>;
  
  // Required: Create a new gallery
  create: (name: string) => Promise<MediaGalleryItem>;
  
  // Optional: Delete a gallery (enables Manage mode)
  delete?: (id: string) => Promise<void>;
  
  // Required: Upload images to a gallery
  upload: (galleryId: string, file: File, callbacks: UploadCallbacks) => Promise<MediaImageItem | MediaImageItem[]>;
  
  // Optional: Remove an image from a gallery (enables image Manage mode)
  removeImage?: (galleryId: string, imageId: string) => Promise<void>;
  
  // Optional: Update image metadata within a gallery
  updateImage?: (galleryId: string, imageId: string, data: { alt?: LocalizedString }) => Promise<MediaImageItem>;
}
```

### MediaDocumentOptions

```typescript
interface MediaDocumentOptions {
  // Required: Fetch paginated list of documents
  fetchList: (params: FetchListParams) => Promise<MediaDocumentItem[] | FetchListResult<MediaDocumentItem>>;
  
  // Optional: Upload new documents
  upload?: (file: File, callbacks: UploadCallbacks) => Promise<MediaDocumentItem | MediaDocumentItem[]>;
  
  // Optional: Update document metadata (title)
  update?: (id: string, data: { title?: LocalizedString }) => Promise<MediaDocumentItem>;
  
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

### MediaImageItem

```typescript
interface MediaImageItem {
  id: string;
  url: string;
  filename?: string;
  alt?: LocalizedString;      // { en: 'Alt text', it: 'Testo alt' }
  width?: number;
  height?: number;
  size?: number;              // File size in bytes
  thumbnailUrl?: string;      // For faster loading in grids
  createdAt?: string;
}
```

### MediaGalleryItem

```typescript
interface MediaGalleryItem {
  id: string;
  name: string;
  coverImage?: MediaImageItem;
  images: MediaImageItem[];
  imageCount?: number;
  createdAt?: string;
}
```

### MediaDocumentItem

```typescript
interface MediaDocumentItem {
  id: string;
  url: string;
  filename: string;
  title?: LocalizedString;    // { en: 'Title', it: 'Titolo' }
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
  en: 'Coastal sunset',
  it: 'Tramonto sulla costa',
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

## Styling

The plugin uses CSS Modules with vanilla CSS that matches Puck's design language. Import the styles in your app:

```tsx
import '@caprionlinesrl/puck-plugin-media/styles.css';
```

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- React 18+
- Puck 0.21+

## Development

### Prerequisites

- Node.js 18+
- Yarn 4+

### Setup

```bash
git clone https://github.com/caprionlinesrl/puck-plugin-media.git
cd puck-plugin-media
yarn install
```

### Run the demo

```bash
yarn demo
```

Open [http://localhost:3000](http://localhost:3000)

### Build the library

```bash
yarn build
```

### Type check

```bash
yarn typecheck
```

## License

MIT
