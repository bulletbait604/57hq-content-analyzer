'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { 
  Instagram, 
  Youtube, 
  Music, 
  Link, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Key,
  Twitter
} from 'lucide-react'

interface PlatformConnection {
  platform: string
  icon: string
  connected: boolean
  username?: string
  connectedAt?: string
}

export function Connections() {
  const [connections, setConnections] = useState<PlatformConnection[]>([
    { platform: 'YouTube', icon: '▶️', connected: false },
    { platform: 'Twitter', icon: '🐦', connected: false }
  ])

  const handleConnect = (platform: string) => {
    console.log(`🔗 Connecting to ${platform}...`)
    
    // Get the appropriate OAuth URL for each platform
    let oauthUrl = ''
    
    switch (platform) {
      case 'YouTube':
        // Redirect to YouTube OAuth
        const youtubeClientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID
        const youtubeRedirectUri = process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI || 'https://sdhqcreatorcorner.vercel.app/auth/youtube/callback'
        oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${youtubeClientId}&redirect_uri=${encodeURIComponent(youtubeRedirectUri)}&scope=https://www.googleapis.com/auth/youtube.readonly&response_type=code&access_type=offline&prompt=consent`
        break
        
      case 'Twitter':
        // Redirect to Twitter OAuth (note: Twitter API requires developer approval)
        oauthUrl = `https://twitter.com/intent/follow?screen_name=bulletbait604`
        break
    }
    
    if (oauthUrl) {
      console.log(`🔗 Redirecting to ${platform} OAuth: ${oauthUrl}`)
      // Store the platform being connected for callback handling
      localStorage.setItem('connecting_platform', platform)
      // Open in new window for OAuth flow
      window.open(oauthUrl, '_blank', 'width=600,height=600')
    }
  }

  const handleDisconnect = (platform: string) => {
    console.log(`🔌 Disconnecting from ${platform}...`)
    
    setConnections(prev => 
      prev.map(conn => 
        conn.platform === platform 
          ? { ...conn, connected: false, username: undefined, connectedAt: undefined }
          : conn
      )
    )
    
    // Clear stored tokens for this platform
    localStorage.removeItem(`${platform.toLowerCase()}_auth_code`)
    localStorage.removeItem(`${platform.toLowerCase()}_access_token`)
  }

  const getPlatformIcon = (platform: string) => {
    const platformInfo = connections.find(p => p.platform === platform)
    return platformInfo?.icon || '📱'
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'YouTube': return 'bg-red-500'
      case 'Twitter': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  // Check for successful OAuth connections from URL parameters
  useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const authSuccess = urlParams.get('auth')
      const platform = urlParams.get('platform')
      
      if (authSuccess === 'success' && platform) {
        console.log(`✅ Successfully connected to ${platform}`)
        
        setConnections(prev => 
          prev.map(conn => 
            conn.platform === platform 
              ? { ...conn, connected: true, username: 'user', connectedAt: new Date().toISOString() }
              : conn
          )
        )
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Connect Your Social Media</h2>
        <p className="text-cyan-300">
          Link your social media accounts to analyze your content and get personalized insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {connections.map((connection, index) => (
          <Card key={index} className="bg-black border border-cyan-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getPlatformColor(connection.platform)} bg-opacity-20`}>
                    <span className="text-2xl">{getPlatformIcon(connection.platform)}</span>
                  </div>
                  <div>
                    <CardTitle className="text-cyan-300 text-lg">{connection.platform}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {connection.connected ? 'Connected' : 'Not connected'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center">
                  {connection.connected ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {connection.connected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-300 font-medium">@{connection.username}</p>
                      <p className="text-gray-400 text-xs">
                        Connected {connection.connectedAt ? new Date(connection.connectedAt).toLocaleDateString() : 'recently'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Active
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-black"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                      onClick={() => handleDisconnect(connection.platform)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Connect your {connection.platform} account to analyze your content and get platform-specific insights.
                  </p>
                  <Button
                    className="w-full bg-cyan-500 text-black hover:bg-cyan-400"
                    onClick={() => handleConnect(connection.platform)}
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Connect {connection.platform}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-black border border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-cyan-300 font-medium">1. Connect Your Accounts</h4>
              <p className="text-gray-400 text-sm">
                Click "Connect" on each platform to authorize access to your content data.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-cyan-300 font-medium">2. Analyze Your Content</h4>
              <p className="text-gray-400 text-sm">
                We'll pull your recent uploads and analyze performance across all platforms.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-cyan-300 font-medium">3. Get Insights</h4>
              <p className="text-gray-400 text-sm">
                Receive personalized recommendations based on your actual content data.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-cyan-300 font-medium">4. Optimize & Grow</h4>
              <p className="text-gray-400 text-sm">
                Use our AI-powered tools to improve your content strategy and reach.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
