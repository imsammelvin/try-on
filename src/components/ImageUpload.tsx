import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  label: string;
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
}

export const ImageUpload = ({ label, onImageSelect, selectedImage }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageSelect(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {!selectedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-300 hover:border-primary/50 hover:bg-muted/30
            ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop or click to upload
          </p>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={selectedImage}
            alt={label}
            className="w-full h-64 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onImageSelect("")}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
