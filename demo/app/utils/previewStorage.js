const PREVIEW_KEY = 'media-demo';

export const previewStorage = {
  save: (data) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(PREVIEW_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving preview data:', error);
    }
  },

  load: () => {
    try {
      if (typeof window === 'undefined') return {};
      const savedData = localStorage.getItem(PREVIEW_KEY);
      if (!savedData) return {};
      return JSON.parse(savedData);
    } catch (error) {
      console.error('Error loading preview data:', error);
      return {};
    }
  },

  clear: () => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(PREVIEW_KEY);
    } catch (error) {
      console.error('Error clearing preview data:', error);
    }
  },

  getKey: () => PREVIEW_KEY,
};
