/**
 * Mock media data and API functions for demo/testing purposes
 *
 * Usage:
 * ```typescript
 * import { createMediaPlugin } from '@caprionlinesrl/puck-plugin-media';
 * import { mockMediaConfig } from '@caprionlinesrl/puck-plugin-media/mocks';
 *
 * const mediaPlugin = createMediaPlugin({
 *   ...mockMediaConfig,
 *   languages: [
 *     { code: 'en', label: 'English' },
 *     { code: 'it', label: 'Italiano' },
 *   ],
 * });
 * ```
 */

import type {
  MediaImageItem,
  MediaGalleryItem,
  MediaDocumentItem,
  FetchListParams,
  FetchListResult,
  UploadCallbacks,
  MediaPluginOptions,
} from '../types';

// =============================================================================
// IMAGE DATA
// =============================================================================

const mockMediaImageItems: MediaImageItem[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=200',
    filename: 'coastal-sunset.jpg',
    alt: { en: 'Coastal sunset', it: 'Tramonto sulla costa' },
    width: 1920,
    height: 1280,
    size: 245000,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
    filename: 'snowy-mountains.jpg',
    alt: { en: 'Snowy mountains', it: 'Montagne innevate' },
    width: 1920,
    height: 1280,
    size: 312000,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
    filename: 'forest-trail.jpg',
    alt: { en: 'Forest trail', it: 'Sentiero nel bosco' },
    width: 1920,
    height: 1280,
    size: 198000,
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200',
    filename: 'mountain-lake.jpg',
    alt: { en: 'Mountain lake', it: 'Lago di montagna' },
    width: 1920,
    height: 1280,
    size: 276000,
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=200',
    filename: 'misty-forest.jpg',
    alt: { en: 'Misty forest', it: 'Foresta nebbiosa' },
    width: 1920,
    height: 1280,
    size: 223000,
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200',
    filename: 'desert-sunset.jpg',
    alt: { en: 'Desert sunset', it: 'Tramonto nel deserto' },
    width: 1920,
    height: 1280,
    size: 189000,
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200',
    filename: 'majestic-mountain.jpg',
    alt: { en: 'Majestic mountain', it: 'Montagna maestosa' },
    width: 1920,
    height: 1280,
    size: 334000,
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=200',
    filename: 'ocean-sunset.jpg',
    alt: { en: 'Ocean sunset', it: 'Tramonto sul mare' },
    width: 1920,
    height: 1280,
    size: 267000,
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    filename: 'portrait-man.jpg',
    alt: { en: 'Man portrait', it: 'Ritratto uomo' },
    width: 1280,
    height: 1920,
    size: 156000,
  },
  {
    id: '10',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    filename: 'portrait-woman.jpg',
    alt: { en: 'Woman portrait', it: 'Ritratto donna' },
    width: 1280,
    height: 1920,
    size: 178000,
  },
  {
    id: '11',
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200',
    filename: 'team-meeting.jpg',
    alt: { en: 'Team meeting', it: 'Riunione di team' },
    width: 1920,
    height: 1280,
    size: 298000,
  },
  {
    id: '12',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
    filename: 'team-collaboration.jpg',
    alt: { en: 'Team collaboration', it: 'Collaborazione team' },
    width: 1920,
    height: 1280,
    size: 312000,
  },
];

// Store for dynamically uploaded images (in-memory for demo)
let uploadedImages: MediaImageItem[] = [];

// =============================================================================
// GALLERY DATA
// =============================================================================

let mockGalleries: MediaGalleryItem[] = [
  {
    id: 'gallery-1',
    name: 'Landscapes',
    coverImage: mockMediaImageItems[0],
    images: mockMediaImageItems.slice(0, 8),
    imageCount: 8,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'gallery-2',
    name: 'Team',
    coverImage: mockMediaImageItems[10],
    images: mockMediaImageItems.slice(8, 12),
    imageCount: 4,
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'gallery-3',
    name: 'Portfolio',
    coverImage: mockMediaImageItems[2],
    images: mockMediaImageItems.slice(2, 6),
    imageCount: 4,
    createdAt: '2024-02-01T09:15:00Z',
  },
];

// =============================================================================
// DOCUMENT DATA
// =============================================================================

