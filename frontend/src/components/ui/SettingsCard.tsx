import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { SettingsCardProps } from '@/types/generator.types';

// Componenta pentru card-uri în secțiunile de setări
export const SettingsCard = ({ 
  title, 
  icon, 
  children, 
  tooltip 
}: SettingsCardProps) => (
  <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-gray-800/70">
    <div className="flex items-center gap-2 mb-3">
      <div className="text-primary-400">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-200">{title}</h3>
      {tooltip && (
        <Tooltip content={tooltip}>
          <div className="cursor-help text-gray-500 hover:text-gray-300">
            <Info className="w-4 h-4" />
          </div>
        </Tooltip>
      )}
    </div>
    <div>
      {children}
    </div>
  </div>
); 