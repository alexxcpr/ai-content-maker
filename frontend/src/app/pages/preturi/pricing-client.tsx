'use client';

import React, { memo } from 'react';

function PricingClient() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Header secțiune */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Planuri de prețuri flexibile
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Alegeți planul potrivit pentru nevoile dumneavoastră de creare de conținut
            </p>
            <div className="flex items-center justify-center space-x-3 mb-8">
              <span className="bg-primary-600/20 text-primary-400 text-sm py-1 px-3 rounded-full">
                Economisiți 30% cu abonamentul lunar
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>

      {/* Carduri de prețuri */}
      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pachet simplu */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 shadow-xl hover:shadow-primary-600/10 group">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="p-2 bg-primary-600/20 rounded-lg">
                  <span className="text-2xl">🎬</span>
                </span>
                <h3 className="text-xl font-bold">Pachet Simplu</h3>
              </div>
              
              <p className="text-gray-400 mb-6 h-12">Perfect pentru conținut rapid și simple postări sociale</p>
              
              <div className="mb-6">
                <p className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent inline-flex items-end">
                  $3.50
                  <span className="text-gray-400 text-sm font-normal ml-1">/ video</span>
                </p>
              </div>
              
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>1 imagine animată</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>5 secunde de conținut</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Export video .mp4</span>
                </li>
              </ul>
              
              <button className="w-full py-3 px-6 bg-gradient-to-r from-primary-600/80 to-secondary-600/80 hover:from-primary-600 hover:to-secondary-600 rounded-xl text-white font-medium transition-all duration-200 shadow-lg shadow-primary-600/10 hover:shadow-primary-600/20">
                Comandă acum
              </button>
            </div>
          </div>

          {/* Pachet complex */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-primary-500/50 transition-all duration-300 shadow-xl shadow-primary-600/10 hover:shadow-primary-600/20 transform md:scale-105 md:translate-y-[-8px] relative group z-10 mt-6 md:mt-0">
            {/* Badge Recomandat - poziționare și stilizare îmbunătățită */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-bold py-1 px-4 rounded-full shadow-lg">
                Recomandat
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
            
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="p-2 bg-primary-600/30 rounded-lg">
                  <span className="text-2xl">🎞️</span>
                </span>
                <h3 className="text-xl font-bold">Pachet Complex</h3>
              </div>
              
              <p className="text-gray-400 mb-6 h-12">Ideal pentru conținut de calitate superioară pentru social media</p>
              
              <div className="mb-6">
                <p className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent inline-flex items-end">
                  $4.00
                  <span className="text-gray-400 text-sm font-normal ml-1">/ video</span>
                </p>
              </div>
              
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>5 imagini animate</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>25 secunde de conținut</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Muzică de fundal inclusă</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Tranziții profesionale</span>
                </li>
              </ul>
              
              <button className="w-full py-3 px-6 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 rounded-xl text-white font-medium transition-all duration-200 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30">
                Comandă acum
              </button>
            </div>
          </div>

          {/* Abonament lunar */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 shadow-xl hover:shadow-primary-600/10 group">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="p-2 bg-primary-600/20 rounded-lg">
                  <span className="text-2xl">📅</span>
                </span>
                <h3 className="text-xl font-bold">Abonament PRO</h3>
              </div>
              
              <p className="text-gray-400 mb-6 h-12">Pentru afaceri care necesită conținut video în mod regulat</p>
              
              <div className="mb-6">
                <p className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent inline-flex items-end">
                  $70
                  <span className="text-gray-400 text-sm font-normal ml-1">/ lună</span>
                </p>
                <p className="text-green-400 text-sm mt-1">Economisești $80 lunar</p>
              </div>
              
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>10 videoclipuri simple</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>10 videoclipuri complexe</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Voiceover + branding</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Prioritate la livrare</span>
                </li>
              </ul>
              
              <button className="w-full py-3 px-6 bg-gradient-to-r from-primary-600/80 to-secondary-600/80 hover:from-primary-600 hover:to-secondary-600 rounded-xl text-white font-medium transition-all duration-200 shadow-lg shadow-primary-600/10 hover:shadow-primary-600/20">
                Activează abonamentul
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="container mx-auto px-6 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Întrebări frecvente</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Aflați mai multe despre serviciile noastre și cum vă pot ajuta să creați conținut video de impact</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Cât timp durează livrarea?</h3>
            <p className="text-gray-400">Videoclipurile simple sunt livrate în maxim 24 de ore, iar cele complexe în maxim 48 de ore.</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Ce formate de fișiere sunt acceptate?</h3>
            <p className="text-gray-400">Livrăm în format MP4, dar la cerere putem oferi și alte formate precum MOV sau WebM.</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Pot solicita revizuiri?</h3>
            <p className="text-gray-400">Da, fiecare pachet include două revizuiri gratuite pentru fiecare video.</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Ce este inclus în branding?</h3>
            <p className="text-gray-400">Includerea logo-ului, culorilor personalizate și fonturilor specifice brandului dumneavoastră.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 mt-20">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-secondary-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Pregătit să începeți?</h2>
            <p className="text-gray-300 mb-6">Creați conținut video de impact cu AI Content Maker, rapid și fără efort</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg shadow-primary-600/20">
                Comandă primul video
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200">
                Programează o demonstrație
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exportăm componenta memorată pentru a preveni re-renderizări inutile
export default memo(PricingClient); 