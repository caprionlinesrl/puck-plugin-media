import { Image } from 'lucide-react';
import { MediaImageField } from './components/MediaImageField/MediaImageField';
import { MediaGalleryField } from './components/MediaGalleryField/MediaGalleryField';
import { MediaDocumentField } from './components/MediaDocumentField/MediaDocumentField';
import { MediaPanel } from './components/MediaPanel/MediaPanel';
import type {
  MediaPluginOptions,
  PuckPlugin,
  MediaImageFieldProps,
  MediaGalleryFieldProps,
  MediaDocumentFieldProps,
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
    mediaImage,
    mediaGallery,
    mediaDocument,
  } = options;

  const fieldTypes: Record<string, (props: unknown) => React.ReactNode> = {
    // Image field type (always available)
    mediaImage: (props: unknown) => {
      const fieldProps = props as MediaImageFieldProps;
      return (
        <MediaImageField
          {...fieldProps}
          languages={languages}
          imageOptions={mediaImage}
        />
      );
    },
  };

  // Gallery field type (only if mediaGallery options provided)
  if (mediaGallery) {
    fieldTypes.mediaGallery = (props: unknown) => {
      const fieldProps = props as MediaGalleryFieldProps;
      return (
        <MediaGalleryField
          {...fieldProps}
          languages={languages}
          galleryOptions={mediaGallery}
        />
      );
    };
  }

  // Document field type (only if mediaDocument options provided)
  if (mediaDocument) {
    fieldTypes.mediaDocument = (props: unknown) => {
      const fieldProps = props as MediaDocumentFieldProps;
      return (
        <MediaDocumentField
          {...fieldProps}
          languages={languages}
          documentOptions={mediaDocument}
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
        imageOptions={mediaImage}
        galleryOptions={mediaGallery}
        documentOptions={mediaDocument}
      />
    ),
    overrides: {
      fieldTypes,
    },
  };
}
