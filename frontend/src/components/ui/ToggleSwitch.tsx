import React from 'react';
import { ToggleSwitchProps } from '@/types/generator.types';

// Componenta pentru toggle switch
export const ToggleSwitch = ({ 
  checked, 
  onChange, 
  disabled = false,
  label,
  description,
  onIcon,
  offIcon,
}: ToggleSwitchProps) => {
  return (
    <div className="flex items-start space-x-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={onChange}
        className={`
          relative inline-flex shrink-0 h-6 w-11 border-2 rounded-full cursor-pointer transition-colors 
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${checked ? 'bg-primary-600 border-primary-400' : 'bg-gray-700 border-gray-600'}
        `}
      >
        <span 
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
        <span className="absolute inset-0 flex items-center justify-between px-1">
          {checked && onIcon && <span className="text-white text-xs">{onIcon}</span>}
          {!checked && offIcon && <span className="text-white text-xs ml-auto">{offIcon}</span>}
        </span>
      </button>
      <div>
        <div className="text-sm font-medium text-gray-200">{label}</div>
        {description && <div className="text-xs text-gray-400">{description}</div>}
      </div>
    </div>
  );
}; 