import { apiService } from '@/services/api';

// Define types for model structures
export interface ModelOption {
  value: string;
  label: string;
  available?: boolean;
  icon?: string;
}

export interface StyleCategory {
  category: string;
  styles: ModelOption[];
}

export interface ModelsData {
  text: ModelOption[];
  image: ModelOption[];
  animation: ModelOption[];
  imageStyles: StyleCategory[];
  aspectRatios: ModelOption[];
}

// Default fallback values in case API fails
const fallbackModels: ModelsData = {
  text: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash Fallback' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro Fallback' },
  ],
  image: [
    { value: 'models/gemini-2.0-flash-preview-image-generation', label: 'Gemini Fallback' },
    { value: 'cgdream', label: 'CGDream AI Fallback' }
  ],
  animation: [
    { value: 'kling', label: 'Kling AI Fallback' },
    { value: 'runway', label: 'Runway ML Fallback' }
  ],
  imageStyles: [
    { 
      category: 'Realist Fallback', 
      styles: [
        { value: 'realistic', label: 'Realist Fallback', icon: '🖼️' },
        { value: 'photographic', label: 'Fotografic Fallback', icon: '📷' }
      ] 
    },
    { 
      category: 'Artistic Fallback', 
      styles: [
        { value: 'artistic', label: 'Artistic Fallback', icon: '🎨' }
      ] 
    }
  ],
  aspectRatios: [
    { value: '16:9', label: 'Landscape (16:9) Fallback', icon: 'Maximize' },
    { value: '1:1', label: 'Pătrat (1:1) Fallback', icon: 'Square' }
  ]
};

// Create a singleton to store and manage models
class ModelProvider {
  private models: ModelsData | null = null;
  private loading: boolean = false;
  private error: Error | null = null;
  private fetchPromise: Promise<ModelsData> | null = null;

  // Format the API response into our expected structure
  private formatApiResponse(apiData: any): ModelsData {
    try {
      return {
        text: apiData.text.map((item: any) => ({
          value: item.id,
          label: item.name,
          available: item.available
        })),
        image: apiData.image.map((item: any) => ({
          value: item.id,
          label: item.name,
          available: item.available
        })),
        animation: apiData.animation.map((item: any) => ({
          value: item.id,
          label: item.name,
          available: item.available
        })),
        imageStyles: apiData.imageStyles || fallbackModels.imageStyles,
        aspectRatios: apiData.aspectRatios || fallbackModels.aspectRatios
      };
    } catch (error) {
      console.error('Error formatting API response:', error);
      return fallbackModels;
    }
  }

  // Get models, fetching them if needed
  async getModels(): Promise<ModelsData> {
    // If we already have models, return them immediately
    if (this.models) {
      return this.models;
    }

    // If we're already loading, return the existing promise
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // Start a new fetch
    this.loading = true;
    this.error = null;
    
    try {
      // Create a new promise and store it
      this.fetchPromise = new Promise<ModelsData>(async (resolve) => {
        try {
          const response = await apiService.getAvailableModels();
          this.models = this.formatApiResponse(response);
          resolve(this.models);
        } catch (error) {
          console.error('Failed to fetch models from API:', error);
          this.error = error instanceof Error ? error : new Error('Unknown error fetching models');
          // Fallback to default models on error
          this.models = fallbackModels;
          resolve(this.models);
        } finally {
          this.loading = false;
          this.fetchPromise = null;
        }
      });

      return this.fetchPromise;
    } catch (error) {
      this.loading = false;
      this.error = error instanceof Error ? error : new Error('Unknown error fetching models');
      this.fetchPromise = null;
      return fallbackModels;
    }
  }

  // Force refresh models from the API
  async refreshModels(): Promise<ModelsData> {
    this.models = null;
    this.fetchPromise = null;
    return this.getModels();
  }

  // Check loading state
  isLoading(): boolean {
    return this.loading;
  }

  // Get last error
  getError(): Error | null {
    return this.error;
  }
}

// Export singleton instance
export const modelProvider = new ModelProvider(); 