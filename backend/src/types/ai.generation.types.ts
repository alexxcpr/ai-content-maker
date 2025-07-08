// Types for AI generation models and responses

import { Scene } from './content.types';

// Available AI models
export type TextGenerationModel = 
                                'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-2.5-flash-lite-preview-06-17' |
                                'gpt-4' | 'gpt-4o' | 'gpt-4o-mini';
                                
export type ImageGenerationModel = 'gemini' | 'cgdream';
export type AnimationGenerationModel = 'kling' | 'runway';


export interface AISceneResponse {
  sceneNumber: number;
  continut_text: string;
  descriere_imagine: string;
  descriere_animatie: string;
}

// Generic interface for AI generation responses
export interface AIGenerationResponse {
  scenes: Scene[];
}

// Specific request interfaces for each AI generation type
export interface AITextGenerationRequest {
  prompt: string;
  numberOfScenes: number;
  model: TextGenerationModel;
  language?: 'ro' | 'en';
  tone?: 'formal' | 'casual' | 'creative' | 'educational';
  maxLength?: number;
}

export interface AIImageGenerationRequest {
  description: string;
  model: ImageGenerationModel;
  style: string;
  aspectRatio?: string;
  resolution?: string;
  referenceImage?: string | null;
  influence?: number;
}

export interface AIAnimationGenerationRequest {
  imageUrl: string;
  description: string;
  model: AnimationGenerationModel;
  duration?: number;
  fps?: 24 | 30 | 60;
  transition?: 'fade' | 'slide' | 'zoom';
}
