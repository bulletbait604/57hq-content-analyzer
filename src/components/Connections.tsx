'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/simple-label'
import { Badge } from '@/components/ui/simple-badge'
import { 
  Instagram, 
  Youtube, 
  Music, 
  Link, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Key
} from 'lucide-react'

interface PlatformConnection {
  platform: string
  connected: boolean
  username?: string
  apiKey?: string
  connectedAt?: string
}

export function Connections() {
  const [connections, setConnections] = useState<PlatformConnection[]>([
    { platform: 'Instagram', connected: false },
    { platform: 'YouTube', connected: false },
    { platform: 'TikTok', connected: false }
  ])

  const [showApiSetup, setShowApiSetup] = useState<string | null>(null)

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return <Instagram className="w-5 h-5" />
      case 'YouTube': return <Youtube className="w-5 h-5" />
      case 'TikTok': return <Music className="w-5 h-5" />
      default: return <Link className="w-5 h-5" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram': return 'bg-pink-500'
      case 'YouTube': return 'bg-red-500'
      case 'TikTok': return 'bg-black'
      default: return 'bg-gray-500'
    }
  }

  const handleConnect = (platform: string) => {
    setShowApiSetup(platform)
  }

  const handleDisconnect = (platform: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.platform === platform 
          ? { ...conn, connected: false, username: undefined, apiKey: undefined }
          : conn
      )
    )
  }

  const handleApiSave = (platform: string, apiKey: string, username: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.platform === platform 
          ? { 
              ...conn, 
              connected: true, 
              username, 
              apiKey,
              connectedAt: new Date().toISOString()
            }
          : conn
      )
    )
    setShowApiSetup(null)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Social Media Connections</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Connect your social media accounts to analyze content across all platforms and get comprehensive insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {connections.map((connection) => (
          <Card key={connection.platform} className="bg-black border border-cyan-500/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getPlatformColor(connection.platform)} bg-opacity-20`}>
                    {getPlatformIcon(connection.platform)}
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
                    Connect your {connection.platform} account to analyze content and get platform-specific insights.
                  </p>
                  <Button
                    className="w-full bg-cyan-500 text-black hover:bg-cyan-400"
                    onClick={() => handleConnect(connection.platform)}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Connect {connection.platform}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Setup Modal */}
      {showApiSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-black border border-cyan-500 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-cyan-400">
                Connect {showApiSetup}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter your API credentials to connect your {showApiSetup} account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-cyan-300">Username</Label>
                <Input
                  id="username"
                  placeholder={`Your ${showApiSetup} username`}
                  className="bg-black border-cyan-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-cyan-300">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  className="bg-black border-cyan-500 text-white"
                />
              </div>
              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                <p className="text-cyan-300 text-sm mb-2">How to get your API key:</p>
                <ol className="text-gray-400 text-xs space-y-1 list-decimal list-inside">
                  <li>Go to {showApiSetup} Developer Dashboard</li>
                  <li>Create a new application or use existing one</li>
                  <li>Generate API key with read permissions</li>
                  <li>Copy and paste the key above</li>
                </ol>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-gray-400 border-gray-400"
                  onClick={() => setShowApiSetup(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-cyan-500 text-black hover:bg-cyan-400"
                  onClick={() => {
                    const usernameInput = document.getElementById('username') as HTMLInputElement
                    const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement
                    handleApiSave(showApiSetup, apiKeyInput.value, usernameInput.value)
                  }}
                >
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Setup Instructions */}
      <Card className="bg-black border border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">API Setup Instructions</CardTitle>
          <CardDescription className="text-gray-400">
            Follow these steps to get API keys for each platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border-l-4 border-pink-500 pl-4">
              <h4 className="text-pink-400 font-medium mb-2">Instagram Basic Display API</h4>
              <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://developers.facebook.com" className="text-cyan-400 underline" target="_blank">Facebook Developers</a></li>
                <li>Create a new app with "Business" type</li>
                <li>Add "Instagram Basic Display" product</li>
                <li>Configure OAuth redirect URI: {typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/auth/instagram/callback</li>
                <li>Generate App ID and App Secret</li>
                <li>Use App Secret as API key</li>
              </ol>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="text-red-400 font-medium mb-2">YouTube Data API v3</h4>
              <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://console.developers.google.com" className="text-cyan-400 underline" target="_blank">Google Cloud Console</a></li>
                <li>Create a new project or select existing</li>
                <li>Enable "YouTube Data API v3"</li>
                <li>Go to "Credentials" → "Create Credentials"</li>
                <li>Select "API key" and create</li>
                <li>Restrict key to YouTube API only</li>
              </ol>
            </div>

            <div className="border-l-4 border-gray-800 pl-4">
              <h4 className="text-gray-300 font-medium mb-2">TikTok API</h4>
              <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://developers.tiktok.com" className="text-cyan-400 underline" target="_blank">TikTok Developers</a></li>
                <li>Create a new app</li>
                <li>Select "Research API" or "Business API"</li>
                <li>Configure your app details and redirect URI</li>
                <li>Get your Client Key and Client Secret</li>
                <li>Use Client Secret as API key</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
