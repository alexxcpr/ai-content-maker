'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import MainGenerator from '@/components/features/MainGenerator';
import ProgressTracker from '@/components/features/ProgressTracker';
import SceneDisplay from '@/components/features/SceneDisplay';
import { GeneratedContent, GenerationSettings } from '@/types/content.types';
import { apiService } from '@/services/api';

const Sidebar = dynamic(() => import('@/components/layout/Sidebar'), { ssr: true });

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref pentru cleanup function
  const pollingCleanupRef = useRef<(() => void) | null>(null);

  // Cleanup polling când componenta se demontează
  useEffect(() => {
    return () => {
      if (pollingCleanupRef.current) {
        pollingCleanupRef.current();
      }
    };
  }, []);

  const handleGenerate = async (prompt: string, settings: GenerationSettings) => {
    // Oprește polling-ul anterior dacă există
    if (pollingCleanupRef.current) {
      pollingCleanupRef.current();
      pollingCleanupRef.current = null;
    }

    setIsGenerating(true);
    setShowProgress(true);
    setError(null);
    setGeneratedContent(null);

    try {
      // Validări suplimentare pe frontend
      if (!prompt || prompt.trim().length < 10) {
        throw new Error('Promptul trebuie să aibă cel puțin 10 caractere');
      }

      if (settings.numberOfScenes < 1 || settings.numberOfScenes > 10) {
        throw new Error('Numărul de scene trebuie să fie între 1 și 10');
      }

      // Trimite cererea la backend
      const response = await apiService.generateContent({
        userPrompt: prompt,
        numberOfScenes: settings.numberOfScenes,
        settings: {
          imageModel: settings.imageModel,
          textModel: settings.textModel,
          animationModel: settings.animationModel,
          imageStyle: settings.imageStyle
        }
      });

      // Începe polling pentru actualizări cu cleanup
      const cleanup = await apiService.pollContentStatus(
        response.contentId,
        (content) => {
          setGeneratedContent(content);
        },
        {
          interval: 2000,
          maxRetries: 30, // 1 minut de retry-uri
          onError: (pollingError) => {
            console.error('Eroare la polling:', pollingError);
            setError(`Eroare la urmărirea progresului: ${pollingError.message}`);
            setIsGenerating(false);
          },
          onComplete: () => {
            setIsGenerating(false);
            pollingCleanupRef.current = null;
          }
        }
      );

      // Salvează cleanup function
      pollingCleanupRef.current = cleanup;

    } catch (err) {
      console.error('Eroare la generare:', err);
      
      let errorMessage = 'Eroare la generare conținut';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      setIsGenerating(false);
      setShowProgress(false);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleRetry = () => {
    if (generatedContent && generatedContent.userPrompt) {
      // Reîncearcă cu ultimele setări
      const lastSettings: GenerationSettings = {
        numberOfScenes: generatedContent.settings.numberOfScenes,
        imageModel: generatedContent.settings.imageModel as 'gemini' | 'cgdream',
        textModel: generatedContent.settings.textModel,
        animationModel: generatedContent.settings.animationModel as 'kling' | 'runway',
        imageStyle: generatedContent.settings.imageStyle as 'realistic' | 'cartoon' | 'artistic' | 'abstract',
        // Adăugăm proprietățile obligatorii lipsă
        animationsEnabled: generatedContent.settings.animationsEnabled ?? true,
        soundEnabled: generatedContent.settings.soundEnabled ?? false
      };
      
      handleGenerate(generatedContent.userPrompt, lastSettings);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 gradient-text animate-gradient">
              AI Content Maker
            </h1>
            <p className="text-xl text-gray-400">
              Transformă ideile tale în povești vizuale captivante
            </p>
          </header>

          {/* Error Display */}
          {error && (
            <div className="max-w-4xl mx-auto mb-6">
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-start justify-between">
                <div>
                  <p className="font-medium">Eroare:</p>
                  <p>{error}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {generatedContent && (
                    <button
                      onClick={handleRetry}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                      disabled={isGenerating}
                    >
                      Reîncearcă
                    </button>
                  )}
                  <button
                    onClick={handleDismissError}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm font-medium transition-colors"
                  >
                    Închide
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Generator Form */}
          <MainGenerator 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating} 
          />

          {/* Progress Tracker */}
          {showProgress && generatedContent && (
            <ProgressTracker 
              scenes={generatedContent.scenes}
              totalScenes={generatedContent.settings.numberOfScenes}
              overallStatus={generatedContent.overallStatus}
            />
          )}

          {/* Scene Display */}
          {generatedContent && generatedContent.scenes.length > 0 && (
            <SceneDisplay scenes={generatedContent.scenes} />
          )}

          {/* Loading state când nu avem încă conținut */}
          {isGenerating && !generatedContent && (
            <div className="max-w-4xl mx-auto mt-8">
              <div className="glass rounded-2xl p-8 text-center">
                <div className="animate-spin h-12 w-12 mx-auto mb-4">
                  <svg viewBox="0 0 24 24" className="text-primary-500">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Inițializare generare...</h3>
                <p className="text-gray-400">Vă rugăm așteptați mentre procesăm cererea dumneavoastră</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}