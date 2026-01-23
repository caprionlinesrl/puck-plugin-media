import { HeroImage } from './HeroImage';

export const HeroImageBlock = {
  label: 'Hero Image',
  fields: {
    backgroundImage: {
      type: 'mediaImage',
      label: 'Background Image',
    },
    title: {
      type: 'text',
      label: 'Title',
    },
    subtitle: {
      type: 'text',
      label: 'Subtitle',
    },
    overlayOpacity: {
      type: 'number',
      label: 'Overlay Opacity (%)',
      min: 0,
      max: 100,
    },
    minHeight: {
      type: 'number',
      label: 'Min Height (px)',
      min: 200,
      max: 800,
    },
  },
  defaultProps: {
    backgroundImage: null,
    title: 'Welcome to our site',
    subtitle: 'Discover our services and products',
    overlayOpacity: 50,
    minHeight: 400,
  },
  render: HeroImage,
};
