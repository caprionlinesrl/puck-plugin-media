"use client";

import { useState } from "react";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { createMediaPlugin } from "@caprionlinesrl/puck-plugin-media";
import { mockMediaConfig } from "@caprionlinesrl/puck-plugin-media/mocks";
import { config } from "@/blocks";
import { previewStorage } from "@/utils/previewStorage";

// Create media plugin with mock data and upload support
const mediaPlugin = createMediaPlugin({
  ...mockMediaConfig,
  // Languages for multilingual fields
  languages: [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
  ],
  // Image configuration with custom upload config
  image: {
    ...mockMediaConfig.image,
    uploadConfig: {
      accept: 'image/jpeg,image/png,image/gif,image/webp',
      maxSize: 10 * 1024 * 1024, // 10MB
      multiple: true,
    },
  },
  // Document configuration with custom upload config
  document: {
    ...mockMediaConfig.document,
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
