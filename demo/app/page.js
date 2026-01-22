"use client";

import { useState } from "react";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { createMediaPlugin } from "@caprionlinesrl/puck-plugin-media";
import { config } from "@/blocks";
import { previewStorage } from "@/utils/previewStorage";
import {
  // Image API
  fetchImageList,
  uploadImages,
  updateImage,
  deleteImage,
  // Gallery API
  fetchGalleryList,
  fetchGallery,
  createGallery,
  deleteGallery,
  uploadToGallery,
  removeFromGallery,
  updateGalleryImage,
  // Document API
  fetchDocumentList,
  uploadDocuments,
  updateDocument,
  deleteDocument,
} from "@/utils/mockMedia";

// Create media plugin with mock data and upload support
const mediaPlugin = createMediaPlugin({
  // Languages for multilingual fields
  languages: [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
  ],

  // Image configuration
  image: {
    fetchList: fetchImageList,
    upload: uploadImages,
    update: updateImage,
    delete: deleteImage,
    uploadConfig: {
      accept: 'image/jpeg,image/png,image/gif,image/webp',
      maxSize: 10 * 1024 * 1024, // 10MB
      multiple: true,
    },
  },

  // Gallery configuration
  gallery: {
    fetchList: fetchGalleryList,
    fetch: fetchGallery,
    create: createGallery,
    delete: deleteGallery,
    upload: uploadToGallery,
    removeImage: removeFromGallery,
    updateImage: updateGalleryImage,
  },

  // Document configuration
  document: {
    fetchList: fetchDocumentList,
    upload: uploadDocuments,
    update: updateDocument,
    delete: deleteDocument,
    uploadConfig: {
      accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
      maxSize: 20 * 1024 * 1024, // 20MB
      multiple: true,
    },
  },
});

export default function Page() {
  const [data, setData] = useState(() => previewStorage.load());

  const handleChange = (newData) => {
    setData(newData);
    previewStorage.save(newData);
  };

  return (
    <div className="h-screen">
      <Puck
        config={config}
        data={data}
        onChange={handleChange}
        plugins={[mediaPlugin]}
      />
    </div>
  );
}
