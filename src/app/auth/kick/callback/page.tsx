'use client'

import { useEffect } from 'react'

export default function KickCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    // Send message to parent window
    if (window.opener) {
      if (error) {
        window.opener.postMessage({
          type: 'KICK_AUTH_ERROR',
          error: error || 'Authentication failed'
        }, window.location.origin)
      } else if (code) {
        window.opener.postMessage({
          type: 'KICK_AUTH_SUCCESS',
          code: code
        }, window.location.origin)
      }
    }

    // Close the popup
    window.close()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-cyan-400">Processing authentication...</p>
      </div>
    </div>
  )
}
