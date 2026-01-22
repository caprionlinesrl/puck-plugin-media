import { Image } from 'lucide-react';
import { ImageField } from './components/ImageField/ImageField';
import { GalleryField } from './components/GalleryField/GalleryField';
import { DocumentField } from './components/DocumentField/DocumentField';
import { MediaPanel } from './components/MediaPanel/MediaPanel';
import type {
  MediaPluginOptions,
  PuckPlugin,
  ImageFieldProps,
  GalleryFieldProps,
  DocumentFieldProps,
} from './types';

/**
 * Create a Puck plugin for media library integration
 *
 * @example
 * ```tsx
 * import { createMediaPlugin } from '@onda-suite/puck-plugin-media';
 *
 * const mediaPlugin = createMediaPlugin({
 *   // Optional: configure languages for alt/title fields
 *   languages: [
 *     { code: 'it', label: 'Italiano' },
 *     { code: 'en', label: 'English' },
 *   ],
 *
 *   // Image configuration (required)
 *   image: {
 *     fetchList: async ({ query, page, pageSize }) => {
 *       const res = await fetch(`/api/images?q=${query}&page=${page}`);
 *       return res.json();
 *     },
 *     upload: async (file, { onProgress }) => {
 *       // Upload with progress tracking...
 *       return uploadedImageItem;
 *     },
 *     update: async (id, { alt }) => {
 *       // Update alt text
 *       return updatedImageItem;
 *     },
 *     delete: async (id) => {
 *       // Delete image (enables "Select Items" mode)
 *     },
 *     uploadConfig: {
 *       accept: 'image/*',
 *       maxSize: 10 * 1024 * 1024, // 10MB
 *       multiple: true,
 *     },
 *   },
 *
 *   // Gallery configuration (optional)
 *   gallery: {
 *     fetchList: async ({ query, page }) => { ... },
 *     fetch: async (id) => { ... },
 *     create: async (name) => { ... },
 *     delete: async (id) => { ... },
 *     upload: async (galleryId, file, { onProgress }) => { ... },
 *     removeImage: async (galleryId, imageId) => { ... },
 *     updateImage: async (galleryId, imageId, { alt }) => { ... },
 *   },
 *
 *   // Document configuration (optional)
 *   document: {
 *     fetchList: async ({ query, page }) => { ... },
 *     upload: async (file, { onProgress }) => { ... },
 *     update: async (id, { title }) => { ... },
 *     delete: async (id) => {
 *       // Delete document (enables "Select Items" mode)
 *     },
 *     uploadConfig: {
 *       accept: '.pdf,.doc,.docx,.xls,.xlsx',
 *       maxSize: 20 * 1024 * 1024, // 20MB
 *       multiple: true,
 *     },
 *   },
 * });
 *
 * <Puck config={config} plugins={[mediaPlugin]} />
 * ```
 */
export function createMediaPlugin(options: MediaPluginOptions): PuckPlugin {
  const {
    languages = [
      { code: 'en', label: 'English' },
      { code: 'it', label: 'Italiano' },
    ],
    image,
    gallery,
    document,
  } = options;

  const fieldTypes: Record<string, (props: unknown) => React.ReactNode> = {
    // Image field type (always available)
    image: (props: unknown) => {
      const fieldProps = props as ImageFieldProps;
      return (
        <ImageField
          {...fieldProps}
          languages={languages}
          imageOptions={image}
        />
      );
    },
  };

  // Gallery field type (only if gallery options provided)
  if (gallery) {
    fieldTypes.gallery = (props: unknown) => {
      const fieldProps = props as GalleryFieldProps;
      return (
        <GalleryField
          {...fieldProps}
          languages={languages}
          galleryOptions={gallery}
        />
      );
    };
  }

  // Document field type (only if document options provided)
  if (document) {
    fieldTypes.document = (props: unknown) => {
      const fieldProps = props as DocumentFieldProps;
      return (
        <DocumentField
          {...fieldProps}
          languages={languages}
          documentOptions={document}
        />
      );
    };
  }

  return {
    name: 'puck-media',
    label: 'Media',
    icon: <Image size={20} />,
    render: () => (
      <MediaPanel
        languages={languages}
        imageOptions={image}
        galleryOptions={gallery}
        documentOptions={document}
      />
    ),
    overrides: {
      fieldTypes,
    },
  };
}
