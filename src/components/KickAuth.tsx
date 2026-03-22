'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, LogIn, LogOut, CheckCircle, XCircle, Crown } from 'lucide-react'
import { KickOAuth, KickUser } from '@/lib/kick-oauth'
import { KickSubscriptionChecker } from '@/lib/kick-subscription'

interface KickAuthProps {
  onSubscriptionChange?: (subscribed: boolean) => void
  onUserChange?: (user: KickUser | null) => void
}

export function KickAuth({ onSubscriptionChange, onUserChange }: KickAuthProps) {
  const [user, setUser] = useState<KickUser | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const kickOAuth = new KickOAuth(
    process.env.NEXT_PUBLIC_KICK_CLIENT_ID || '',
    process.env.NEXT_PUBLIC_KICK_CLIENT_SECRET || ''
  )

  const kickSubscriptionChecker = new KickSubscriptionChecker()

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      const storedSubscription = localStorage.getItem('kickSubscription')
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          onUserChange?.(userData)
        } catch (error) {
          console.error('Failed to parse stored user data:', error)
        }
      }
      
      if (storedSubscription) {
        const subscribed = storedSubscription === 'true'
        setIsSubscribed(subscribed)
        onSubscriptionChange?.(subscribed)
      }
    }
  }, [])

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const redirectURI = typeof window !== 'undefined' ? `${window.location.origin}/auth/kick/callback` : 'https://sdhqcreatorcorner.vercel.app/auth/kick/callback'
      const authURL = await kickOAuth.getAuthURL(redirectURI)
      
      // Store return URL
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('kickAuthReturn', window.location.pathname)
      }
      
      // Redirect to Kick OAuth
      window.location.href = authURL
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to start authentication')
      setIsLoading(false)
    }
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
          'This is required to verify your subscription to bulletbait604'
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
      
      // Check subscription using official Kick API
      console.log(`🔍 Checking subscription for @${userData.username} to bulletbait604`)
      
      let isSub = false
      
      try {
        console.log(`🚀 Calling official Kick API subscription check...`)
        const subscriptionResult = await kickSubscriptionChecker.checkSubscription(userData.username)
        isSub = subscriptionResult.isSubscribed
        console.log(`📊 Official Kick API result: ${isSub} via ${subscriptionResult.method}`)
        console.log(`📊 Full result data:`, subscriptionResult)
        
        if (subscriptionResult.error) {
          console.log(`⚠️ Official Kick API returned error: ${subscriptionResult.error}`)
        }
        
      } catch (subError) {
        console.error('❌ Subscription check failed:', subError)
        console.log('❌ Error details:', subError)
        isSub = false
      }
      
      // Store session
      localStorage.setItem('kickUser', JSON.stringify(userData))
      localStorage.setItem('kickAccessToken', tokenResponse.access_token)
      localStorage.setItem('kickSubscription', isSub.toString())
      
      // Update state
      setUser(userData)
      setIsSubscribed(isSub)
      onUserChange?.(userData)
      onSubscriptionChange?.(isSub)
      
      console.log(`🎉 Login complete! @${userData.username} is ${isSub ? 'SUBSCRIBED ✅' : 'NOT SUBSCRIBED ❌'}`)
      
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
      localStorage.removeItem('kickSubscription')
    }
    
    // Update state
    setUser(null)
    setIsSubscribed(false)
    onUserChange?.(null)
    onSubscriptionChange?.(false)
    setError(null)
  }

  const handleManualSubscriptionCheck = async () => {
    if (!user) {
      setError('Please log in first to check subscription')
      return
    }

    console.log(`🔍 Manual subscription check for @${user.username}`)
    console.log(`🔑 Current stored subscription: ${localStorage.getItem('kickSubscription')}`)
    
    try {
      const subscriptionResult = await kickSubscriptionChecker.checkSubscription(user.username)
      const isSub = subscriptionResult.isSubscribed
      
      console.log(`📊 Manual check result: ${isSub} via ${subscriptionResult.method}`)
      console.log(`📊 Full result data:`, subscriptionResult)
      
      // Additional debugging info
      console.log(`🔍 User checking: ${user.username}`)
      console.log(`🔍 Target channel: bulletbait604`)
      console.log(`🔍 Is owner check: ${user.username.toLowerCase() === 'bulletbait604'}`)
      
      if (subscriptionResult.error) {
        console.log(`⚠️ API Error: ${subscriptionResult.error}`)
      }
      
      // Update subscription status
      setIsSubscribed(isSub)
      localStorage.setItem('kickSubscription', isSub.toString())
      onSubscriptionChange?.(isSub)
      
      // Show detailed alert
      const alertMessage = `Subscription Check Complete:
      
Status: ${isSub ? 'SUBSCRIBED ✅' : 'NOT SUBSCRIBED ❌'}
Method: ${subscriptionResult.method}
Username: ${user.username}
Target: bulletbait604
Owner: ${user.username.toLowerCase() === 'bulletbait604' ? 'Yes' : 'No'}
Error: ${subscriptionResult.error || 'None'}
Data: ${JSON.stringify(subscriptionResult.data || {}, null, 2)}

Check browser console for detailed debugging info.`
      
      alert(alertMessage)
      
    } catch (error) {
      console.error('❌ Manual subscription check failed:', error)
      setError(`Subscription check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Check for auth callback on mount
  useEffect(() => {
    handleAuthCallback()
  }, [])

  if (user) {
    return (
      <Card className="bg-black border border-cyan-500/20">
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
              <div className="text-cyan-300 font-medium">Logged in as</div>
              <div className="text-white font-semibold">{user.display_name}</div>
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

          <Button
            onClick={handleManualSubscriptionCheck}
            variant="outline"
            className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Recheck Subscription
          </Button>
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
