import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  progress: number;
  fileName: string;
}

export const UploadProgress = ({ progress, fileName }: UploadProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{fileName}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};