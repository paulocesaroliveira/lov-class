import { useState, useCallback } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MediaPreview as MediaPreviewType } from "@/types/advertisement";
import { MediaPreview } from "./MediaPreview";
import { useImageCompression } from "./hooks/useImageCompression";
import { toast } from "sonner";

interface MediaUploadFieldProps {
  label: string;
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  name: string;
  value?: File | File[];
  onChange: (files: File | File[]) => void;
}

export const MediaUploadField = ({
  label,
  accept,
  multiple = false,
  maxFiles = 15,
  maxSize = 5,
  name,
  value,
  onChange,
}: MediaUploadFieldProps) => {
  const [previews, setPreviews] = useState<MediaPreviewType[]>([]);
  const { compressImage, compressImages } = useImageCompression();

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (multiple && files.length > maxFiles) {
      toast.error(`Máximo de ${maxFiles} arquivos permitido`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`Arquivo ${file.name} excede ${maxSize}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      const compressedFiles = accept.includes('image') 
        ? await compressImages(validFiles)
        : validFiles;

      const newPreviews = compressedFiles.map(file => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video' as const
      }));

      setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews);
      onChange(multiple ? compressedFiles : compressedFiles[0]);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Erro ao processar arquivos');
    }
  }, [accept, maxFiles, maxSize, multiple, onChange]);

  const handleDelete = useCallback((id: string) => {
    setPreviews(prev => {
      const newPreviews = prev.filter(p => p.id !== id);
      const newFiles = newPreviews.map(p => p.file);
      onChange(multiple ? newFiles : newFiles[0]);
      return newPreviews;
    });
  }, [multiple, onChange]);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
      </FormControl>
      <FormMessage />
      {previews.length > 0 && (
        <div className="mt-4">
          <MediaPreview media={previews} onDelete={handleDelete} />
        </div>
      )}
    </FormItem>
  );
};