let mockMediaDocumentItems: MediaDocumentItem[] = [
  {
    id: 'doc-1',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    filename: 'restaurant-menu.pdf',
    title: { en: 'Restaurant Menu', it: 'Menu Ristorante' },
    mimeType: 'application/pdf',
    size: 1258000,
    extension: 'pdf',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'doc-2',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    filename: 'price-list-2024.pdf',
    title: { en: 'Price List 2024', it: 'Listino Prezzi 2024' },
    mimeType: 'application/pdf',
    size: 856000,
    extension: 'pdf',
    createdAt: '2024-01-05T11:30:00Z',
  },
  {
    id: 'doc-3',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    filename: 'product-brochure.pdf',
    title: { en: 'Product Brochure', it: 'Brochure Prodotti' },
    mimeType: 'application/pdf',
    size: 2450000,
    extension: 'pdf',
    createdAt: '2024-02-12T16:45:00Z',
  },
  {
    id: 'doc-4',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    filename: 'terms-and-conditions.pdf',
    title: { en: 'Terms and Conditions', it: 'Termini e Condizioni' },
    mimeType: 'application/pdf',
    size: 345000,
    extension: 'pdf',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Store for dynamically uploaded documents (in-memory for demo)
let uploadedDocuments: MediaDocumentItem[] = [];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Helper to get image dimensions
 */
function getImageDimensions(file: File): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ width: undefined, height: undefined });
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate a unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Simulate network delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// IMAGE API FUNCTIONS
// =============================================================================

/**
 * Fetch list of images
 */
async function fetchImageList({
  query,
  page = 1,
  pageSize = 20,
}: FetchListParams): Promise<FetchListResult<MediaImageItem>> {
  await delay(300);

  const allItems = [...uploadedImages, ...mockMediaImageItems];

  let filteredItems = allItems;
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredItems = allItems.filter(
      (item) =>
        item.filename?.toLowerCase().includes(lowerQuery) ||
        item.alt?.it?.toLowerCase().includes(lowerQuery) ||
        item.alt?.en?.toLowerCase().includes(lowerQuery)
    );
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    total: filteredItems.length,
    hasMore: endIndex < filteredItems.length,
  };
}

/**
 * Upload images
 */
async function uploadImages(
  files: File | File[],
  { onProgress }: UploadCallbacks
): Promise<MediaImageItem | MediaImageItem[]> {
  const fileArray = Array.isArray(files) ? files : [files];
  const results: MediaImageItem[] = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];

    // Simulate upload progress
    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      await delay(100);
      onProgress(Math.round(((i + step / totalSteps) / fileArray.length) * 100));
    }

    let width: number | undefined;
    let height: number | undefined;
    if (file.type.startsWith('image/')) {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
    }

    const url = URL.createObjectURL(file);
    const newItem: MediaImageItem = {
      id: generateId('uploaded-img'),
      url,
      thumbnailUrl: url,
      filename: file.name,
      alt: {},
      width,
      height,
      size: file.size,
      createdAt: new Date().toISOString(),
    };

    uploadedImages = [newItem, ...uploadedImages];
    results.push(newItem);
  }

  return fileArray.length === 1 ? results[0] : results;
}

/**
 * Update image metadata
 */
async function updateImage(
  id: string,
  data: { alt?: Record<string, string | undefined> }
): Promise<MediaImageItem> {
  await delay(200);

  // Find in uploaded images
  let item = uploadedImages.find((img) => img.id === id);
  if (item) {
    item = { ...item, ...data };
    uploadedImages = uploadedImages.map((img) => (img.id === id ? item! : img));
    return item;
  }

  // Find in mock items (we can't actually update these, but simulate it)
  const mockItem = mockMediaImageItems.find((img) => img.id === id);
  if (mockItem) {
    return { ...mockItem, ...data };
  }

  throw new Error('Image not found');
}

/**
 * Delete an image
 */
async function deleteImage(id: string): Promise<void> {
  await delay(200);

  // Check if it's an uploaded image
  const uploadedIndex = uploadedImages.findIndex((img) => img.id === id);
  if (uploadedIndex !== -1) {
    uploadedImages = uploadedImages.filter((img) => img.id !== id);
    return;
  }

  // Check if it's a mock image (for demo, we'll just pretend it's deleted)
  const mockIndex = mockMediaImageItems.findIndex((img) => img.id === id);
  if (mockIndex !== -1) {
    mockMediaImageItems.splice(mockIndex, 1);
    return;
  }

  throw new Error('Image not found');
}

