'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { ImageSettings } from '@/types/content.types';

export default function ImageSettingsPage() {
  const [settings, setSettings] = useState<ImageSettings>({
    resolution: '1024x1024',
    format: 'png',
    quality: 85
  });

  const handleSave = () => {
    // Salvează în localStorage sau trimite la backend
    localStorage.setItem('imageSettings', JSON.stringify(settings));
    alert('Setările pentru imagini au fost salvate!');
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-6">
          <h1 className="text-3xl font-bold mb-8 gradient-text">
            Setări Imagini 🖼️
          </h1>

          <div className="max-w-2xl">
            <div className="glass rounded-xl p-6 space-y-6">
              {/* Rezoluție */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rezoluție
                </label>
                <select
                  value={settings.resolution}
                  onChange={(e) => setSettings({...settings, resolution: e.target.value as any})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                >
                  <option value="512x512">512x512 - Rapid</option>
                  <option value="1024x1024">1024x1024 - Standard</option>
                  <option value="1920x1080">1920x1080 - HD</option>
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Rezoluții mai mari necesită mai mult timp de procesare
                </p>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Format Output
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['png', 'jpg', 'webp'].map((format) => (
                    <button
                      key={format}
                      onClick={() => setSettings({...settings, format: format as any})}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        settings.format === format
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calitate */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Calitate: {settings.quality}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={settings.quality}
                  onChange={(e) => setSettings({...settings, quality: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>50% - Fișier mic</span>
                  <span>100% - Calitate maximă</span>
                </div>
              </div>

              {/* Parametri avansați */}
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Parametri Avansați</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Aplică îmbunătățiri automate</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Păstrează metadata EXIF</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Optimizează pentru web</span>
                  </label>
                </div>
              </div>

              {/* Butoane acțiune */}
              <div className="flex gap-3 pt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-600 to-secondary-600
                           hover:from-primary-700 hover:to-secondary-700 rounded-lg font-medium
                           transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Salvează Setările
                </button>
                <button
                  onClick={() => setSettings({ resolution: '1024x1024', format: 'png', quality: 85 })}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium
                           transition-colors"
                >
                  Resetează
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}