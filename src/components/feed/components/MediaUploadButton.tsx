import { Upload } from "lucide-react";

interface MediaUploadButtonProps {
  mediaCount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MediaUploadButton = ({ mediaCount, onChange }: MediaUploadButtonProps) => {
  return (
    <div className="flex-1">
      <input
        type="file"
        id="media"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={onChange}
      />
      <label
        htmlFor="media"
        className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
      >
        <Upload size={20} />
        {mediaCount > 0
          ? `${mediaCount} arquivo(s) selecionado(s)`
          : "Adicionar mídia"}
      </label>
    </div>
  );
};