'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, XCircle, CheckCircle, LogIn, LogOut } from 'lucide-react'
import { KickOAuth } from '@/lib/kick-oauth'
import { KickSubscriptionChecker } from '@/lib/kick-subscription'

interface KickUser {
  id: string
  username: string
  display_name: string
  profile_image_url: string
}

interface KickAuthProps {
  onSubscriptionChange?: (subscribed: boolean) => void
  onUserChange?: (user: KickUser | null) => void
}

export function KickAuth({ onSubscriptionChange, onUserChange }: KickAuthProps) {
  const [user, setUser] = useState<KickUser | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [kickAuth, setKickAuth] = useState<{
    verificationCode?: string
    isVerifying?: boolean
    verificationStep?: 'generate' | 'send' | 'check' | 'complete'
  } | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const kickOAuth = new KickOAuth(
    process.env.NEXT_PUBLIC_KICK_CLIENT_ID || '',
    process.env.NEXT_PUBLIC_KICK_CLIENT_SECRET || ''
  )

  const kickSubscriptionChecker = new KickSubscriptionChecker(
    process.env.NEXT_PUBLIC_RAPIDAPI_KICK_API_KEY || ''
  )

  // Generate verification code
  const generateVerificationCode = () => {
    const code = kickSubscriptionChecker.generateVerificationCode()
    setKickAuth({
      verificationCode: code,
      isVerifying: false,
      verificationStep: 'generate'
    })
  }

  // Start verification process
  const startVerification = async () => {
    if (!kickAuth?.verificationCode) {
      setError('Please generate a verification code first')
      return
    }

    setKickAuth(prev => ({ ...prev, isVerifying: true, verificationStep: 'send' }))
    
    try {
      const subscriptionResult = await kickSubscriptionChecker.verifySubscriptionWithCode(
        user!.username,
        kickAuth.verificationCode
      )
      
      setIsSubscribed(subscriptionResult.isSubscribed)
      localStorage.setItem('kickSubscription', subscriptionResult.isSubscribed.toString())
      
      setKickAuth({
        verificationCode: kickAuth.verificationCode,
        isVerifying: false,
        verificationStep: 'complete'
      })
      
      console.log(`📊 Verification result: ${subscriptionResult.isSubscribed} via ${subscriptionResult.method}`)
      
      if (subscriptionResult.error) {
        console.log(`⚠️ Verification error: ${subscriptionResult.error}`)
        setError(subscriptionResult.error)
      } else {
        setError(null)
      }
      
      onSubscriptionChange?.(subscriptionResult.isSubscribed)
      
    } catch (error) {
      console.error('❌ Verification failed:', error)
      setError(error instanceof Error ? error.message : 'Verification failed')
      setKickAuth(prev => ({ ...prev, isVerifying: false, verificationStep: 'generate' }))
    }
  }

  // Reset verification
  const resetVerification = () => {
    setKickAuth(undefined)
    setError(null)
  }

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
      
      // Set auth token for subscription checker
      kickSubscriptionChecker.setAuthToken(tokenResponse.access_token)
      
      // Store session
      localStorage.setItem('kickUser', JSON.stringify(userData))
      localStorage.setItem('kickAccessToken', tokenResponse.access_token)
      localStorage.setItem('kickSubscription', 'false')
      
      // Update state
      setUser(userData)
      setIsSubscribed(false)
      onUserChange?.(userData)
      onSubscriptionChange?.(false)
      
      console.log(`🎉 Login complete! @${userData.username} is NOT SUBSCRIBED ❌`)
      
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
    resetVerification()
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
      
    } catch (subError) {
      console.error('❌ Subscription check failed:', subError)
      setError(subError instanceof Error ? subError.message : 'Subscription check failed')
    }
  }

  useEffect(() => {
    // Check for stored session on mount
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      const storedToken = localStorage.getItem('kickAccessToken')
      const storedSubscription = localStorage.getItem('kickSubscription')
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsSubscribed(storedSubscription === 'true')
          onUserChange?.(userData)
          onSubscriptionChange?.(storedSubscription === 'true')
        } catch (error) {
          console.error('Failed to parse stored user data:', error)
          localStorage.removeItem('kickUser')
          localStorage.removeItem('kickAccessToken')
          localStorage.removeItem('kickSubscription')
        }
      }
    }
  }, [])

  // If user is logged in but not subscribed, show verification UI
  if (user && !isSubscribed) {
    return (
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CheckCircle className="h-5 w-5 text-cyan-400" />
            Verify Your Subscription
          </CardTitle>
          <CardDescription className="text-cyan-300">
            To access AI features, please verify you are subscribed to bulletbait604
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Instructions */}
            <div className="text-cyan-300 text-sm space-y-2">
              <h3 className="font-semibold text-white mb-2">How to verify your subscription:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Click the "Generate Verification Code" button below</li>
                <li>Copy the generated code</li>
                <li>Go to <strong>kick.com/bulletbait604</strong></li>
                <li>Type the following message in chat: <code className="bg-gray-800 px-2 py-1 rounded">🔐 SUB VERIFICATION: [YOUR_CODE]</code></li>
                <li>Click the "Verify Subscription" button</li>
              </ol>
            </div>

            {/* Verification Code Display */}
            {!kickAuth?.verificationCode ? (
              <div className="text-center">
                <Button
                  onClick={generateVerificationCode}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-black"
                  disabled={kickAuth?.isVerifying}
                >
                  {kickAuth?.isVerifying ? 'Generating...' : 'Generate Verification Code'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-300 mb-2">Your verification code:</div>
                    <div className="text-2xl font-mono text-cyan-400 mb-3">
                      {kickAuth?.verificationCode}
                    </div>
                    <div className="text-xs text-gray-400">This code will expire in 10 minutes</div>
                  </div>
                </div>
                <Button
                  onClick={startVerification}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={kickAuth?.isVerifying}
                >
                  {kickAuth?.isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Subscription
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetVerification}
                  variant="outline"
                  className="w-full border-gray-500 text-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-900 border border-red-500 rounded-lg">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // If user is logged in and subscribed, show premium content
  if (user && isSubscribed) {
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

          <div className="flex gap-2 mb-4">
            <Button
              onClick={handleManualSubscriptionCheck}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              Recheck Subscription
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
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
