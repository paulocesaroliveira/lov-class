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
      // Update progress at the start
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      // Set progress to 100% when complete
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 100
      }));

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  return { uploadProgress, uploadWithProgress };
};