// =============================================================================
// GALLERY API FUNCTIONS
// =============================================================================

/**
 * Fetch list of galleries
 */
async function fetchGalleryList({
  query,
  page = 1,
  pageSize = 20,
}: FetchListParams): Promise<FetchListResult<MediaGalleryItem>> {
  await delay(300);

  let filteredItems = [...mockGalleries];
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredItems = mockGalleries.filter((gallery) =>
      gallery.name.toLowerCase().includes(lowerQuery)
    );
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    total: filteredItems.length,
    hasMore: endIndex < filteredItems.length,
  };
}

/**
 * Fetch a single gallery by ID
 */
async function fetchGallery(id: string): Promise<MediaGalleryItem> {
  await delay(200);

  const gallery = mockGalleries.find((g) => g.id === id);
  if (!gallery) {
    throw new Error('Gallery not found');
  }
  return gallery;
}

/**
 * Create a new gallery
 */
async function createGallery(name: string): Promise<MediaGalleryItem> {
  await delay(300);

  const newGallery: MediaGalleryItem = {
    id: generateId('gallery'),
    name,
    coverImage: undefined,
    images: [],
    imageCount: 0,
    createdAt: new Date().toISOString(),
  };

  mockGalleries = [newGallery, ...mockGalleries];
  return newGallery;
}

/**
 * Delete a gallery
 */
async function deleteGallery(id: string): Promise<void> {
  await delay(200);
  mockGalleries = mockGalleries.filter((g) => g.id !== id);
}

/**
 * Upload images to a gallery
 */
async function uploadToGallery(
  galleryId: string,
  files: File | File[],
  { onProgress }: UploadCallbacks
): Promise<MediaImageItem | MediaImageItem[]> {
  const fileArray = Array.isArray(files) ? files : [files];
  const results: MediaImageItem[] = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];

    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      await delay(100);
      onProgress(Math.round(((i + step / totalSteps) / fileArray.length) * 100));
    }

    let width: number | undefined;
    let height: number | undefined;
    if (file.type.startsWith('image/')) {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
    }

    const url = URL.createObjectURL(file);
    const newItem: MediaImageItem = {
      id: generateId('gallery-img'),
      url,
      thumbnailUrl: url,
      filename: file.name,
      alt: {},
      width,
      height,
      size: file.size,
    };

    results.push(newItem);
  }

  // Add images to gallery
  mockGalleries = mockGalleries.map((gallery) => {
    if (gallery.id === galleryId) {
      const newImages = [...results, ...gallery.images];
      return {
        ...gallery,
        images: newImages,
        imageCount: newImages.length,
        coverImage: gallery.coverImage || results[0],
      };
    }
    return gallery;
  });

  return fileArray.length === 1 ? results[0] : results;
}

/**
 * Remove an image from a gallery
 */
async function removeFromGallery(galleryId: string, imageId: string): Promise<void> {
  await delay(200);

  mockGalleries = mockGalleries.map((gallery) => {
    if (gallery.id === galleryId) {
      const newImages = gallery.images.filter((img) => img.id !== imageId);
      return {
        ...gallery,
        images: newImages,
        imageCount: newImages.length,
        coverImage:
          gallery.coverImage?.id === imageId ? newImages[0] || undefined : gallery.coverImage,
      };
    }
    return gallery;
  });
}

/**
 * Update image metadata in a gallery
 */
async function updateGalleryImage(
  galleryId: string,
  imageId: string,
  data: { alt?: Record<string, string | undefined> }
): Promise<MediaImageItem> {
  await delay(200);

  let updatedImage: MediaImageItem | null = null;

  mockGalleries = mockGalleries.map((gallery) => {
    if (gallery.id === galleryId) {
      return {
        ...gallery,
        images: gallery.images.map((img) => {
          if (img.id === imageId) {
            updatedImage = { ...img, ...data };
            return updatedImage;
          }
          return img;
        }),
      };
    }
    return gallery;
  });

  if (!updatedImage) {
    throw new Error('Image not found in gallery');
  }

  return updatedImage;
}

