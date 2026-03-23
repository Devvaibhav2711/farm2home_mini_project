import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export const ImageUpload = ({ value, onChange, onRemove }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
        toast.success('Image uploaded successfully!');
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read image');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (onRemove) onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg border-2 border-border overflow-hidden bg-muted">
            <img
              src={value}
              alt="Product preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Change
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="relative w-full h-48 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer bg-muted/30 hover:bg-muted/50"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <p className="text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12" />
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                </div>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
