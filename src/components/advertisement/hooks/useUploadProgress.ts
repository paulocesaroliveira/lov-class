import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUploadProgress = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const uploadWithProgress = async (
    bucket: string,
    path: string,
    file: File
  ) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: percent
            }));
          },
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  return { uploadProgress, uploadWithProgress };
};