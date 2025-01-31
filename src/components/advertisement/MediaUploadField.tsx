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
  maxSize?: number;
  value: any;
  onChange: (files: File | File[]) => void;
}

export const MediaUploadField = ({
  label,
  accept,
  multiple = false,
  maxFiles = 1,
  maxSize = 10,
  value,
  onChange,
}: MediaUploadFieldProps) => {
  const [previews, setPreviews] = useState<MediaPreviewType[]>([]);
  const { compressImage, compressImages } = useImageCompression();

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (multiple && files.length + previews.length > maxFiles) {
      toast.error(`Máximo de ${maxFiles} arquivos permitidos`);
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
        type: file.type.startsWith('image/') ? 'image' : 'video'
      } as MediaPreviewType));

      setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews);
      onChange(multiple ? compressedFiles : compressedFiles[0]);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Erro ao processar arquivos');
    }
  }, [accept, maxFiles, maxSize, multiple, onChange, previews.length]);

  const handleDelete = useCallback((id: string) => {
    setPreviews(prev => {
      const filtered = prev.filter(p => p.id !== id);
      onChange(multiple ? filtered.map(p => p.file) : undefined);
      return filtered;
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
          className="cursor-pointer"
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