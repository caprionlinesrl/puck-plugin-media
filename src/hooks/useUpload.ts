import { useState, useCallback, useRef } from 'react';
import type { UploadFn, UploadConfig, UploadingFile, ImageItem, DocumentItem } from '../types';

const DEFAULT_CONFIG: Required<UploadConfig> = {
  accept: 'image/*',
  maxSize: 10 * 1024 * 1024, // 10MB
  multiple: true,
};

/** Maximum concurrent uploads */
const MAX_CONCURRENT_UPLOADS = 3;

const generateId = () => `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const validateFile = (
  file: File,
  config: Required<UploadConfig>
): { valid: boolean; error?: string } => {
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${formatFileSize(config.maxSize)}`,
    };
  }

  const acceptedTypes = config.accept.split(',').map((t) => t.trim());
  const isAccepted = acceptedTypes.some((type) => {
    if (type === '*/*' || type === '*') return true;
    if (type.endsWith('/*')) {
      const category = type.slice(0, -2);
      return file.type.startsWith(category);
    }
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type === type;
  });

  if (!isAccepted) {
    return {
      valid: false,
      error: `File type not accepted. Accepted types: ${config.accept}`,
    };
  }

  return { valid: true };
};

const createPreviewUrl = (file: File): string | undefined => {
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file);
  }
  return undefined;
};

export interface UseUploadOptions<T extends ImageItem | DocumentItem> {
  upload: UploadFn<T>;
  config?: UploadConfig;
  onUploadComplete?: (item: T) => void;
}

export interface UseUploadReturn {
  /** Files currently being uploaded */
  uploading: UploadingFile[];
  /** Whether any upload is in progress */
  isUploading: boolean;
  /** Add files to upload queue */
  addFiles: (files: FileList | File[]) => void;
  /** Cancel a specific upload */
  cancelUpload: (id: string) => void;
  /** Clear completed/errored uploads */
  clearCompleted: () => void;
  /** The merged config being used */
  uploadConfig: Required<UploadConfig>;
}

export function useUpload<T extends ImageItem | DocumentItem>({
  upload,
  config,
  onUploadComplete,
}: UseUploadOptions<T>): UseUploadReturn {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const activeUploadsRef = useRef<Set<string>>(new Set());
  const uploadConfig = { ...DEFAULT_CONFIG, ...config };

  const startUpload = useCallback(
    async (id: string, file: File) => {
      try {
        const result = await upload(file, {
          onProgress: (percent) => {
            setUploading((current) =>
              current.map((f) => (f.id === id ? { ...f, progress: percent } : f))
            );
          },
        });

        const singleResult = Array.isArray(result) ? result[0] : result;

        setUploading((current) =>
          current.map((f) =>
            f.id === id
              ? { ...f, status: 'completed' as const, progress: 100, result: singleResult }
              : f
          )
        );

        onUploadComplete?.(singleResult as T);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploading((current) =>
          current.map((f) =>
            f.id === id ? { ...f, status: 'error' as const, error: errorMessage } : f
          )
        );
      } finally {
        activeUploadsRef.current.delete(id);
        processQueue();
      }
    },
    [upload, onUploadComplete]
  );

  const processQueue = useCallback(() => {
    setUploading((current) => {
      const pending = current.filter(
        (f) => f.status === 'pending' && !activeUploadsRef.current.has(f.id)
      );
      const activeCount = activeUploadsRef.current.size;
      const slotsAvailable = MAX_CONCURRENT_UPLOADS - activeCount;

      if (slotsAvailable <= 0 || pending.length === 0) {
        return current;
      }

      const toStart = pending.slice(0, slotsAvailable);
      toStart.forEach((file) => {
        activeUploadsRef.current.add(file.id);
        startUpload(file.id, file.file);
      });

      return current.map((f) =>
        toStart.some((t) => t.id === f.id) ? { ...f, status: 'uploading' as const } : f
      );
    });
  }, [startUpload]);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      
      // If multiple not allowed, only take first file
      const filesToAdd = uploadConfig.multiple ? fileArray : fileArray.slice(0, 1);

      const newUploads: UploadingFile[] = filesToAdd.map((file) => {
        const validation = validateFile(file, uploadConfig);
        const previewUrl = createPreviewUrl(file);

        return {
          id: generateId(),
          file,
          progress: 0,
          status: validation.valid ? 'pending' : 'error',
          error: validation.error,
          previewUrl,
        };
      });

      setUploading((current) => [...newUploads, ...current]);

      // Start processing queue after state update
      setTimeout(processQueue, 0);
    },
    [uploadConfig, processQueue]
  );

  const cancelUpload = useCallback((id: string) => {
    setUploading((current) => {
      const file = current.find((f) => f.id === id);
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return current.filter((f) => f.id !== id);
    });
    activeUploadsRef.current.delete(id);
  }, []);

  const clearCompleted = useCallback(() => {
    setUploading((current) => {
      current
        .filter((f) => f.status === 'completed' || f.status === 'error')
        .forEach((f) => {
          if (f.previewUrl) {
            URL.revokeObjectURL(f.previewUrl);
          }
        });
      return current.filter((f) => f.status === 'pending' || f.status === 'uploading');
    });
  }, []);

  const isUploading = uploading.some(
    (f) => f.status === 'pending' || f.status === 'uploading'
  );

  return {
    uploading,
    isUploading,
    addFiles,
    cancelUpload,
    clearCompleted,
    uploadConfig,
  };
}
