'use client'

import { useEffect } from 'react'

export default function KickCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    // Simple redirect to main page with auth info
    const mainAppUrl = 'https://sdhqcreatorcorner.vercel.app'

    if (code) {
      // Store the auth code in localStorage (more reliable than sessionStorage)
      localStorage.setItem('kickAuthCode', code)
      window.location.href = `${mainAppUrl}?auth=success&code=${code}`
    } else if (error) {
      window.location.href = `${mainAppUrl}?auth=error&message=${encodeURIComponent(error)}`
    } else {
      window.location.href = `${mainAppUrl}?auth=error&message=no_code`
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-cyan-400">Processing authentication...</p>
        <p className="text-cyan-300 text-sm mt-2">You will be redirected shortly.</p>
      </div>
    </div>
  )
}
