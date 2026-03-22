'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentAnalyzer } from '@/components/ContentAnalyzer'
import { PlatformOptimizer } from '@/components/PlatformOptimizer'
import { ClipAnalyzer } from '@/components/ClipAnalyzer'
import { ImprovementTips } from '@/components/ImprovementTips'
import { TagGenerator } from '@/components/TagGenerator'
import { AIContentOptimizer } from '@/components/AIContentOptimizer'
import { KickAuth } from '@/components/KickAuth'

export default function Home() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      const storedSubscription = localStorage.getItem('kickSubscription')
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } catch (error) {
          console.error('Failed to parse stored user data:', error)
        }
      }
      
      if (storedSubscription) {
        setIsSubscribed(storedSubscription === 'true')
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

        {/* Kick Authentication Section - Only show if not logged in */}
        {!user && (
          <div className="mb-8">
            <KickAuth 
              onSubscriptionChange={(subscribed: boolean) => setIsSubscribed(subscribed)}
              onUserChange={(userData: any) => setUser(userData)}
            />
          </div>
        )}

        {/* User Profile Status */}
        {user && (
          <div className="mb-6">
            <div className="bg-black border border-cyan-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                {/* User Profile Section */}
                <div className="flex items-center gap-3">
                  {user.profile_image_url ? (
                    <img 
                      src={user.profile_image_url} 
                      alt={user.display_name}
                      className="w-12 h-12 rounded-full border-2 border-cyan-500/50"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full border-2 border-cyan-500/50 flex items-center justify-center">
                      <span className="text-cyan-400 font-bold text-lg">
                        {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-cyan-300 font-medium">Logged in as</div>
                    <div className="text-white font-semibold">
                      {user.display_name || user.username}
                    </div>
                    <div className="text-gray-400 text-sm">
                      @{user.username}
                    </div>
                  </div>
                </div>

                {/* Subscription Status */}
                <div className="text-right">
                  <div className="text-cyan-300 text-sm mb-1">Subscribed:</div>
                  {isSubscribed ? (
                    <div className="text-green-400 font-semibold">
                      ✓ Yes, Thank You!
                    </div>
                  ) : (
                    <a 
                      href="https://kick.com/bulletbait604/subscribe" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-400 font-semibold hover:text-red-300 underline cursor-pointer transition-colors"
                    >
                      ✗ Not yet - Click here
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('kickUser')
                        localStorage.removeItem('kickAccessToken')
                        localStorage.removeItem('kickSubscription')
                      }
                      setUser(null)
                      setIsSubscribed(false)
                    }}
                    className="block mt-2 text-xs text-gray-400 hover:text-cyan-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="analyzer" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black border border-cyan-500">
            <TabsTrigger value="analyzer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Content Analysis</TabsTrigger>
            <TabsTrigger value="ai-optimizer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">
              AI Optimizer
              {!isSubscribed && <span className="ml-1 text-xs">🔒</span>}
            </TabsTrigger>
            <TabsTrigger value="tags" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">
              Tag Generator
              {!isSubscribed && <span className="ml-1 text-xs">🔒</span>}
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Platform Optimizer</TabsTrigger>
            <TabsTrigger value="clip" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Clip Analysis</TabsTrigger>
            <TabsTrigger value="tips" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Improvement Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer" className="mt-6">
            <ContentAnalyzer />
          </TabsContent>

          <TabsContent value="ai-optimizer" className="mt-6">
            {isSubscribed ? (
              <AIContentOptimizer />
            ) : (
              <Card className="bg-black border border-cyan-500">
                <CardContent className="text-center py-12">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">🔒 Premium Feature</h3>
                  <p className="text-cyan-300 mb-6">
                    Subscribe to <strong>bulletbait604</strong> on Kick to unlock DeepSeek AI-powered content optimization.
                  </p>
                  <div className="text-sm text-cyan-400">
                    <p>✨ Advanced AI analysis</p>
                    <p>✨ Algorithm scoring</p>
                    <p>✨ Content optimization</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tags" className="mt-6">
            {isSubscribed ? (
              <TagGenerator />
            ) : (
              <Card className="bg-black border border-cyan-500">
                <CardContent className="text-center py-12">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">🔒 Premium Feature</h3>
                  <p className="text-cyan-300 mb-6">
                    Subscribe to <strong>bulletbait604</strong> on Kick to unlock DeepSeek AI-powered tag generation.
                  </p>
                  <div className="text-sm text-cyan-400">
                    <p>✨ AI-generated tags</p>
                    <p>✨ Platform optimization</p>
                    <p>✨ Trend analysis</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="optimizer" className="mt-6">
            <PlatformOptimizer />
          </TabsContent>

          <TabsContent value="clip" className="mt-6">
            <ClipAnalyzer />
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <ImprovementTips />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
