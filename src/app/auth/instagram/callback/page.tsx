'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function InstagramCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      console.error('Instagram OAuth error:', error)
      router.push('/?auth=error&platform=instagram&error=' + encodeURIComponent(error))
      return
    }

    if (code) {
      // Store the authorization code
      localStorage.setItem('instagram_auth_code', code)
      console.log('✅ Instagram authorization code received')
      
      // Redirect back to main app with success
      router.push('/?auth=success&platform=instagram')
    } else {
      // No code or error, redirect to main app
      router.push('/?auth=error&platform=instagram&error=no_code')
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-pink-300">Connecting Instagram...</p>
      </div>
    </div>
  )
}

export default function InstagramCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pink-300">Loading...</p>
        </div>
      </div>
    }>
      <InstagramCallbackContent />
    </Suspense>
  )
}
