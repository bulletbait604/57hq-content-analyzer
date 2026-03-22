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

  // Get user badges from bulletbait604 using official Kick API
  const getUserBadges = async (username: string) => {
    try {
      // Get channel info first
      const channelResponse = await fetch(`https://api.kick.com/public/v1/channels/bulletbait604`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
          'Origin': 'https://kick.com',
          'Referer': 'https://kick.com'
        }
      })

      if (channelResponse.ok) {
        const channelData = await channelResponse.json()
        console.log('📺 Channel data:', channelData)
        
        if (channelData.data && channelData.data.chatroom) {
          const chatroomId = channelData.data.chatroom.id
          console.log(`💬 Found chatroom ID: ${chatroomId}`)
          
          // Get recent chat messages to find user's badges
          const messagesResponse = await fetch(`https://api.kick.com/public/v1/chatrooms/${chatroomId}/messages`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
              'Origin': 'https://kick.com',
              'Referer': 'https://kick.com'
            }
          })

          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json()
            console.log('📋 Chat messages data:', messagesData)
            
            if (messagesData.data && messagesData.data.messages) {
              const userMessages = messagesData.data.messages.filter((message: any) => 
                message.sender && 
                message.sender.username && 
                message.sender.username.toLowerCase() === username.toLowerCase()
              )
              
              console.log(`📋 Found ${userMessages.length} messages from ${username}`)
              
              if (userMessages.length > 0) {
                const latestMessage = userMessages[0]
                const badges = latestMessage.sender.badges || []
                console.log(`🏅 User badges:`, badges)
                return badges
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to get user badges from official API:', error)
    }
    
    return []
  }

  const [userBadges, setUserBadges] = useState<any[]>([])

  // Load user badges when user logs in
  useEffect(() => {
    if (user) {
      getUserBadges(user.username).then(badges => {
        setUserBadges(badges)
        console.log('🏅 User badges from bulletbait604:', badges)
      })
    }
  }, [user])

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
              
              {/* User Badges */}
              {userBadges && userBadges.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {userBadges.map((badge: any, index: number) => (
                    <div 
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs text-white font-semibold"
                      title={badge.name || badge.type || 'Badge'}
                    >
                      {badge.name || badge.type || 'Badge'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mb-4">
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
          Login to display your profile and badges from bulletbait604
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-cyan-300 mb-4">
              Connect with Kick to see your profile and badges
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
