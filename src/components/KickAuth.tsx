'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn, LogOut } from 'lucide-react'
import { KickOAuth } from '@/lib/kick-oauth'

interface KickUser {
  id: string
  username: string
  display_name: string
  profile_image_url: string
}

interface KickAuthProps {
  onUserChange?: (user: KickUser | null) => void
}

export function KickAuth({ onUserChange }: KickAuthProps) {
  const [user, setUser] = useState<KickUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const kickOAuth = new KickOAuth(
    process.env.NEXT_PUBLIC_KICK_CLIENT_ID || '',
    process.env.NEXT_PUBLIC_KICK_CLIENT_SECRET || ''
  )

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)
    const authURL = await kickOAuth.getAuthURL(`${window.location.origin}/auth/kick/callback`)
    
    // Store return URL for OAuth callback
    sessionStorage.setItem('kickAuthReturn', window.location.pathname)
    window.location.href = authURL
  }

  const handleAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const authStatus = urlParams.get('auth')
    
    if (authStatus === 'success') {
      const authCode = urlParams.get('code') || localStorage.getItem('kickAuthCode')
      if (authCode) {
        const redirectUri = `${window.location.origin}/auth/kick/callback`
        await handleAuthSuccess(authCode, redirectUri)
        localStorage.removeItem('kickAuthCode')
        sessionStorage.removeItem('kickAuthReturn')
        window.history.replaceState({}, '', window.location.pathname)
      }
    } else if (authStatus === 'error') {
      const errorMsg = urlParams.get('error') || 'Authentication failed'
      setError(errorMsg)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  const handleAuthSuccess = async (code: string, redirectUri: string) => {
    try {
      console.log('🔐 Processing Kick OAuth callback...')
      
      // Exchange auth code for token
      const tokenResponse = await kickOAuth.exchangeCodeForToken(code, redirectUri)
      console.log('✅ Real Kick token received')
      
      // Get user info
      let userData;
      try {
        userData = await kickOAuth.getUserInfo(tokenResponse.access_token)
        console.log('✅ Got real user data:', userData.username)
      } catch (userError) {
        console.error('❌ Kick user API failed:', userError)
        
        // Ask user for their username since we can't get it from API
        const kickUsername = prompt(
          'Kick API is currently experiencing issues.\n\n' +
          'Please enter your exact Kick username (without @):\n\n' +
          'This is required to display your profile'
        );
        
        if (!kickUsername || kickUsername.trim() === '') {
          throw new Error('Username is required to continue')
        }
        
        // Clean and validate username
        const cleanUsername = kickUsername.replace('@', '').trim().toLowerCase()
        
        if (cleanUsername.length < 3) {
          throw new Error('Please enter a valid Kick username')
        }
        
        userData = {
          id: 'kick_user_' + cleanUsername,
          username: cleanUsername,
          display_name: kickUsername,
          profile_image_url: ''
        }
        
        console.log('👤 Using provided username:', userData)
      }
      
      // Store session
      localStorage.setItem('kickUser', JSON.stringify(userData))
      localStorage.setItem('kickAccessToken', tokenResponse.access_token)
      
      // Update state
      setUser(userData)
      onUserChange?.(userData)
      
      console.log(`🎉 Login complete! @${userData.username}`)
      
    } catch (error) {
      console.error('❌ Authentication failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to complete authentication')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear session (only runs on client side)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kickUser')
      localStorage.removeItem('kickAccessToken')
    }
    
    // Update state
    setUser(null)
    onUserChange?.(null)
    setError(null)
  }

  useEffect(() => {
    // Check for stored session on mount
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      const storedToken = localStorage.getItem('kickAccessToken')
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          onUserChange?.(userData)
          console.log(`📱 Restored session for @${userData.username}`)
        } catch (error) {
          console.error('Failed to parse stored user data:', error)
          localStorage.removeItem('kickUser')
          localStorage.removeItem('kickAccessToken')
        }
      }
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const authStatus = urlParams.get('auth')
    
    if (authStatus === 'success') {
      const authCode = urlParams.get('code') || localStorage.getItem('kickAuthCode')
      if (authCode) {
        const redirectUri = `${window.location.origin}/auth/kick/callback`
        handleAuthSuccess(authCode, redirectUri)
        localStorage.removeItem('kickAuthCode')
        sessionStorage.removeItem('kickAuthReturn')
        window.history.replaceState({}, '', window.location.pathname)
      }
    } else if (authStatus === 'error') {
      const errorMsg = urlParams.get('error') || 'Authentication failed'
      setError(errorMsg)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // If user is logged in, show profile with badges
  if (user) {
    return (
      <Card className="bg-black border border-cyan-500">
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <img 
                src={user.profile_image_url || 'https://via.placeholder.com/40'} 
                alt={user.display_name}
                className="w-12 h-12 rounded-full mr-3"
              />
            </div>
            <div>
              <div className="text-cyan-300 text-sm font-medium">Logged in as</div>
              <div className="text-white font-semibold">{user.display_name}</div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
              size="sm"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default login UI
  return (
    <Card className="bg-black border border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <LogIn className="h-5 w-5 text-cyan-400" />
          Connect Your Kick Account
        </CardTitle>
        <CardDescription className="text-cyan-300">
          Login to display your profile from bulletbait604
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-cyan-300 mb-4">
              Connect with Kick to see your profile
            </p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-900 border border-red-500 rounded-lg">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
          
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-cyan-500 text-black hover:bg-cyan-400"
            style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Login with Kick
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