// =============================================================================
// DOCUMENT API FUNCTIONS
// =============================================================================

/**
 * Fetch list of documents
 */
async function fetchDocumentList({
  query,
  page = 1,
  pageSize = 20,
}: FetchListParams): Promise<FetchListResult<MediaDocumentItem>> {
  await delay(300);

  const allItems = [...uploadedDocuments, ...mockMediaDocumentItems];

  let filteredItems = allItems;
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredItems = allItems.filter(
      (item) =>
        item.filename.toLowerCase().includes(lowerQuery) ||
        item.title?.it?.toLowerCase().includes(lowerQuery) ||
        item.title?.en?.toLowerCase().includes(lowerQuery)
    );
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    total: filteredItems.length,
    hasMore: endIndex < filteredItems.length,
  };
}

/**
 * Upload documents
 */
async function uploadDocuments(
  files: File | File[],
  { onProgress }: UploadCallbacks
): Promise<MediaDocumentItem | MediaDocumentItem[]> {
  const fileArray = Array.isArray(files) ? files : [files];
  const results: MediaDocumentItem[] = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];

    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      await delay(100);
      onProgress(Math.round(((i + step / totalSteps) / fileArray.length) * 100));
    }

    const url = URL.createObjectURL(file);
    const extension = file.name.split('.').pop() || '';

    const newItem: MediaDocumentItem = {
      id: generateId('uploaded-doc'),
      url,
      filename: file.name,
      title: {},
      mimeType: file.type,
      size: file.size,
      extension,
      createdAt: new Date().toISOString(),
    };

    uploadedDocuments = [newItem, ...uploadedDocuments];
    results.push(newItem);
  }

  return fileArray.length === 1 ? results[0] : results;
}

/**
 * Update document metadata
 */
async function updateDocument(
  id: string,
  data: { title?: Record<string, string | undefined> }
): Promise<MediaDocumentItem> {
  await delay(200);

  let item = uploadedDocuments.find((doc) => doc.id === id);
  if (item) {
    item = { ...item, ...data };
    uploadedDocuments = uploadedDocuments.map((doc) => (doc.id === id ? item! : doc));
    return item;
  }

  const mockItem = mockMediaDocumentItems.find((doc) => doc.id === id);
  if (mockItem) {
    return { ...mockItem, ...data };
  }

  throw new Error('Document not found');
}

/**
 * Delete a document
 */
async function deleteDocument(id: string): Promise<void> {
  await delay(200);

  const uploadedIndex = uploadedDocuments.findIndex((doc) => doc.id === id);
  if (uploadedIndex !== -1) {
    uploadedDocuments = uploadedDocuments.filter((doc) => doc.id !== id);
    return;
  }

  const mockIndex = mockMediaDocumentItems.findIndex((doc) => doc.id === id);
  if (mockIndex !== -1) {
    mockMediaDocumentItems.splice(mockIndex, 1);
    return;
  }

  throw new Error('Document not found');
}

// =============================================================================
// MOCK MEDIA CONFIG
// =============================================================================

/**
 * Pre-configured mock media options for quick setup.
 *
 * Usage:
 * ```typescript
 * import { createMediaPlugin } from '@caprionlinesrl/puck-plugin-media';
 * import { mockMediaConfig } from '@caprionlinesrl/puck-plugin-media/mocks';
 *
 * const mediaPlugin = createMediaPlugin({
 *   ...mockMediaConfig,
 *   languages: [
 *     { code: 'en', label: 'English' },
 *     { code: 'it', label: 'Italiano' },
 *   ],
 * });
 * ```
 */
export const mockMediaConfig: Pick<MediaPluginOptions, 'mediaImage' | 'mediaGallery' | 'mediaDocument'> = {
  mediaImage: {
    fetchList: fetchImageList,
    upload: uploadImages,
    update: updateImage,
    delete: deleteImage,
  },
  mediaGallery: {
    fetchList: fetchGalleryList,
    fetch: fetchGallery,
    create: createGallery,
    delete: deleteGallery,
    upload: uploadToGallery,
    removeImage: removeFromGallery,
    updateImage: updateGalleryImage,
  },
  mediaDocument: {
    fetchList: fetchDocumentList,
    upload: uploadDocuments,
    update: updateDocument,
    delete: deleteDocument,
  },
};
