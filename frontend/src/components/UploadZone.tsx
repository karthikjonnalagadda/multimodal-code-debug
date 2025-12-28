import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  files?: File[];
}

export function UploadZone({ onFiles, files = [] }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    
    const newFiles = Array.from(fileList).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (newFiles.length > 0) {
      onFiles(newFiles);
      
      // Create previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  }, [onFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  }, [processFiles]);

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onFiles(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
          isDragging 
            ? "border-blue-500 bg-blue-50 scale-[1.02]" 
            : files.length > 0
            ? "border-green-300 bg-green-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />
        
        <div className="text-center space-y-3">
          {files.length > 0 ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <p className="font-medium text-green-700">
                  {files.length} {files.length === 1 ? 'image' : 'images'} uploaded
                </p>
                <p className="text-xs text-gray-600">
                  Drag more or click to add
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className={cn(
                "w-12 h-12 mx-auto transition-colors",
                isDragging ? "text-blue-500" : "text-gray-400"
              )} />
              <div>
                <p className="text-sm">
                  <span className="font-medium text-blue-600">Click to upload</span>
                  {' '}or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X className="w-3 h-3" />
              </Button>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {files[index]?.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
