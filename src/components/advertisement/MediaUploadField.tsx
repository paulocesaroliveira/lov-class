import { useState, useCallback } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MediaPreview } from "@/types/advertisement";
import { MediaPreview as MediaPreviewComponent } from "./MediaPreview";

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
  const [previews, setPreviews] = useState<MediaPreview[]>([]);

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

    const newPreviews = validFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' as const : 'video' as const
    }));

    setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews);
    onChange(multiple ? validFiles : validFiles[0]);
  }, [multiple, maxFiles, maxSize, onChange]);

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
          <MediaPreviewComponent media={previews} onDelete={handleDelete} />
        </div>
      )}
    </FormItem>
  );
};