'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, LogIn, LogOut, CheckCircle, XCircle, Crown } from 'lucide-react'
import { KickAPI, KickUser, KickAuthResponse } from '@/lib/kick-api'
import { KickSimpleOAuth } from '@/lib/kick-simple'
import { KickSubscriptionChecker } from '@/lib/kick-subscription-checker'
import { AdminPanel } from '@/components/AdminPanel'

interface KickAuthProps {
  onSubscriptionChange?: (subscribed: boolean) => void
  onUserChange?: (user: KickUser | null) => void
}

export function KickAuth({ onSubscriptionChange, onUserChange }: KickAuthProps) {
  const [user, setUser] = useState<KickUser | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const kickAPI = new KickAPI(
    process.env.NEXT_PUBLIC_KICK_API_BASE_URL || 'https://kick.com',
    process.env.NEXT_PUBLIC_KICK_CLIENT_ID || '',
    process.env.NEXT_PUBLIC_KICK_CLIENT_SECRET || ''
  )

  // Initialize subscription checker with RapidAPI key (if available)
  const subscriptionChecker = new KickSubscriptionChecker(
    process.env.NEXT_PUBLIC_RAPIDAPI_KICK_API_KEY || '',
    'bulletbait604'
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
      const authCode = urlParams.get('code') || localStorage.getItem('kickAuthCode')
      if (authCode) {
        const redirectUri = `https://sdhqcreatorcorner.vercel.app/auth/kick/callback`
        handleAuthSuccess(authCode, redirectUri)
        // Clean up
        localStorage.removeItem('kickAuthCode')
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
      localStorage.removeItem('kickAuthCode')
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
      const redirectUri = `https://sdhqcreatorcorner.vercel.app/auth/kick/callback`
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
      console.log('🔐 Processing Kick OAuth callback...')
      
      // Exchange auth code for token
      let tokenResponse: KickAuthResponse
      try {
        tokenResponse = await kickAPI.exchangeCodeForToken(code, redirectUri)
        console.log('✅ Real Kick token received')
      } catch (tokenError) {
        console.error('❌ Kick token exchange failed:', tokenError)
        throw new Error('Kick OAuth token exchange failed. Please try again.')
      }
      
      // Get user data (username and profile picture)
      let userData;
      try {
        userData = await kickAPI.getCurrentUser(tokenResponse.access_token)
        console.log('✅ Got real user data:', userData.username)
      } catch (userError) {
        console.error('❌ Kick user API failed:', userError)
        throw new Error('Failed to get user information from Kick. Please try again.')
      }
      
      // Now check subscription status using RapidAPI
      console.log(`🔍 Checking subscription status for @${userData.username} to bulletbait604 via RapidAPI`)
      let isSubscribed = false
      
      try {
        // First check for admin override (for testing)
        const adminOverride = subscriptionChecker.checkAdminOverride(userData.username)
        if (adminOverride !== null) {
          isSubscribed = adminOverride
          console.log(`👑 Admin override: @${userData.username} is ${isSubscribed ? 'SUBSCRIBED' : 'NOT SUBSCRIBED'}`)
        } else {
          // Use RapidAPI to check real subscription status
          const subscriptionResult = await subscriptionChecker.checkSubscription(userData.username, tokenResponse.access_token)
          isSubscribed = subscriptionResult.isSubscribed
          console.log(`📊 RapidAPI result: @${userData.username} is ${isSubscribed ? 'SUBSCRIBED' : 'NOT SUBSCRIBED'} via ${subscriptionResult.method}`)
          
          // Show detailed results
          if (subscriptionResult.method === 'rapidapi') {
            console.log('✅ Successfully verified subscription via RapidAPI')
          } else if (subscriptionResult.method === 'oauth') {
            console.log('⚠️ OAuth subscription check worked (unexpected but good)')
          } else {
            console.log('❌ RapidAPI check failed, using fallback method')
          }
        }
      } catch (subError) {
        console.error('❌ Subscription check failed:', subError)
        // Don't throw error, just default to not subscribed
        isSubscribed = false
      }
      
      // Store session data
      localStorage.setItem('kickUser', JSON.stringify(userData))
      localStorage.setItem('kickAccessToken', tokenResponse.access_token)
      localStorage.setItem('kickSubscription', isSubscribed.toString())
      
      // Update UI state
      setUser(userData)
      setIsSubscribed(isSubscribed)
      onUserChange?.(userData)
      onSubscriptionChange?.(isSubscribed)
      
      console.log(`🎉 Login complete! @${userData.username} is ${isSubscribed ? 'SUBSCRIBED ✅' : 'NOT SUBSCRIBED ❌'} to bulletbait604`)
      
    } catch (error) {
      console.error('❌ Authentication failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to complete authentication')
    } finally {
      setIsLoading(false)
      // Clean up URL params
      window.history.replaceState({}, document.title, window.location.pathname)
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
      <div className="space-y-4">
        <Card className="bg-black border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Logged In
            </CardTitle>
            <CardDescription className="text-gray-400">
              Welcome to SDHQ Content Analyzer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {user.profile_image_url ? (
                <img 
                  src={user.profile_image_url} 
                  alt={user.display_name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-cyan-400" />
                </div>
              )}
              <div>
                <div className="text-cyan-300 font-medium">{user.display_name}</div>
                <div className="text-gray-400 text-sm">@{user.username}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSubscribed ? (
                <>
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Premium Member</span>
                  <span className="text-gray-400 text-sm">(Subscribed to bulletbait604)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">Free Tier</span>
                  <span className="text-gray-400 text-sm">(Not subscribed)</span>
                </>
              )}
            </div>

            <Button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Admin Panel for Testing */}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-sm"
          >
            {showAdminPanel ? 'Hide' : 'Show'} Admin Panel (Testing)
          </Button>
        </div>

        {showAdminPanel && (
          <AdminPanel 
            onSubscriptionChange={(username, subscribed) => {
              // Update subscription if it's the current user
              if (user && user.username === username) {
                setIsSubscribed(subscribed)
                onSubscriptionChange?.(subscribed)
                localStorage.setItem('kickSubscription', subscribed.toString())
              }
            }}
          />
        )}
      </div>
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
          Login to display your profile and verify subscription to bulletbait604
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
