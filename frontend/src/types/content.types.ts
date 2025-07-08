// Tipuri pentru setările de generare
export interface GenerationSettings {
  numberOfScenes: number;
  imageModel: 'gemini' | 'cgdream';
  textModel: string;
  animationModel: 'kling' | 'runway';
  imageStyle: 'realistic' | 'cartoon' | 'artistic' | 'abstract' | 
              'photographic' | 'cinematic' | 'oil-painting' | 'watercolor' | 
              'anime' | 'pixel-art';
  // Proprietăți adăugate din ExtendedGenerationSettings
  aspectRatio?: string;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  referenceCharacterImage?: string | null;
  referenceBackgroundImage?: string | null;
  characterInfluence?: number;
  backgroundInfluence?: number;
}

// Tipuri pentru scene
export interface SceneStatus {
  text: 'completed' | 'pending' | 'error';
  image: 'completed' | 'pending' | 'error';
  animation: 'completed' | 'pending' | 'error';
}

export interface Scene {
  sceneNumber: number;
  continut_text: string;
  descriere_imagine: string;
  imagine: string | null;
  descriere_animatie: string;
  imagine_animata: string | null;
  status: SceneStatus;
}

// Tipuri pentru conținut generat
export interface GeneratedContent {
  _id: string;
  userId: string;
  createdAt: Date;
  userPrompt: string;
  settings: GenerationSettings;
  scenes: Scene[];
  overallStatus: 'processing' | 'completed' | 'partial' | 'error';
}

// Tipuri pentru request-uri
export interface GenerateContentRequest {
  userPrompt: string;
  numberOfScenes: number;
  settings: {
    imageModel: string;
    textModel: string;
    animationModel: string;
    imageStyle: string;
    // Proprietăți adăugate din ExtendedGenerationSettings
    aspectRatio?: string;
    animationsEnabled?: boolean;
    soundEnabled?: boolean;
    referenceCharacterImage?: string | null;
    referenceBackgroundImage?: string | null;
    characterInfluence?: number;
    backgroundInfluence?: number;
  };
}

// Tipuri pentru setări UI
export interface ImageSettings {
  resolution: '512x512' | '1024x1024' | '1920x1080';
  format: 'png' | 'jpg' | 'webp';
  quality: number;
}

export interface AnimationSettings {
  duration: number;
  fps: 24 | 30 | 60;
  transition: 'fade' | 'slide' | 'zoom';
}

export interface TextSettings {
  maxLength: number;
  tone: 'formal' | 'casual' | 'creative' | 'educational';
  language: 'ro' | 'en';
} 