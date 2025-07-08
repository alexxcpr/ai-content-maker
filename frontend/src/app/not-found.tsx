'use client'

import Link from 'next/link'
import { useEffect, useState, memo } from 'react'

// Forțează această pagină să fie renderizată static
export const dynamic = 'force-static'

// Iconul SVG poate fi extras ca o componentă separată pentru o mai bună performanță
const WarningIcon = memo(() => (
  <svg
    className="w-12 h-12 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
))

WarningIcon.displayName = 'WarningIcon'

function NotFound() {
  // Folosim o abordare mai eficientă pentru a detecta montarea
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    // Curățăm starea la demontare pentru a evita memory leaks
    return () => setIsMounted(false)
  }, [])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full mx-auto text-center px-4">
        <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center mb-6 shadow-xl shadow-primary-600/20">
            {isMounted && <WarningIcon />}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            404 - Pagină negăsită
          </h2>
          
          <p className="text-gray-300 mb-8">
            Ne pare rău, dar pagina pe care o cauți nu există sau a fost mutată.
          </p>
          
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 shadow-lg shadow-primary-600/20"
          >
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    </div>
  )
}

// Folosim React.memo pentru a preveni re-renderizări inutile
export default memo(NotFound)