'use client'

import { useEffect } from 'react'

export default function KickCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    // Get the return URL from session storage
    const returnUrl = sessionStorage.getItem('kickAuthReturn') || '/'

    if (code) {
      // Store the auth code and redirect to main page
      sessionStorage.setItem('kickAuthCode', code)
      window.location.href = returnUrl + '?auth=success'
    } else if (error) {
      // Handle error and redirect back
      window.location.href = returnUrl + '?auth=error&message=' + encodeURIComponent(error)
    } else {
      // No code or error, redirect back
      window.location.href = returnUrl + '?auth=error&message=no_code'
    }
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
