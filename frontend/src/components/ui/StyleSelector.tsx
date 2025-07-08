import React from 'react';
import { Check } from 'lucide-react';
import { StyleSelectorProps } from '@/types/generator.types';

// Componenta pentru selecția vizuală a stilurilor
export const StyleSelector = ({ 
  styles, 
  selectedStyle, 
  onSelect, 
  disabled 
}: StyleSelectorProps) => {
  return (
    <div className="space-y-3">
      {styles.map((category) => (
        <div key={category.category} className="space-y-2">
          <h4 className="text-xs text-gray-400 uppercase tracking-wider">{category.category}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {category.styles.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => onSelect(style.value)}
                disabled={disabled}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                  ${selectedStyle === style.value 
                    ? 'bg-primary-500/20 border border-primary-500/50 text-primary-300' 
                    : 'bg-gray-700/30 border border-gray-700 text-gray-300 hover:bg-gray-700/50'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="text-lg">{style.icon}</span>
                <span className="text-xs">{style.label}</span>
                {selectedStyle === style.value && (
                  <Check className="w-3 h-3 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 