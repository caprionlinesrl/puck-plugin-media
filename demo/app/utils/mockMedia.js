/**
 * Mock media data for demo purposes
 * In production, this would come from your API
 */

// =============================================================================
// IMAGE DATA
// =============================================================================

const mockImageItems = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=200',
    filename: 'coastal-sunset.jpg',
    alt: { en: 'Coastal sunset', it: 'Tramonto sulla costa' },
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
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
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1280,
    size: 312000,
  },
];

// Store for dynamically uploaded images (in-memory for demo)
let uploadedImages = [];

// =============================================================================
// GALLERY DATA
// =============================================================================

let mockGalleries = [
  {
    id: 'gallery-1',
    name: 'Landscapes',
    coverImage: mockImageItems[0],
    images: mockImageItems.slice(0, 8),
    imageCount: 8,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'gallery-2',
    name: 'Team',
    coverImage: mockImageItems[10],
    images: mockImageItems.slice(8, 12),
    imageCount: 4,
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'gallery-3',
    name: 'Portfolio',
    coverImage: mockImageItems[2],
    images: mockImageItems.slice(2, 6),
    imageCount: 4,
    createdAt: '2024-02-01T09:15:00Z',
  },
];

// =============================================================================
// DOCUMENT DATA
// =============================================================================

let mockDocumentItems = [
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
let uploadedDocuments = [];

// =============================================================================
// IMAGE API FUNCTIONS
// =============================================================================

/**
 * Fetch list of images
 */
export async function fetchImageList({ query, page = 1, pageSize = 20 }) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const allItems = [...uploadedImages, ...mockImageItems];

  let filteredItems = allItems;
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredItems = allItems.filter(item =>
      item.filename.toLowerCase().includes(lowerQuery) ||
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
export async function uploadImages(files, { onProgress }) {
  const fileArray = Array.isArray(files) ? files : [files];
  const results = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    
    // Simulate upload progress
    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress(Math.round(((i + step / totalSteps) / fileArray.length) * 100));
    }

    const id = `uploaded-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const url = URL.createObjectURL(file);
    
    let width, height;
    if (file.type.startsWith('image/')) {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
    }

    const newItem = {
      id,
      url,
      thumbnailUrl: url,
      filename: file.name,
      alt: {},
      mimeType: file.type,
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
export async function updateImage(id, data) {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Find in uploaded images
  let item = uploadedImages.find(img => img.id === id);
  if (item) {
    item = { ...item, ...data };
    uploadedImages = uploadedImages.map(img => img.id === id ? item : img);
    return item;
  }

  // Find in mock items (we can't actually update these, but simulate it)
  item = mockImageItems.find(img => img.id === id);
  if (item) {
    return { ...item, ...data };
  }

  throw new Error('Image not found');
}

/**
 * Delete an image
 */
export async function deleteImage(id) {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Check if it's an uploaded image
  const uploadedIndex = uploadedImages.findIndex(img => img.id === id);
  if (uploadedIndex !== -1) {
    uploadedImages = uploadedImages.filter(img => img.id !== id);
    return;
  }

  // Check if it's a mock image (for demo, we'll just pretend it's deleted)
  const mockIndex = mockImageItems.findIndex(img => img.id === id);
  if (mockIndex !== -1) {
    // In a real app, this would delete from the server
    // For demo, we'll remove it from the array
    mockImageItems.splice(mockIndex, 1);
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
export async function fetchGalleryList({ query, page = 1, pageSize = 20 }) {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredItems = [...mockGalleries];
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredItems = mockGalleries.filter(gallery =>
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
export async function fetchGallery(id) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const gallery = mockGalleries.find(g => g.id === id);
  if (!gallery) {
    throw new Error('Gallery not found');
  }
  return gallery;
}

/**
 * Create a new gallery
 */
export async function createGallery(name) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const newGallery = {
    id: `gallery-${Date.now()}`,
    name,
    coverImage: null,
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
export async function deleteGallery(id) {
  await new Promise(resolve => setTimeout(resolve, 200));
  mockGalleries = mockGalleries.filter(g => g.id !== id);
}

/**
 * Upload images to a gallery
 */
export async function uploadToGallery(galleryId, files, { onProgress }) {
  const fileArray = Array.isArray(files) ? files : [files];
  const results = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    
    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress(Math.round(((i + step / totalSteps) / fileArray.length) * 100));
    }

    const id = `gallery-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const url = URL.createObjectURL(file);
    
    let width, height;
    if (file.type.startsWith('image/')) {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
    }

    const newItem = {
      id,
      url,
      thumbnailUrl: url,
      filename: file.name,
      alt: {},
      mimeType: file.type,
      width,
      height,
      size: file.size,
    };

    results.push(newItem);
  }

  // Add images to gallery
  mockGalleries = mockGalleries.map(gallery => {
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
export async function removeFromGallery(galleryId, imageId) {
  await new Promise(resolve => setTimeout(resolve, 200));

  mockGalleries = mockGalleries.map(gallery => {
    if (gallery.id === galleryId) {
      const newImages = gallery.images.filter(img => img.id !== imageId);
      return {
        ...gallery,
        images: newImages,
        imageCount: newImages.length,
        coverImage: gallery.coverImage?.id === imageId ? newImages[0] || null : gallery.coverImage,
      };
    }
    return gallery;
  });
}

/**
 * Update image metadata in a gallery
 */
export async function updateGalleryImage(galleryId, imageId, data) {
  await new Promise(resolve => setTimeout(resolve, 200));

  let updatedImage = null;
  
  mockGalleries = mockGalleries.map(gallery => {
    if (gallery.id === galleryId) {
      return {
        ...gallery,
        images: gallery.images.map(img => {
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
export async function fetchDocumentList({ query, page = 1, pageSize = 20 }) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const allItems = [...uploadedDocuments, ...mockDocumentItems];

  let filteredItems = allItems;
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredItems = allItems.filter(item =>
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
export async function uploadDocuments(files, { onProgress }) {
  const fileArray = Array.isArray(files) ? files : [files];
  const results = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    
    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress(Math.round(((i + step / totalSteps) / fileArray.length) * 100));
    }

    const id = `uploaded-doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const url = URL.createObjectURL(file);
    const extension = file.name.split('.').pop() || '';

    const newItem = {
      id,
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
export async function updateDocument(id, data) {
  await new Promise(resolve => setTimeout(resolve, 200));

  let item = uploadedDocuments.find(doc => doc.id === id);
  if (item) {
    item = { ...item, ...data };
    uploadedDocuments = uploadedDocuments.map(doc => doc.id === id ? item : doc);
    return item;
  }

  item = mockDocumentItems.find(doc => doc.id === id);
  if (item) {
    return { ...item, ...data };
  }

  throw new Error('Document not found');
}

/**
 * Delete a document
 */
export async function deleteDocument(id) {
  await new Promise(resolve => setTimeout(resolve, 200));

  const uploadedIndex = uploadedDocuments.findIndex(doc => doc.id === id);
  if (uploadedIndex !== -1) {
    uploadedDocuments = uploadedDocuments.filter(doc => doc.id !== id);
    return;
  }

  const mockIndex = mockDocumentItems.findIndex(doc => doc.id === id);
  if (mockIndex !== -1) {
    mockDocumentItems.splice(mockIndex, 1);
    return;
  }

  throw new Error('Document not found');
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Helper to get image dimensions
 */
function getImageDimensions(file) {
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
