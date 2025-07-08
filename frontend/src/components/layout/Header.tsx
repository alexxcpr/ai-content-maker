'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'gallery',
    label: 'Galerie',
    href: '/gallery',
  },
  {
    id: 'pricing',
    label: 'Preturi',
    href: '/pages/preturi',
  },
  {
    id: 'challenge',
    label: 'Challenge',
    href: '/challenge',
  },
  {
    id: 'community',
    label: 'Comunitate',
    href: '/community',
  },
];

function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                AI Content Maker
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`
                        px-2 py-2 text-sm font-medium transition-colors
                        ${isActive 
                          ? 'text-primary-500 border-b-2 border-primary-500' 
                          : 'text-gray-300 hover:text-white'
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button 
              type="button" 
              className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* User profile or login */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-sm focus:outline-none"
                aria-label="User menu"
              >
                <span className="sr-only">Deschide meniul de utilizator</span>
                <div className="w-full h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                  <span className="text-white font-bold">AI</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default React.memo(Header);