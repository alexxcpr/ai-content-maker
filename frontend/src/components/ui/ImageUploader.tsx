import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { ImageUploaderProps } from '@/types/generator.types';

// Componenta pentru încărcarea imaginilor de referință
export const ImageUploader = ({ 
  label, 
  onImageUpload, 
  image, 
  onImageRemove,
  disabled = false
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-300">{label}</div>
      {image ? (
        <div className="relative h-24 w-full rounded-md overflow-hidden">
          <img 
            src={image} 
            alt={label} 
            className="h-full w-full object-cover" 
          />
          <button
            type="button"
            onClick={onImageRemove}
            disabled={disabled}
            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black/90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="
            border-2 border-dashed border-gray-600 rounded-md w-full h-24
            flex flex-col items-center justify-center gap-2
            text-gray-400 hover:text-gray-300 hover:border-gray-500
            transition-colors
          "
        >
          <Upload className="w-5 h-5" />
          <span className="text-xs">Încarcă imagine</span>
        </button>
      )}
      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="hidden" 
        disabled={disabled}
      />
    </div>
  );
}; 