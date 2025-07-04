'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'image-settings',
    label: 'Setări Imagini',
    icon: '🖼️',
    href: '/settings/images'
  },
  {
    id: 'animation-settings',
    label: 'Setări Animații',
    icon: '🎬',
    href: '/settings/animations'
  },
  {
    id: 'text-settings',
    label: 'Setări Conținut Text',
    icon: '📝',
    href: '/settings/text'
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`
      ${isCollapsed ? 'w-20' : 'w-64'}
      min-h-screen bg-gray-900 border-r border-gray-800
      transition-all duration-300 ease-in-out
      flex flex-col
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className={`font-bold text-xl gradient-text ${isCollapsed ? 'hidden' : 'block'}`}>
            Setări
          </h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg 
              className="w-6 h-6 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isCollapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                      : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                    }
                  `}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-gray-300">Content Maker</p>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
