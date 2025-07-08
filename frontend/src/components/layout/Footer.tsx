'use client';

import React from 'react';
import Link from 'next/link';

interface FooterLink {
  id: string;
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Companie',
    links: [
      { id: 'about', label: 'Despre noi', href: '/about' },
      { id: 'careers', label: 'Cariere', href: '/careers' },
      { id: 'contact', label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resurse',
    links: [
      { id: 'blog', label: 'Blog', href: '/blog' },
      { id: 'docs', label: 'Documentație', href: '/docs' },
      { id: 'tutorials', label: 'Tutoriale', href: '/tutorials' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { id: 'terms', label: 'Termeni și condiții', href: '/terms' },
      { id: 'privacy', label: 'Politica de confidențialitate', href: '/privacy' },
      { id: 'cookies', label: 'Politica de cookies', href: '/cookies' },
    ],
  },
];

const socialLinks = [
  { id: 'twitter', icon: 'X', href: 'https://twitter.com/' },
  { id: 'github', icon: 'GitHub', href: 'https://github.com/' },
  { id: 'linkedin', icon: 'LinkedIn', href: 'https://linkedin.com/' },
  { id: 'discord', icon: 'Discord', href: 'https://discord.com/' },
];

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                AI Content Maker
              </span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Platforma ta pentru generarea conținutului digital folosind cele mai avansate tehnologii AI.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={link.icon}
                >
                  <span className="font-medium text-sm">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium text-white mb-4">{section.title}</h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} AI Content Maker. Toate drepturile rezervate.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              Realizat cu 💜 în România
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 

export default React.memo(Footer);