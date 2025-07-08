'use client';

import React, { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

// Grupează itemele pentru organizare mai bună
interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    title: 'Conținut',
    items: [
      {
        id: 'image-settings',
        label: 'Setări Imagini',
        icon: '🖼️',
        href: '/pages/settings/images'
      },
      {
        id: 'animation-settings',
        label: 'Setări Animații',
        icon: '🎬',
        href: '/pages/settings/animations'
      },
      {
        id: 'text-settings',
        label: 'Setări Conținut Text',
        icon: '📝',
        href: '/pages/settings/text'
      }
    ]
  }
];

function Sidebar() {
  const pathname = usePathname();
  // Inițializează cu valoarea din localStorage sau false dacă nu există
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Încarcă starea din localStorage la prima randare
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);
  
  // Funcție pentru a actualiza starea și a o salva în localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  return (
    <aside 
      className={`
        ${isCollapsed ? 'w-20' : 'w-72'} 
        min-h-screen bg-gray-900 border-r border-gray-800
        transition-all duration-300 ease-in-out
        flex flex-col relative
        shadow-xl shadow-gray-900/20
      `}
    >
      {/* Design element - top gradient */}
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
      
      {/* Header */}
      <div className="p-6 border-b border-gray-800/60">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-600/20">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
              Setări
            </h2>
          </div>
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-800/70 transition-colors bg-gray-800/40 text-gray-400 hover:text-white"
            aria-label="Toggle sidebar"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d={isCollapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-900">
        {sidebarGroups.map((group, idx) => (
          <div key={group.title} className={`mb-6 ${idx > 0 ? 'mt-6' : ''}`}>
            {!isCollapsed && (
              <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-6 mb-3">
                {group.title}
              </h3>
            )}
            <ul className={`space-y-1 ${isCollapsed ? 'px-3' : 'px-4'}`}>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 rounded-xl
                        transition-all duration-200 overflow-hidden
                        ${isCollapsed ? 'justify-center py-3 px-2' : 'px-4 py-3'}
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary-600/80 to-primary-600/50 text-white shadow-lg shadow-primary-600/20' 
                          : 'hover:bg-gray-800/70 text-gray-400 hover:text-white'
                        }
                        group
                      `}
                    >
                      <div className={`
                        ${isActive ? 'bg-white/20' : 'bg-gray-800/70 group-hover:bg-gray-700/70'} 
                        p-2 rounded-lg transition-colors
                      `}>
                        <span className="text-xl">{item.icon}</span>
                      </div>
                      
                      {!isCollapsed && (
                        <span className="font-medium text-sm truncate">
                          {item.label}
                        </span>
                      )}
                      
                      {isActive && !isCollapsed && (
                        <span className="ml-auto">
                          <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default memo(Sidebar);