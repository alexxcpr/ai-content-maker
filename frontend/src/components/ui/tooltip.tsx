'use client';

import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg 
                        bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 
                        transition-opacity duration-300 whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-px border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}; 