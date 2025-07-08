'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Image, FileVideo, Volume2, VolumeX, 
  Maximize, Minimize, ChevronDown, ChevronUp 
} from 'lucide-react';

// Import tipuri și interfețe
import { GenerationSettings } from '@/types/content.types';
import { MainGeneratorProps } from '@/types/generator.types';

// Import componente UI
import { SettingsCard } from '@/components/ui/SettingsCard';
import { StyleSelector } from '@/components/ui/StyleSelector';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { ImageUploader } from '@/components/ui/ImageUploader';

// Import constante
import { 
  imageModels, 
  textModels, 
  animationModels, 
  imageStyles, 
  aspectRatios,
  animations 
} from '@/utils/generator-constants';

export default function MainGenerator({ onGenerate, isGenerating }: MainGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    numberOfScenes: 3,
    imageModel: 'gemini',
    textModel: 'gemini-pro',
    animationModel: 'kling',
    imageStyle: 'realistic',
    // Setări adiționale
    aspectRatio: '16:9',
    animationsEnabled: true,
    soundEnabled: false,
    referenceCharacterImage: null,
    referenceBackgroundImage: null,
    characterInfluence: 50,
    backgroundInfluence: 50
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Încărcare setări din localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('generatorSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsed,
        }));
      } catch (e) {
        console.error('Eroare la parsarea setărilor salvate:', e);
      }
    }
  }, []);
  
  // Salvare setări în localStorage când se modifică
  useEffect(() => {
    const settingsToSave = {
      imageModel: settings.imageModel,
      textModel: settings.textModel,
      animationModel: settings.animationModel,
      imageStyle: settings.imageStyle,
      aspectRatio: settings.aspectRatio,
      animationsEnabled: settings.animationsEnabled,
      soundEnabled: settings.soundEnabled,
    };
    
    localStorage.setItem('generatorSettings', JSON.stringify(settingsToSave));
  }, [settings.imageModel, settings.textModel, settings.animationModel, 
       settings.imageStyle, settings.aspectRatio, settings.animationsEnabled, 
       settings.soundEnabled]);

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

  // Funcție pentru procesarea imaginilor încărcate
  const handleImageUpload = useCallback((type: 'character' | 'background', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSettings(prev => ({
        ...prev,
        [type === 'character' ? 'referenceCharacterImage' : 'referenceBackgroundImage']: result
      }));
    };
    reader.readAsDataURL(file);
  }, []);

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

    if (settings.animationsEnabled && 
        !animationModels.some(model => model.value === settings.animationModel)) {
      newErrors.animationModel = 'Model animație invalid';
    }

    // Validare stil imagine
    const allStyles = imageStyles.flatMap(category => category.styles);
    if (!allStyles.some(style => style.value === settings.imageStyle)) {
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
      // Extragem setările pentru API, inclusiv proprietățile opționale relevante
      const apiSettings: GenerationSettings = {
        numberOfScenes: settings.animationsEnabled ? settings.numberOfScenes : 5, // 5 imagini statice când animațiile sunt dezactivate
        imageModel: settings.imageModel,
        textModel: settings.textModel,
        animationModel: settings.animationModel,
        imageStyle: settings.imageStyle,
        // Includem și celelalte proprietăți relevante
        aspectRatio: settings.aspectRatio,
        animationsEnabled: settings.animationsEnabled,
        soundEnabled: settings.soundEnabled,
        referenceCharacterImage: settings.referenceCharacterImage,
        referenceBackgroundImage: settings.referenceBackgroundImage,
        characterInfluence: settings.characterInfluence,
        backgroundInfluence: settings.backgroundInfluence
      };

      onGenerate(prompt.trim(), apiSettings);
    } catch (error) {
      console.error('Eroare la trimiterea formularului:', error);
      setErrors({ form: 'A apărut o eroare la trimiterea cererii' });
    }
  }, [prompt, settings, validateForm, onGenerate]);

  const characterCount = prompt.length;
  const maxCharacters = 5000;
  const isFormValid = promptValidation.isValid && Object.keys(errors).length === 0;

  // Animații pentru componente
  const fadeInUp = animations.fadeInUp;

  // Funcție pentru a renderiza iconițele de aspect ratio
  const renderAspectRatioIcon = (iconName: string) => {
    if (iconName === 'Maximize') return <Maximize className="w-5 h-5" />;
    if (iconName === 'Minimize') return <Minimize className="w-5 h-5 rotate-90" />;
    if (iconName === 'Square') return <div className="w-5 h-5 border-2 rounded-sm"></div>;
    return null;
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-4 md:p-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.div 
        className="glass rounded-2xl p-5 md:p-8 shadow-2xl border border-gray-800/50"
        variants={fadeInUp}
      >
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-6 gradient-text text-center"
          variants={fadeInUp}
        >
          Generator Conținut AI
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Error general */}
          {errors.form && (
            <motion.div 
              className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg"
              variants={fadeInUp}
            >
              {errors.form}
            </motion.div>
          )}

          {/* Textarea pentru prompt */}
          <motion.div variants={fadeInUp}>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              Descrieți conținutul pe care doriți să-l generați *
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={handlePromptChange}
                className={`w-full px-4 py-3 bg-gray-800/80 backdrop-blur-sm border rounded-xl
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         text-white placeholder-gray-400 resize-none transition-colors
                         ${errors.prompt ? 'border-red-500' : 'border-gray-700/50'}`}
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
          </motion.div>

          {/* Secțiunea principală de setări */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Setări de bază - stânga */}
            <div className="space-y-4">
              {/* Card pentru număr de scene */}
              <SettingsCard 
                title="Număr de scene" 
                icon={<FileVideo className="w-5 h-5" />}
                tooltip="Numărul de scene generate în animație sau numărul de imagini statice"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.numberOfScenes}
                    onChange={(e) => handleSettingsChange('numberOfScenes', parseInt(e.target.value))}
                    className="flex-1 accent-primary-500"
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
              </SettingsCard>
              
              {/* Card pentru aspect ratio */}
              <SettingsCard 
                title="Format" 
                icon={<Maximize className="w-5 h-5" />}
                tooltip="Formatul imaginilor generate"
              >
                <div className="grid grid-cols-3 gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.value}
                      type="button"
                      onClick={() => handleSettingsChange('aspectRatio', ratio.value)}
                      disabled={isGenerating}
                      className={`
                        flex flex-col items-center justify-center p-2 rounded-lg transition-all
                        ${settings.aspectRatio === ratio.value 
                          ? 'bg-primary-500/20 border border-primary-500/50 text-primary-300' 
                          : 'bg-gray-700/30 border border-gray-700 text-gray-300 hover:bg-gray-700/50'}
                      `}
                    >
                      {renderAspectRatioIcon(ratio.icon)}
                      <span className="text-xs mt-1">{ratio.value}</span>
                    </button>
                  ))}
                </div>
              </SettingsCard>
              
              {/* Card pentru model imagini */}
              <SettingsCard 
                title="Model generare imagini" 
                icon={<Image className="w-5 h-5" />}
                tooltip="Modelul AI folosit pentru generarea imaginilor"
              >
                <select
                  id="imageModel"
                  value={settings.imageModel}
                  onChange={(e) => handleSettingsChange('imageModel', e.target.value as 'gemini' | 'cgdream')}
                  className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg
                          focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          text-white transition-colors
                          ${errors.imageModel ? 'border-red-500' : 'border-gray-700/50'}`}
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
              </SettingsCard>
            </div>
            
            {/* Setări de bază - dreapta */}
            <div className="space-y-4">
              {/* Card pentru controlul animațiilor */}
              <SettingsCard 
                title="Generare" 
                icon={<FileVideo className="w-5 h-5" />}
                tooltip="Alegeți între imagini animate sau statice"
              >
                <div className="space-y-3">
                  <ToggleSwitch
                    checked={settings.animationsEnabled}
                    onChange={() => handleSettingsChange('animationsEnabled', !settings.animationsEnabled)}
                    disabled={isGenerating}
                    label="Generare animații"
                    description={settings.animationsEnabled 
                      ? "Se vor genera scene animate" 
                      : "Se vor genera " + settings.numberOfScenes + " imagini statice"}
                    onIcon={<FileVideo className="w-3 h-3" />}
                    offIcon={<Image className="w-3 h-3" />}
                  />
                  
                  {settings.animationsEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pt-2"
                    >
                      <label htmlFor="animationModel" className="block text-xs text-gray-400 mb-1">
                        Model animații
                      </label>
                      <select
                        id="animationModel"
                        value={settings.animationModel}
                        onChange={(e) => handleSettingsChange('animationModel', e.target.value as 'kling' | 'runway')}
                        className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg
                                 focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                 text-white transition-colors
                                 ${errors.animationModel ? 'border-red-500' : 'border-gray-700/50'}`}
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
                    </motion.div>
                  )}
                </div>
              </SettingsCard>
              
              {/* Card pentru controlul sunetului */}
              <SettingsCard 
                title="Sunet" 
                icon={settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                tooltip="Activează sau dezactivează sunetul pentru conținutul generat"
              >
                <ToggleSwitch
                  checked={settings.soundEnabled}
                  onChange={() => handleSettingsChange('soundEnabled', !settings.soundEnabled)}
                  disabled={isGenerating}
                  label="Generare sunet"
                  description={settings.soundEnabled 
                    ? "Se va genera sunet pentru animații/imagini" 
                    : "Conținut generat fără sunet"}
                  onIcon={<Volume2 className="w-3 h-3" />}
                  offIcon={<VolumeX className="w-3 h-3" />}
                />
              </SettingsCard>
              
              {/* Card pentru model text */}
              <SettingsCard 
                title="Model generare text" 
                icon={<Settings className="w-5 h-5" />}
                tooltip="Modelul AI folosit pentru generarea textelor"
              >
                <select
                  id="textModel"
                  value={settings.textModel}
                  onChange={(e) => handleSettingsChange('textModel', e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           text-white transition-colors
                           ${errors.textModel ? 'border-red-500' : 'border-gray-700/50'}`}
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
              </SettingsCard>
            </div>
          </motion.div>

          {/* Stiluri imagini */}
          <motion.div variants={fadeInUp}>
            <SettingsCard 
              title="Stil imagini" 
              icon={<Image className="w-5 h-5" />}
              tooltip="Alege stilul vizual pentru imaginile generate"
            >
              <StyleSelector 
                styles={imageStyles}
                selectedStyle={settings.imageStyle}
                onSelect={(style) => handleSettingsChange('imageStyle', style)}
                disabled={isGenerating}
              />
            </SettingsCard>
          </motion.div>

          {/* Buton pentru setări avansate */}
          <motion.div variants={fadeInUp}>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Setări avansate
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </motion.div>

          {/* Setări avansate */}
          {showAdvanced && (
            <motion.div 
              variants={fadeInUp}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-300 mb-4">Imagini de referință</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Referință personaj */}
                  <div>
                    <ImageUploader
                      label="Imagine personaj de referință"
                      onImageUpload={(file) => handleImageUpload('character', file)}
                      image={settings.referenceCharacterImage || null}
                      onImageRemove={() => handleSettingsChange('referenceCharacterImage', null)}
                      disabled={isGenerating}
                    />
                    {settings.referenceCharacterImage && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-400 mb-1">Influență: {settings.characterInfluence}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.characterInfluence}
                          onChange={(e) => handleSettingsChange('characterInfluence', parseInt(e.target.value))}
                          className="w-full accent-primary-500"
                          disabled={isGenerating}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Referință fundal */}
                  <div>
                    <ImageUploader
                      label="Imagine background de referință"
                      onImageUpload={(file) => handleImageUpload('background', file)}
                      image={settings.referenceBackgroundImage || null}
                      onImageRemove={() => handleSettingsChange('referenceBackgroundImage', null)}
                      disabled={isGenerating}
                    />
                    {settings.referenceBackgroundImage && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-400 mb-1">Influență: {settings.backgroundInfluence}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.backgroundInfluence}
                          onChange={(e) => handleSettingsChange('backgroundInfluence', parseInt(e.target.value))}
                          className="w-full accent-primary-500"
                          disabled={isGenerating}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Buton submit */}
          <motion.button
            type="submit"
            disabled={isGenerating || !isFormValid}
            className="w-full py-3 px-6 text-white font-medium rounded-xl
                     bg-gradient-to-r from-primary-600 to-secondary-600
                     hover:from-primary-700 hover:to-secondary-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 transform hover:scale-[1.02]
                     shadow-lg hover:shadow-xl
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-describedby="submit-help"
            variants={fadeInUp}
            whileHover={{ scale: isFormValid && !isGenerating ? 1.02 : 1 }}
            whileTap={{ scale: isFormValid && !isGenerating ? 0.98 : 1 }}
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
          </motion.button>
          {!isFormValid && (
            <p id="submit-help" className="text-sm text-gray-400 text-center">
              Completați toate câmpurile obligatorii pentru a continua
            </p>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}
