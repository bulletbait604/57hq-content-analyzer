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
import { getSocialVerificationService } from '@/lib/social-verification'
import { AICreditsManager } from '@/lib/ai-credits'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [channelSubscriptions, setChannelSubscriptions] = useState<any[]>([])
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState<boolean>(false)
  const [socialVerification, setSocialVerification] = useState<any>(null)
  const [isLoadingVerification, setIsLoadingVerification] = useState<boolean>(false)
  const [aiCredits, setAiCredits] = useState<any>(null)

  // Check user subscriptions when user logs in
  useEffect(() => {
    if (user && user.username) {
      checkUserSubscriptions(user.username)
      checkSocialVerification(user.username)
      updateAICredits(user.username)
    } else {
      setChannelSubscriptions([])
      setSocialVerification(null)
      setAiCredits(null)
    }
  }, [user])

  // Check social verification across platforms
  const checkSocialVerification = async (username: string) => {
    setIsLoadingVerification(true)
    try {
      const socialService = getSocialVerificationService()
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('kickAccessToken') : null
      
      if (accessToken) {
        socialService.setKickAccessToken(accessToken)
      }
      
      const verification = await socialService.verifyAllPlatforms(username)
      setSocialVerification(verification)
      console.log(`✅ Social verification complete: ${verification.verifiedPlatforms}/${verification.totalPlatforms} platforms`)
    } catch (error) {
      console.error('❌ Social verification failed:', error)
      setSocialVerification(null)
    } finally {
      setIsLoadingVerification(false)
    }
  }

  // Update AI credits based on verification
  const updateAICredits = (username: string) => {
    const credits = AICreditsManager.getCreditsSummary(username)
    setAiCredits(credits)
  }

  // Function to check user subscriptions
  const checkUserSubscriptions = async (username: string) => {
    setIsLoadingSubscriptions(true)
    try {
      // Get access token from localStorage
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('kickAccessToken') : null
      
      if (!accessToken) {
        console.log('❌ No access token found for API call')
        setIsLoadingSubscriptions(false)
        return
      }

      console.log(`🔍 Checking user subscriptions for ${username} via Kick API`)
      
      // Use username as user_id (you might need to get the actual user ID)
      const userId = user?.id || username // Use user ID from OAuth data or fallback to username
      const response = await fetch(`https://api.kick.com/v1/users/${userId}/subscriptions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      console.log(`Kick API user subscriptions response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Got user subscriptions from Kick API:', data)
        
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
        console.log(`📊 Found ${subscriptions.length} user subscriptions`)
      } else {
        const errorText = await response.text()
        console.log(`❌ Kick API user subscriptions failed (${response.status}):`, errorText)
        setChannelSubscriptions([])
      }
    } catch (error) {
      console.error('❌ Error checking user subscriptions:', error)
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
                    
                    {/* Social Verification Status */}
                    <div className="mt-2">
                      {isLoadingVerification ? (
                        <div className="text-yellow-400 text-xs">Checking social verification...</div>
                      ) : socialVerification ? (
                        <div className="text-xs">
                          <div className="text-cyan-400 font-semibold mb-1">Social Verification:</div>
                          <div className="text-gray-300">
                            <div>✅ Verified: {socialVerification.verifiedPlatforms}/{socialVerification.totalPlatforms} platforms</div>
                            <div>🎯 AI Credits: {aiCredits?.remaining || 0}/{aiCredits?.maxPerDay || 0} per day</div>
                            {socialVerification.socialStatus.map((status: any, index: number) => (
                              <div key={index} className="flex items-center gap-1 mt-1">
                                <div className={`w-2 h-2 rounded-full ${status.isFollowing || status.isSubscribed ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                <span className="text-gray-400">
                                  {status.platform}: {status.isFollowing || status.isSubscribed ? '✅' : '❌'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">Social verification not available</div>
                      )}
                    </div>

                    {/* User Subscriptions Data */}
                    <div className="mt-2">
                      {isLoadingSubscriptions ? (
                        <div className="text-yellow-400 text-xs">Loading user subscriptions...</div>
                      ) : (
                        <div className="text-xs">
                          <div className="text-cyan-400 font-semibold mb-1">User Subscriptions API Data:</div>
                          <div className="text-gray-300">
                            {channelSubscriptions.length > 0 && (
                              <div className="mt-1">
                                <div className="text-gray-400">Sample data:</div>
                                <div className="text-xs text-gray-500 break-all">
                                  {JSON.stringify(channelSubscriptions[0], null, 2).substring(0, 200)}...
                                </div>
                              </div>
                            )}
                            {channelSubscriptions.length === 0 && (
                              <div className="text-gray-400 text-xs mt-1">No active subscriptions found</div>
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
            {socialVerification?.isVerified && aiCredits?.remaining > 0 ? (
              <ContentAnalyzerEnhanced />
            ) : (
              <Card className="bg-black border border-red-500">
                <CardContent className="text-center py-8">
                  <div className="text-red-400 text-lg font-semibold mb-4">🔒 Social Verification Required</div>
                  <p className="text-gray-300 mb-4">
                    Content Analysis requires verification on at least 2 social platforms
                  </p>
                  <p className="text-cyan-300 text-sm mb-2">
                    Follow/Subscribe on: Kick (bulletbait604), TikTok (@thebulletbait), YouTube (bulletbait604)
                  </p>
                  {aiCredits && (
                    <p className="text-yellow-400 text-sm">
                      Your AI Credits: {aiCredits.remaining}/{aiCredits.maxPerDay} per day
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="clip-analysis" className="mt-6">
            {socialVerification?.isVerified && aiCredits?.remaining > 0 ? (
              <ClipAnalyzerEnhanced />
            ) : (
              <Card className="bg-black border border-red-500">
                <CardContent className="text-center py-8">
                  <div className="text-red-400 text-lg font-semibold mb-4">🔒 Social Verification Required</div>
                  <p className="text-gray-300 mb-4">
                    Clip Analysis requires verification on at least 2 social platforms
                  </p>
                  <p className="text-cyan-300 text-sm mb-2">
                    Follow/Subscribe on: Kick (bulletbait604), TikTok (@thebulletbait), YouTube (bulletbait604)
                  </p>
                  {aiCredits && (
                    <p className="text-yellow-400 text-sm">
                      Your AI Credits: {aiCredits.remaining}/{aiCredits.maxPerDay} per day
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="platform-optimizer" className="mt-6">
            {socialVerification?.isVerified && aiCredits?.remaining > 0 ? (
              <PlatformOptimizer />
            ) : (
              <Card className="bg-black border border-red-500">
                <CardContent className="text-center py-8">
                  <div className="text-red-400 text-lg font-semibold mb-4">🔒 Social Verification Required</div>
                  <p className="text-gray-300 mb-4">
                    Platform Optimizer requires verification on at least 2 social platforms
                  </p>
                  <p className="text-cyan-300 text-sm mb-2">
                    Follow/Subscribe on: Kick (bulletbait604), TikTok (@thebulletbait), YouTube (bulletbait604)
                  </p>
                  {aiCredits && (
                    <p className="text-yellow-400 text-sm">
                      Your AI Credits: {aiCredits.remaining}/{aiCredits.maxPerDay} per day
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <Connections />
          </TabsContent>

          <TabsContent value="tag-generator" className="mt-6">
            {socialVerification?.isVerified && aiCredits?.remaining > 0 ? (
              <TagGenerator />
            ) : (
              <Card className="bg-black border border-red-500">
                <CardContent className="text-center py-8">
                  <div className="text-red-400 text-lg font-semibold mb-4">🔒 Social Verification Required</div>
                  <p className="text-gray-300 mb-4">
                    Tag Generator requires verification on at least 2 social platforms
                  </p>
                  <p className="text-cyan-300 text-sm mb-2">
                    Follow/Subscribe on: Kick (bulletbait604), TikTok (@thebulletbait), YouTube (bulletbait604)
                  </p>
                  {aiCredits && (
                    <p className="text-yellow-400 text-sm">
                      Your AI Credits: {aiCredits.remaining}/{aiCredits.maxPerDay} per day
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ai-optimizer" className="mt-6">
            {socialVerification?.isVerified && aiCredits?.remaining > 0 ? (
              <AIContentOptimizer />
            ) : (
              <Card className="bg-black border border-red-500">
                <CardContent className="text-center py-8">
                  <div className="text-red-400 text-lg font-semibold mb-4">🔒 Social Verification Required</div>
                  <p className="text-gray-300 mb-4">
                    AI Content Optimizer requires verification on at least 2 social platforms
                  </p>
                  <p className="text-cyan-300 text-sm mb-2">
                    Follow/Subscribe on: Kick (bulletbait604), TikTok (@thebulletbait), YouTube (bulletbait604)
                  </p>
                  {aiCredits && (
                    <p className="text-yellow-400 text-sm">
                      Your AI Credits: {aiCredits.remaining}/{aiCredits.maxPerDay} per day
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
