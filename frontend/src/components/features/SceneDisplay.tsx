'use client';

import React, { useState } from 'react';
import { Scene } from '@/types/content.types';

interface SceneDisplayProps {
  scenes: Scene[];
}

export default function SceneDisplay({ scenes }: SceneDisplayProps) {
  const [expandedScenes, setExpandedScenes] = useState<Set<number>>(new Set());

  const toggleSceneExpansion = (sceneNumber: number) => {
    const newExpanded = new Set(expandedScenes);
    if (newExpanded.has(sceneNumber)) {
      newExpanded.delete(sceneNumber);
    } else {
      newExpanded.add(sceneNumber);
    }
    setExpandedScenes(newExpanded);
  };

  const downloadImage = (imageUrl: string, sceneName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${sceneName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (scenes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-gray-400">
            Nicio scenă generată încă
          </h3>
          <p className="text-gray-500 mt-2">
            Folosiți formularul de mai sus pentru a genera conținut
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Scene Generate</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scenes.map((scene) => {
          const isExpanded = expandedScenes.has(scene.sceneNumber);
          const isComplete = scene.status.text === 'completed' && 
                           scene.status.image === 'completed' && 
                           scene.status.animation === 'completed';

          return (
            <div
              key={scene.sceneNumber}
              className={`glass rounded-xl overflow-hidden transition-all duration-300 ${
                isComplete ? 'shadow-xl' : 'opacity-75'
              }`}
            >
              {/* Header scenă */}
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Scena {scene.sceneNumber}
                </h3>
                <div className="flex gap-2">
                  {isComplete && (
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                      Completă
                    </span>
                  )}
                  <button
                    onClick={() => toggleSceneExpansion(scene.sceneNumber)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Preview imagine */}
              {scene.imagine && (
                <div className="relative group">
                  <img
                    src={scene.imagine}
                    alt={`Scena ${scene.sceneNumber}`}
                    className="w-full h-64 object-cover"
                  />
                  {scene.imagine_animata && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Vizualizează Animația
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Conținut text */}
              <div className="p-4">
                <p className={`text-gray-300 ${isExpanded ? '' : 'line-clamp-3'}`}>
                  {scene.continut_text || 'Text în curs de generare...'}
                </p>
              </div>

              {/* Detalii expandate */}
              {isExpanded && (
                <div className="p-4 pt-0 space-y-4 border-t border-gray-700">
                  {/* Descriere imagine */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">
                      Descriere Imagine
                    </h4>
                    <p className="text-sm text-gray-300">
                      {scene.descriere_imagine || 'În curs de generare...'}
                    </p>
                  </div>

                  {/* Descriere animație */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">
                      Descriere Animație
                    </h4>
                    <p className="text-sm text-gray-300">
                      {scene.descriere_animatie || 'În curs de generare...'}
                    </p>
                  </div>

                  {/* Acțiuni */}
                  {isComplete && scene.imagine && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => downloadImage(scene.imagine!, `scena-${scene.sceneNumber}`)}
                        className="flex-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descarcă Imagine
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.114 15.562 18 16.018 18 16.5c0 .482.114.938.316 1.342m0-2.684a3 3 0 100 2.684M12 8.5a3 3 0 100 6 3 3 0 000-6z" />
                        </svg>
                        Partajează
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}