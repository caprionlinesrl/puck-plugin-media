import { DownloadCard } from './DownloadCard';

export const DownloadCardBlock = {
  label: 'Download Card',
  fields: {
    document: {
      type: 'document',
      label: 'Document',
    },
    title: {
      type: 'text',
      label: 'Title',
    },
    description: {
      type: 'textarea',
      label: 'Description',
    },
    buttonText: {
      type: 'text',
      label: 'Button Text',
    },
  },
  defaultProps: {
    document: null,
    title: 'Download the document',
    description: 'Click the button to download the file.',
    buttonText: 'Download',
  },
  render: DownloadCard,
};
