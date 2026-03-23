'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentAnalyzerEnhanced } from '@/components/ContentAnalyzerEnhanced'
import { PlatformOptimizer } from '@/components/PlatformOptimizer'
import { ClipAnalyzerEnhanced } from '@/components/ClipAnalyzerEnhanced'
import { Connections } from '@/components/Connections'
import { AlgorithmInfoEnhanced } from '@/components/AlgorithmInfoEnhanced'
import { TagGenerator } from '@/components/TagGenerator'
import { AIContentOptimizer } from '@/components/AIContentOptimizer'
import { KickAuth } from '@/components/KickAuth'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [channelSubscriptions, setChannelSubscriptions] = useState<any[]>([])
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState<boolean>(false)

  // Check channel subscriptions when user logs in
  useEffect(() => {
    if (user && user.username) {
      checkChannelSubscriptions(user.username)
    } else {
      setChannelSubscriptions([])
    }
  }, [user])

  // Function to check channel subscriptions
  const checkChannelSubscriptions = async (username: string) => {
    setIsLoadingSubscriptions(true)
    try {
      // Get access token from localStorage
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('kickAccessToken') : null
      
      if (!accessToken) {
        console.log('❌ No access token found for API call')
        setIsLoadingSubscriptions(false)
        return
      }

      console.log(`🔍 Checking channel subscriptions for ${username} via Kick API`)
      
      // Use bulletbait604 as the channel ID (you might need to get the actual channel ID)
      const channelId = 'bulletbait604' // You may need to replace with actual channel ID
      const response = await fetch(`https://api.kick.com/v1/channels/${channelId}/subscriptions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      console.log(`Kick API subscriptions response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Got channel subscriptions from Kick API:', data)
        
        // Handle different response formats
        let subscriptions = []
        if (Array.isArray(data)) {
          subscriptions = data
        } else if (data.data && Array.isArray(data.data)) {
          subscriptions = data.data
        } else if (data.subscriptions && Array.isArray(data.subscriptions)) {
          subscriptions = data.subscriptions
        }
        
        setChannelSubscriptions(subscriptions)
        console.log(`📊 Found ${subscriptions.length} channel subscriptions`)
      } else {
        const errorText = await response.text()
        console.log(`❌ Kick API subscriptions failed (${response.status}):`, errorText)
        setChannelSubscriptions([])
      }
    } catch (error) {
      console.error('❌ Error checking channel subscriptions:', error)
      setChannelSubscriptions([])
    } finally {
      setIsLoadingSubscriptions(false)
    }
  }

  console.log(`🔐 Subscriber access: ❌ Denied`)

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } catch (error) {
          console.error('Failed to parse stored user data:', error)
          localStorage.removeItem('kickUser')
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ textShadow: '0 0 10px #00ffff' }}>
            SDHQ Content Analyzer
          </h1>
          <p className="text-lg text-cyan-300 max-w-2xl mx-auto">
            AI-powered multi-platform content optimization based on 2026 algorithm parameters
          </p>
        </div>

        {/* User Profile Status */}
        {user ? (
          <div className="mb-6">
            <div className="bg-black border border-cyan-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.profile_image_url || 'https://via.placeholder.com/40'} 
                    alt={user.display_name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="text-cyan-300 text-sm font-medium">Logged in as</div>
                    <div className="text-white font-semibold">{user.display_name}</div>
                    
                    {/* Channel Subscriptions Data */}
                    <div className="mt-2">
                      {isLoadingSubscriptions ? (
                        <div className="text-yellow-400 text-xs">Loading channel data...</div>
                      ) : (
                        <div className="text-xs">
                          <div className="text-cyan-400 font-semibold mb-1">Channel API Data:</div>
                          <div className="text-gray-300">
                            <div>📊 Subscriptions: {channelSubscriptions.length}</div>
                            {channelSubscriptions.length > 0 && (
                              <div className="mt-1">
                                <div className="text-gray-400">Sample data:</div>
                                <div className="text-xs text-gray-500 break-all">
                                  {JSON.stringify(channelSubscriptions[0], null, 2).substring(0, 200)}...
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('kickUser')
                      localStorage.removeItem('kickAccessToken')
                    }
                    setUser(null)
                  }}
                  className="text-xs text-gray-400 hover:text-cyan-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <KickAuth onUserChange={setUser} />
          </div>
        )}

        <Tabs defaultValue="algorithm-info" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-black border border-cyan-500">
            <TabsTrigger value="algorithm-info" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Algorithm Info</TabsTrigger>
            <TabsTrigger 
              value="content-analysis" 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
            >
              Content Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="clip-analysis" 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
            >
              Clip Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="platform-optimizer" 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
            >
              Platform Optimizer
            </TabsTrigger>
            <TabsTrigger value="connections" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Connections</TabsTrigger>
            <TabsTrigger 
              value="tag-generator" 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
            >
              Tag Generator
            </TabsTrigger>
            <TabsTrigger 
              value="ai-optimizer" 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
            >
              AI Optimizer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="algorithm-info" className="mt-6">
            <AlgorithmInfoEnhanced />
          </TabsContent>

          <TabsContent value="content-analysis" className="mt-6">
            <Card className="bg-black border border-red-500">
              <CardContent className="text-center py-8">
                <div className="text-red-400 text-lg font-semibold mb-4">🔒 Subscriber Only Feature</div>
                <p className="text-gray-300 mb-4">
                  Content Analysis requires a subscription to bulletbait604
                </p>
                <p className="text-cyan-300 text-sm">
                  Subscribe to unlock AI-powered content analysis features
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clip-analysis" className="mt-6">
            <Card className="bg-black border border-red-500">
              <CardContent className="text-center py-8">
                <div className="text-red-400 text-lg font-semibold mb-4">🔒 Subscriber Only Feature</div>
                <p className="text-gray-300 mb-4">
                  Clip Analysis requires a subscription to bulletbait604
                </p>
                <p className="text-cyan-300 text-sm">
                  Subscribe to unlock AI-powered clip analysis features
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform-optimizer" className="mt-6">
            <Card className="bg-black border border-red-500">
              <CardContent className="text-center py-8">
                <div className="text-red-400 text-lg font-semibold mb-4">🔒 Subscriber Only Feature</div>
                <p className="text-gray-300 mb-4">
                  Platform Optimizer requires a subscription to bulletbait604
                </p>
                <p className="text-cyan-300 text-sm">
                  Subscribe to unlock AI-powered platform optimization features
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <Connections />
          </TabsContent>

          <TabsContent value="tag-generator" className="mt-6">
            <Card className="bg-black border border-red-500">
              <CardContent className="text-center py-8">
                <div className="text-red-400 text-lg font-semibold mb-4">🔒 Subscriber Only Feature</div>
                <p className="text-gray-300 mb-4">
                  Tag Generator requires a subscription to bulletbait604
                </p>
                <p className="text-cyan-300 text-sm">
                  Subscribe to unlock AI-powered tag generation features
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-optimizer" className="mt-6">
            <Card className="bg-black border border-red-500">
              <CardContent className="text-center py-8">
                <div className="text-red-400 text-lg font-semibold mb-4">🔒 Subscriber Only Feature</div>
                <p className="text-gray-300 mb-4">
                  AI Content Optimizer requires a subscription to bulletbait604
                </p>
                <p className="text-cyan-300 text-sm">
                  Subscribe to unlock AI-powered content optimization features
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
