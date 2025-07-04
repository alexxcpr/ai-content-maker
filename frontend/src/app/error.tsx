'use client'

import { useEffect, useState } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
    const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.error('Application error:', error)
  }, [error])

  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Ceva nu a funcționat bine
          </h2>
          
          <p className="text-gray-600 mb-4">
            Ne pare rău, dar a apărut o eroare neașteptată. Te rugăm să încerci din nou.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-700 font-mono">
                {error.message || 'Eroare necunoscută'}
              </p>
            </div>
          )}
          
          <button
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    </div>
  )
}
