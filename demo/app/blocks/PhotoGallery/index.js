import { PhotoGallery } from './PhotoGallery';

export const PhotoGalleryBlock = {
  label: 'Photo Gallery',
  fields: {
    gallery: {
      type: 'gallery',
      label: 'Gallery',
    },
    title: {
      type: 'text',
      label: 'Section Title',
    },
    columns: {
      type: 'select',
      label: 'Columns',
      options: [
        { label: '2 columns', value: 2 },
        { label: '3 columns', value: 3 },
        { label: '4 columns', value: 4 },
      ],
    },
    gap: {
      type: 'number',
      label: 'Image Gap (px)',
      min: 0,
      max: 32,
    },
  },
  defaultProps: {
    gallery: null,
    title: 'Our Gallery',
    columns: 3,
    gap: 16,
  },
  render: PhotoGallery,
};
