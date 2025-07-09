import { StyleCategory } from '@/utils/modelProvider';
import { GenerationSettings } from './content.types';

// Interfață pentru proprietățile MainGenerator
export interface MainGeneratorProps {
  onGenerate: (prompt: string, settings: GenerationSettings) => void;
  isGenerating: boolean;
}

// Interfață pentru setări extinse - menținută pentru compatibilitate
// Toate proprietățile au fost mutate în GenerationSettings
export interface ExtendedGenerationSettings extends GenerationSettings {
  // Nota: Toate proprietățile suplimentare au fost mutate în GenerationSettings
  // și sunt marcate ca opționale acolo
}

// Interfețe pentru componentele UI

// SettingsCard props
export interface SettingsCardProps {
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  tooltip?: string;
}

// StyleSelector props
export interface StyleSelectorProps {
  styles: StyleCategory[];
  selectedStyle: string;
  onSelect: (style: string) => void;
  disabled: boolean;
}

// ToggleSwitch props
export interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
  description?: string;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
}

// ImageUploader props
export interface ImageUploaderProps {
  label: string;
  onImageUpload: (file: File) => void;
  image: string | null;
  onImageRemove: () => void;
  disabled?: boolean;
} 