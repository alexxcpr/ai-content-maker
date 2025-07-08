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
    aspectRatio: string;
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