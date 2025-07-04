'use client';

import React from 'react';
import { Scene } from '@/types/content.types';

interface ProgressTrackerProps {
  scenes: Scene[];
  totalScenes: number;
  overallStatus: 'processing' | 'completed' | 'partial' | 'error';
}

export default function ProgressTracker({ scenes, totalScenes, overallStatus }: ProgressTrackerProps) {
  const completedScenes = scenes.filter(scene => 
    scene.status.text === 'completed' && 
    scene.status.image === 'completed' && 
    scene.status.animation === 'completed'
  ).length;

  const progressPercentage = (completedScenes / totalScenes) * 100;

  const getStatusIcon = (status: 'completed' | 'pending' | 'error') => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'error':
        return '❌';
    }
  };

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'processing':
        return '🔄 Generare Conținut în Progres...';
      case 'completed':
        return '✅ Generare Completă!';
      case 'partial':
        return '⚠️ Generare Parțială Completă';
      case 'error':
        return '❌ Eroare la Generare';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="glass rounded-2xl p-6 shadow-xl">
        {/* Header cu status general */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{getOverallStatusMessage()}</h2>
          <p className="text-gray-400">
            Scene completate: {completedScenes} din {totalScenes}
          </p>
        </div>

        {/* Progress bar general */}
        <div className="mb-8">
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse" />
            </div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-400">
            {progressPercentage.toFixed(0)}% Complet
          </p>
        </div>

        {/* Status individual pentru fiecare scenă */}
        <div className="space-y-4">
          {scenes.map((scene) => (
            <div key={scene.sceneNumber} className="border border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-lg">
                Scena {scene.sceneNumber}/{totalScenes}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Text */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getStatusIcon(scene.status.text)}</span>
                  <div>
                    <p className="text-sm font-medium">Text generat</p>
                    <p className="text-xs text-gray-400">
                      {scene.status.text === 'completed' && scene.continut_text 
                        ? `${scene.continut_text.substring(0, 50)}...` 
                        : 'În așteptare...'}
                    </p>
                  </div>
                </div>

                {/* Status Imagine */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getStatusIcon(scene.status.image)}</span>
                  <div>
                    <p className="text-sm font-medium">Imagine</p>
                    <p className="text-xs text-gray-400">
                      {scene.status.image === 'pending' && 'În curs de generare...'}
                      {scene.status.image === 'completed' && 'Generată cu succes'}
                      {scene.status.image === 'error' && 'Eroare la generare'}
                    </p>
                  </div>
                </div>

                {/* Status Animație */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getStatusIcon(scene.status.animation)}</span>
                  <div>
                    <p className="text-sm font-medium">Animație</p>
                    <p className="text-xs text-gray-400">
                      {scene.status.animation === 'pending' && 'În așteptare...'}
                      {scene.status.animation === 'completed' && 'Animație completă'}
                      {scene.status.animation === 'error' && 'Eroare la animare'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview imagine dacă există */}
              {scene.imagine && (
                <div className="mt-4">
                  <img 
                    src={scene.imagine} 
                    alt={`Scena ${scene.sceneNumber}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Estimare timp rămas */}
        {overallStatus === 'processing' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Timp estimat rămas: ~{Math.ceil((totalScenes - completedScenes) * 30)} secunde
            </p>
          </div>
        )}
      </div>
    </div>
  );
}