import { HeroImageBlock } from './HeroImage';
import { PhotoGalleryBlock } from './PhotoGallery';
import { DownloadCardBlock } from './DownloadCard';

export const config = {
  categories: {
    media: {
      title: 'Media Components',
      components: ['HeroImage', 'PhotoGallery', 'DownloadCard'],
    },
  },
  components: {
    HeroImage: HeroImageBlock,
    PhotoGallery: PhotoGalleryBlock,
    DownloadCard: DownloadCardBlock,
  },
};
