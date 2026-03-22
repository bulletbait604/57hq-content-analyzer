'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, LogIn, LogOut, CheckCircle, XCircle, Crown } from 'lucide-react'
import { KickAPI, KickUser } from '@/lib/kick-api'
import { KickSimpleOAuth } from '@/lib/kick-simple'

interface KickAuthProps {
  onSubscriptionChange?: (subscribed: boolean) => void
  onUserChange?: (user: KickUser | null) => void
}

export function KickAuth({ onSubscriptionChange, onUserChange }: KickAuthProps) {
  const [user, setUser] = useState<KickUser | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const kickAPI = new KickAPI(
    process.env.NEXT_PUBLIC_KICK_API_BASE_URL || 'https://kick.com',
    process.env.NEXT_PUBLIC_KICK_CLIENT_ID || '',
    process.env.NEXT_PUBLIC_KICK_CLIENT_SECRET || ''
  )

  useEffect(() => {
    // Check for existing session on mount
    checkExistingSession()
    
    // Check for auth callback
    checkAuthCallback()
  }, [])

  const checkAuthCallback = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const authStatus = urlParams.get('auth')
    
    if (authStatus === 'success') {
      const authCode = sessionStorage.getItem('kickAuthCode')
      if (authCode) {
        const redirectUri = `https://sdhq-content-analyzer.vercel.app/auth/kick/callback`
        handleAuthSuccess(authCode, redirectUri)
        // Clean up
        sessionStorage.removeItem('kickAuthCode')
        sessionStorage.removeItem('kickAuthReturn')
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname)
      }
    } else if (authStatus === 'error') {
      const message = urlParams.get('message')
      setError(message || 'Authentication failed')
      setIsLoading(false)
      // Clean up
      sessionStorage.removeItem('kickAuthReturn')
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  const checkExistingSession = () => {
    try {
      const storedUser = localStorage.getItem('kickUser')
      const storedToken = localStorage.getItem('kickAccessToken')
      const storedSubscription = localStorage.getItem('kickSubscription')
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsSubscribed(storedSubscription === 'true')
        onUserChange?.(userData)
        onSubscriptionChange?.(storedSubscription === 'true')
      }
    } catch (error) {
      console.error('Error checking existing session:', error)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const redirectUri = `https://sdhq-content-analyzer.vercel.app/auth/kick/callback`
      const authUrl = await kickAPI.getAuthURL(redirectUri)
      
      // Debug: Log the URL to console
      console.log('Kick OAuth URL:', authUrl)
      console.log('Client ID:', process.env.NEXT_PUBLIC_KICK_CLIENT_ID)
      console.log('Redirect URI:', redirectUri)
      
      // Also generate test URLs for manual testing
      const simpleOAuth = new KickSimpleOAuth(process.env.NEXT_PUBLIC_KICK_CLIENT_ID || '')
      const testUrls = simpleOAuth.getTestURLs(redirectUri)
      
      console.log('=== Alternative Test URLs ===')
      testUrls.forEach((url, index) => {
        console.log(`Test ${index + 1}: ${url}`)
      })
      
      // Store current URL to return after auth
      sessionStorage.setItem('kickAuthReturn', window.location.pathname)
      
      // Redirect directly instead of popup (more reliable)
      window.location.href = authUrl
      
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to start authentication')
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = async (code: string, redirectUri: string) => {
    try {
      // Exchange code for token
      const tokenResponse = await kickAPI.exchangeCodeForToken(code, redirectUri)
      
      // Get user info
      const userData = await kickAPI.getCurrentUser(tokenResponse.access_token)
      
      // Check subscription
      const isSub = await kickAPI.verifyChannelSubscription(tokenResponse.access_token, 'bulletbait604')
      
      // Store session
      localStorage.setItem('kickUser', JSON.stringify(userData))
      localStorage.setItem('kickAccessToken', tokenResponse.access_token)
      localStorage.setItem('kickSubscription', isSub.toString())
      
      // Update state
      setUser(userData)
      setIsSubscribed(isSub)
      onUserChange?.(userData)
      onSubscriptionChange?.(isSub)
      
      setIsLoading(false)
    } catch (error) {
      console.error('Auth success error:', error)
      setError('Failed to complete authentication')
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    try {
      // Clear session
      localStorage.removeItem('kickUser')
      localStorage.removeItem('kickAccessToken')
      localStorage.removeItem('kickSubscription')
      
      // Update state
      setUser(null)
      setIsSubscribed(false)
      onUserChange?.(null)
      onSubscriptionChange?.(false)
      setError(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (user) {
    return (
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5 text-cyan-400" />
            Kick Account Connected
          </CardTitle>
          <CardDescription className="text-cyan-300">
            {isSubscribed ? 'Premium features unlocked!' : 'Basic access - Upgrade for AI features'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-900 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="font-medium text-white">{user.display_name || user.username}</p>
                <p className="text-sm text-cyan-300 flex items-center gap-1">
                  {isSubscribed ? (
                    <>
                      <Crown className="h-3 w-3 text-lime-400" />
                      <span className="text-lime-400">Verified Subscriber</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 text-cyan-400" />
                      <span>Not Subscribed to bulletbait604</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-cyan-500 text-cyan-500 hover:bg-cyan-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {!isSubscribed && (
            <div className="mt-4 p-3 bg-cyan-900 border border-cyan-600 rounded-lg">
              <p className="text-sm text-cyan-300">
                <strong>Unlock Premium Features:</strong> Subscribe to{' '}
                <a href="https://kick.com/bulletbait604" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">
                  bulletbait604
                </a>{' '}
                on Kick to access DeepSeek AI-powered content optimization.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black border border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <LogIn className="h-5 w-5 text-cyan-400" />
          Connect Your Kick Account
        </CardTitle>
        <CardDescription className="text-cyan-300">
          Login with Kick to unlock premium AI features for subscribers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-cyan-300 mb-4">
              Subscribe to <strong>bulletbait604</strong> on Kick to unlock:
            </p>
            <div className="grid grid-cols-1 gap-2 text-sm text-cyan-400">
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="h-4 w-4 text-lime-400" />
                <span>DeepSeek AI Content Analysis</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="h-4 w-4 text-lime-400" />
                <span>AI-Powered Tag Generation</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="h-4 w-4 text-lime-400" />
                <span>Algorithm Scoring & Insights</span>
              </div>
            </div>
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
