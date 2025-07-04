'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { GenerationSettings } from '@/types/content.types';

interface MainGeneratorProps {
  onGenerate: (prompt: string, settings: GenerationSettings) => void;
  isGenerating: boolean;
}

const imageModels = [
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'cgdream', label: 'CGDream AI' }
] as const;

const textModels = [
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' }
] as const;

const animationModels = [
  { value: 'kling', label: 'Kling AI' },
  { value: 'runway', label: 'Runway ML' }
] as const;

const imageStyles = [
  { value: 'realistic', label: 'Realist' },
  { value: 'cartoon', label: 'Desen animat' },
  { value: 'artistic', label: 'Artistic' },
  { value: 'abstract', label: 'Abstract' }
] as const;

export default function MainGenerator({ onGenerate, isGenerating }: MainGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    numberOfScenes: 3,
    imageModel: 'gemini',
    textModel: 'gemini-pro',
    animationModel: 'kling',
    imageStyle: 'realistic'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validare prompt în timp real
  const promptValidation = useMemo(() => {
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length === 0) {
      return { isValid: false, message: 'Promptul este necesar' };
    }
    if (trimmedPrompt.length < 10) {
      return { isValid: false, message: 'Promptul trebuie să aibă cel puțin 10 caractere' };
    }
    if (trimmedPrompt.length > 5000) {
      return { isValid: false, message: 'Promptul nu poate depăși 5000 de caractere' };
    }
    return { isValid: true, message: '' };
  }, [prompt]);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    
    // Curăță eroarea pentru prompt dacă există
    if (errors.prompt) {
      setErrors(prev => ({ ...prev, prompt: '' }));
    }
  }, [errors.prompt]);

  const handleSettingsChange = useCallback((key: keyof GenerationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Curăță eroarea pentru acest câmp dacă există
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validare prompt
    if (!promptValidation.isValid) {
      newErrors.prompt = promptValidation.message;
    }

    // Validare număr scene
    if (settings.numberOfScenes < 1 || settings.numberOfScenes > 10) {
      newErrors.numberOfScenes = 'Numărul de scene trebuie să fie între 1 și 10';
    }

    // Validare modele
    if (!imageModels.some(model => model.value === settings.imageModel)) {
      newErrors.imageModel = 'Model imagine invalid';
    }

    if (!textModels.some(model => model.value === settings.textModel)) {
      newErrors.textModel = 'Model text invalid';
    }

    if (!animationModels.some(model => model.value === settings.animationModel)) {
      newErrors.animationModel = 'Model animație invalid';
    }

    if (!imageStyles.some(style => style.value === settings.imageStyle)) {
      newErrors.imageStyle = 'Stil imagine invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [promptValidation, settings]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      onGenerate(prompt.trim(), settings);
    } catch (error) {
      console.error('Eroare la trimiterea formularului:', error);
      setErrors({ form: 'A apărut o eroare la trimiterea cererii' });
    }
  }, [prompt, settings, validateForm, onGenerate]);

  const characterCount = prompt.length;
  const maxCharacters = 5000;
  const isFormValid = promptValidation.isValid && Object.keys(errors).length === 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 gradient-text text-center">
          Generator Conținut AI
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Error general */}
          {errors.form && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {errors.form}
            </div>
          )}

          {/* Textarea pentru prompt */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              Descrieți conținutul pe care doriți să-l generați *
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={handlePromptChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg 
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         text-white placeholder-gray-400 resize-none transition-colors
                         ${errors.prompt ? 'border-red-500' : 'border-gray-700'}`}
                rows={4}
                placeholder="Ex: Creează o poveste despre un astronaut care descoperă o planetă misterioasă..."
                disabled={isGenerating}
                maxLength={maxCharacters}
                aria-describedby={errors.prompt ? 'prompt-error' : 'prompt-help'}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {characterCount}/{maxCharacters}
              </div>
            </div>
            {errors.prompt && (
              <p id="prompt-error" className="mt-1 text-sm text-red-400" role="alert">
                {errors.prompt}
              </p>
            )}
            {!errors.prompt && !promptValidation.isValid && (
              <p id="prompt-help" className="mt-1 text-sm text-gray-400">
                {promptValidation.message}
              </p>
            )}
          </div>

          {/* Grid pentru setări */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Număr de scene */}
            <div>
              <label htmlFor="scenes" className="block text-sm font-medium text-gray-300 mb-2">
                Număr de scene *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="scenes"
                  min="1"
                  max="10"
                  value={settings.numberOfScenes}
                  onChange={(e) => handleSettingsChange('numberOfScenes', parseInt(e.target.value))}
                  className="flex-1"
                  disabled={isGenerating}
                  aria-describedby={errors.numberOfScenes ? 'scenes-error' : undefined}
                />
                <span className="text-xl font-bold text-primary-400 w-8 text-center">
                  {settings.numberOfScenes}
                </span>
              </div>
              {errors.numberOfScenes && (
                <p id="scenes-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.numberOfScenes}
                </p>
              )}
            </div>

            {/* Model imagini */}
            <div>
              <label htmlFor="imageModel" className="block text-sm font-medium text-gray-300 mb-2">
                Model generare imagini *
              </label>
              <select
                id="imageModel"
                value={settings.imageModel}
                onChange={(e) => handleSettingsChange('imageModel', e.target.value as 'gemini' | 'cgdream')}
                className={`w-full px-4 py-2 bg-gray-800 border rounded-lg
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         text-white transition-colors
                         ${errors.imageModel ? 'border-red-500' : 'border-gray-700'}`}
                disabled={isGenerating}
                aria-describedby={errors.imageModel ? 'imageModel-error' : undefined}
              >
                {imageModels.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
              {errors.imageModel && (
                <p id="imageModel-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.imageModel}
                </p>
              )}
            </div>

            {/* Model text */}
            <div>
              <label htmlFor="textModel" className="block text-sm font-medium text-gray-300 mb-2">
                Model generare text *
              </label>
              <select
                id="textModel"
                value={settings.textModel}
                onChange={(e) => handleSettingsChange('textModel', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-800 border rounded-lg
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         text-white transition-colors
                         ${errors.textModel ? 'border-red-500' : 'border-gray-700'}`}
                disabled={isGenerating}
                aria-describedby={errors.textModel ? 'textModel-error' : undefined}
              >
                {textModels.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
              {errors.textModel && (
                <p id="textModel-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.textModel}
                </p>
              )}
            </div>

            {/* Model animații */}
            <div>
              <label htmlFor="animationModel" className="block text-sm font-medium text-gray-300 mb-2">
                Model generare animații *
              </label>
              <select
                id="animationModel"
                value={settings.animationModel}
                onChange={(e) => handleSettingsChange('animationModel', e.target.value as 'kling' | 'runway')}
                className={`w-full px-4 py-2 bg-gray-800 border rounded-lg
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         text-white transition-colors
                         ${errors.animationModel ? 'border-red-500' : 'border-gray-700'}`}
                disabled={isGenerating}
                aria-describedby={errors.animationModel ? 'animationModel-error' : undefined}
              >
                {animationModels.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
              {errors.animationModel && (
                <p id="animationModel-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.animationModel}
                </p>
              )}
            </div>

            {/* Stil imagine */}
            <div className="md:col-span-2">
              <label htmlFor="imageStyle" className="block text-sm font-medium text-gray-300 mb-2">
                Stil imagine *
              </label>
              <select
                id="imageStyle"
                value={settings.imageStyle}
                onChange={(e) => handleSettingsChange('imageStyle', e.target.value as any)}
                className={`w-full px-4 py-2 bg-gray-800 border rounded-lg
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         text-white transition-colors
                         ${errors.imageStyle ? 'border-red-500' : 'border-gray-700'}`}
                disabled={isGenerating}
                aria-describedby={errors.imageStyle ? 'imageStyle-error' : undefined}
              >
                {imageStyles.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
              {errors.imageStyle && (
                <p id="imageStyle-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.imageStyle}
                </p>
              )}
            </div>
          </div>

          {/* Buton submit */}
          <button
            type="submit"
            disabled={isGenerating || !isFormValid}
            className="w-full py-3 px-6 text-white font-medium rounded-lg
                     bg-gradient-to-r from-primary-600 to-secondary-600
                     hover:from-primary-700 hover:to-secondary-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 transform hover:scale-[1.02]
                     shadow-lg hover:shadow-xl
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-describedby="submit-help"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generare în curs...
              </span>
            ) : (
              'Generează Conținut'
            )}
          </button>
          {!isFormValid && (
            <p id="submit-help" className="text-sm text-gray-400 text-center">
              Completați toate câmpurile obligatorii pentru a continua
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
