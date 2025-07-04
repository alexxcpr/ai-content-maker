'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {isMounted ? (
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 mx-auto flex items-center justify-center mb-4"></div>
          )}
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Pagină negăsită
          </h2>
          
          <p className="text-gray-600 mb-4">
            Ne pare rău, dar pagina pe care o cauți nu există.
          </p>
          
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    </div>
  )
}