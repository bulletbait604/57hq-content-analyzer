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
  const [userBadges, setUserBadges] = useState<any[]>([])
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<string>('')

  // Get user badges and subscription status from bulletbait604 using multiple approaches
  const getUserBadges = async (username: string) => {
    console.log(`🔍 Looking for badges for @${username} in bulletbait604`)
    
    // Method 1: Try official Kick API v2 (most reliable)
    try {
      const channelResponse = await fetch(`https://kick.com/api/v2/channels/bulletbait604`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
          'Origin': 'https://kick.com',
          'Referer': 'https://kick.com'
        }
      })

      console.log(`📡 Channel API response status: ${channelResponse.status}`)
      
      if (channelResponse.ok) {
        const responseText = await channelResponse.text()
        console.log('📋 Raw channel response:', responseText.substring(0, 500))
        
        // Check if response is HTML (error page) or JSON
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          console.log('❌ Channel API returned HTML instead of JSON - possibly blocked or rate limited')
        } else {
          try {
            const channelData = JSON.parse(responseText)
            console.log('📺 Channel data:', channelData)
            
            if (channelData.chatroom) {
              const chatroomId = channelData.chatroom.id
              console.log(`💬 Found chatroom ID: ${chatroomId}`)
              
              // Get recent chat messages
              const messagesResponse = await fetch(`https://kick.com/api/v2/chatrooms/${chatroomId}/messages`, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
                  'Origin': 'https://kick.com',
                  'Referer': 'https://kick.com'
                }
              })

              console.log(`📡 Messages API response status: ${messagesResponse.status}`)
              
              if (messagesResponse.ok) {
                const messagesResponseText = await messagesResponse.text()
                console.log('📋 Raw messages response:', messagesResponseText.substring(0, 500))
                
                if (messagesResponseText.includes('<!DOCTYPE') || messagesResponseText.includes('<html')) {
                  console.log('❌ Messages API returned HTML instead of JSON')
                } else {
                  try {
                    const messagesData = JSON.parse(messagesResponseText)
                    console.log('📋 Chat messages data:', messagesData)
                    
                    if (messagesData.data && Array.isArray(messagesData.data)) {
                      const userMessages = messagesData.data.filter((message: any) => 
                        message.sender && 
                        message.sender.username && 
                        message.sender.username.toLowerCase() === username.toLowerCase()
                      )
                      
                      console.log(`📋 Found ${userMessages.length} messages from ${username}`)
                      
                      if (userMessages.length > 0) {
                        const latestMessage = userMessages[0]
                        const badges = latestMessage.sender.badges || []
                        console.log(`🏅 User badges found:`, badges)
                        return badges
                      }
                    } else {
                      console.log('❌ messagesData.data is not an array:', messagesData.data)
                    }
                  } catch (jsonError) {
                    console.log('❌ Failed to parse messages JSON:', jsonError)
                  }
                }
              } else {
                console.log(`❌ Messages API failed: ${messagesResponse.status}`)
              }
            }
          } catch (jsonError) {
            console.log('❌ Failed to parse channel JSON:', jsonError)
          }
        }
      } else {
        console.log(`❌ Channel API failed: ${channelResponse.status}`)
      }
    } catch (error) {
      console.error('❌ Official API failed:', error)
    }
    
    // Method 2: Try RapidAPI as fallback
    try {
      console.log('🔄 Trying RapidAPI as fallback...')
      const rapidResponse = await fetch(`https://kick-api2.p.rapidapi.com/v2/channels/bulletbait604`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KICK_API_KEY || '',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      console.log(`📡 RapidAPI response status: ${rapidResponse.status}`)
      
      if (rapidResponse.ok) {
        const rapidResponseText = await rapidResponse.text()
        console.log('📋 Raw RapidAPI response:', rapidResponseText.substring(0, 500))
        
        if (rapidResponseText.includes('<!DOCTYPE') || rapidResponseText.includes('<html')) {
          console.log('❌ RapidAPI returned HTML instead of JSON')
        } else {
          try {
            const rapidData = JSON.parse(rapidResponseText)
            console.log('📺 RapidAPI data:', rapidData)
            
            if (rapidData.data && rapidData.data.chatroom) {
              const chatroomId = rapidData.data.chatroom.id
              console.log(`💬 Found RapidAPI chatroom ID: ${chatroomId}`)
              
              // Get recent chat messages from RapidAPI
              const messagesResponse = await fetch(`https://kick-api2.p.rapidapi.com/v2/chatrooms/${chatroomId}/messages`, {
                method: 'GET',
                headers: {
                  'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KICK_API_KEY || '',
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              })

              if (messagesResponse.ok) {
                const rapidMessagesText = await messagesResponse.text()
                console.log('📋 Raw RapidAPI messages response:', rapidMessagesText.substring(0, 500))
                
                if (rapidMessagesText.includes('<!DOCTYPE') || rapidMessagesText.includes('<html')) {
                  console.log('❌ RapidAPI messages returned HTML instead of JSON')
                } else {
                  try {
                    const messagesData = JSON.parse(rapidMessagesText)
                    console.log('📋 RapidAPI messages data:', messagesData)
                    
                    if (messagesData.data && Array.isArray(messagesData.data)) {
                      const userMessages = messagesData.data.filter((message: any) => 
                        message.sender && 
                        message.sender.username && 
                        message.sender.username.toLowerCase() === username.toLowerCase()
                      )
                      
                      console.log(`📋 Found ${userMessages.length} messages from ${username} via RapidAPI`)
                      
                      if (userMessages.length > 0) {
                        const latestMessage = userMessages[0]
                        const badges = latestMessage.sender.badges || []
                        console.log(`🏅 User badges found via RapidAPI:`, badges)
                        return badges
                      }
                    } else {
                      console.log('❌ RapidAPI messagesData.data is not an array:', messagesData.data)
                    }
                  } catch (rapidJsonError) {
                    console.log('❌ Failed to parse RapidAPI messages JSON:', rapidJsonError)
                  }
                }
              }
            }
          } catch (rapidJsonError) {
            console.log('❌ Failed to parse RapidAPI JSON:', rapidJsonError)
          }
        }
      } else {
        console.log(`❌ RapidAPI failed: ${rapidResponse.status}`)
      }
    } catch (rapidError) {
      console.error('❌ RapidAPI failed:', rapidError)
    }
    
    // Method 3: Try subscription endpoint directly
    try {
      console.log('🔄 Trying subscription endpoint...')
      const subResponse = await fetch(`https://kick.com/api/v2/channels/bulletbait604/subscribers`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
          'Origin': 'https://kick.com',
          'Referer': 'https://kick.com'
        }
      })

      console.log(`📡 Subscription API response status: ${subResponse.status}`)
      
      if (subResponse.ok) {
        const subResponseText = await subResponse.text()
        console.log('📋 Raw subscription response:', subResponseText.substring(0, 500))
        
        if (subResponseText.includes('<!DOCTYPE') || subResponseText.includes('<html')) {
          console.log('❌ Subscription API returned HTML instead of JSON')
        } else {
          try {
            const subData = JSON.parse(subResponseText)
            console.log('📋 Subscription data:', subData)
            
            if (subData.data && Array.isArray(subData.data)) {
              const userSub = subData.data.find((sub: any) => 
                sub.username && 
                sub.username.toLowerCase() === username.toLowerCase()
              )
              
              if (userSub) {
                console.log(`✅ Found user in subscribers list:`, userSub)
                // Create a subscriber badge if user is in subscribers list
                return [{ type: 'subscriber', name: 'Subscriber', source: 'subscribers_api' }]
              }
            } else {
              console.log('❌ User not found in subscribers list')
            }
          } catch (subJsonError) {
            console.log('❌ Failed to parse subscription JSON:', subJsonError)
          }
        }
      } else {
        console.log(`❌ Subscription API failed: ${subResponse.status}`)
      }
    } catch (subError) {
      console.error('❌ Subscription API failed:', subError)
    }
    
    console.log('🏅 No badges found, returning empty array')
    return []
  }

  // Generate random 4-digit code
  const generateVerificationCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString().substring(1)
    setVerificationCode(code)
    return code
  }

  // Copy code to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      console.log('📋 Code copied to clipboard')
      return true
    } catch (err) {
      console.error('❌ Failed to copy to clipboard:', err)
      return false
    }
  }

  // Start verification process
  const startVerification = () => {
    const code = generateVerificationCode()
    setVerificationStatus('🔄 Verification started - paste code in chat')
    setIsVerifying(true)
  }

  // Check verification status by monitoring chat
  const checkVerificationStatus = async () => {
    if (!verificationCode || !user) return
    
    try {
      // Get recent chat messages to find the verification code
      const channelResponse = await fetch(`https://kick.com/api/v2/channels/bulletbait604`, {
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
        const responseText = await channelResponse.text()
        
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          console.log('❌ Channel API returned HTML instead of JSON')
          setVerificationStatus('❌ API Error - Could not check verification status')
          return
        }
        
        try {
          const channelData = JSON.parse(responseText)
          
          if (channelData.chatroom) {
            const chatroomId = channelData.chatroom.id
            
            // Get recent chat messages
            const messagesResponse = await fetch(`https://kick.com/api/v2/chatrooms/${chatroomId}/messages`, {
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
              const messagesResponseText = await messagesResponse.text()
              
              if (messagesResponseText.includes('<!DOCTYPE') || messagesResponseText.includes('<html')) {
                console.log('❌ Messages API returned HTML instead of JSON')
                setVerificationStatus('❌ API Error - Could not check verification status')
                return
              }
              
              try {
                const messagesData = JSON.parse(messagesResponseText)
                
                if (messagesData.data && Array.isArray(messagesData.data)) {
                  // Find messages from the current user
                  const userMessages = messagesData.data.filter((message: any) => 
                    message.sender && 
                    message.sender.username && 
                    message.sender.username.toLowerCase() === user.username.toLowerCase()
                  )
                  
                  // Look for verification code in user's messages
                  const verificationMessage = userMessages.find((message: any) => 
                    message.content && 
                    message.content.includes(verificationCode)
                  )
                  
                  if (verificationMessage) {
                    console.log('✅ Verification code found in chat!')
                    
                    // Get user's badges from that message
                    const badges = verificationMessage.sender.badges || []
                    setUserBadges(badges)
                    setVerificationStatus('✅ Verification successful! Badges loaded.')
                    setIsVerifying(false)
                    
                    console.log('🏅 User badges from verification:', badges)
                  } else {
                    console.log('⏳ Verification code not found yet, checking again...')
                    // Check again after 3 seconds
                    setTimeout(checkVerificationStatus, 3000)
                  }
                }
              } else {
                console.log('❌ messagesData.data is not an array:', messagesData.data)
                setVerificationStatus('❌ API Error - Invalid message data format')
              }
            } catch (jsonError) {
              console.log('❌ Failed to parse messages JSON:', jsonError)
              setVerificationStatus('❌ API Error - Failed to parse chat messages')
            }
          } else {
            console.log(`❌ Messages API failed: ${messagesResponse.status}`)
            setVerificationStatus('❌ API Error - Could not fetch chat messages')
          }
        } catch (jsonError) {
          console.log('❌ Failed to parse channel JSON:', jsonError)
          setVerificationStatus('❌ API Error - Failed to parse channel data')
        }
      } else {
        console.log(`❌ Channel API failed: ${channelResponse.status}`)
        setVerificationStatus('❌ API Error - Could not fetch channel info')
      }
    } catch (error) {
      console.error('❌ Verification check failed:', error)
      setVerificationStatus('❌ Verification Error - Network error')
    }
  }

  // Load user badges when user logs in
  useEffect(() => {
    if (user) {
      getUserBadges(user.username).then(badges => {
        setUserBadges(badges)
        console.log('🏅 User badges from bulletbait604:', badges)
      }).catch(error => {
        console.error('❌ Badge fetch error:', error)
      })
    }
  }, [user])

  // Check if user has subscriber badge
  const hasSubscriberBadge = userBadges.some((badge: any) => 
    badge.type === 'subscriber' || 
    badge.type === 'subscription' ||
    badge.badge === 'subscriber' ||
    badge.badge === 'subscription' ||
    badge.name?.toLowerCase().includes('sub')
  )

  console.log(`🔐 Subscriber access: ${hasSubscriberBadge ? '✅ Granted' : '❌ Denied'}`)

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

        {/* Kick Authentication Section - Only show if not logged in */}
        {!user && (
          <div className="mb-8">
            <KickAuth 
              onUserChange={(userData: any) => setUser(userData)}
            />
          </div>
        )}

        {/* User Profile Status */}
        {user && (
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
                <div className="text-right">
                  {/* Verification Section */}
                  {!hasSubscriberBadge && (
                    <div className="mb-3">
                      <div className="text-cyan-300 text-sm mb-2">Verify Badges</div>
                      <div className="bg-black border border-cyan-500 rounded p-3 mb-3">
                        <div className="text-center mb-3">
                          <div className="text-cyan-300 font-mono text-lg mb-2">{verificationCode}</div>
                          <div className="text-gray-300 text-sm mb-3">
                            Copy this code and paste it into Bulletbait604's chat to verify your badges.
                          </div>
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => copyToClipboard(verificationCode)}
                              className="bg-cyan-500 hover:bg-cyan-600 text-black px-3 py-1 text-sm rounded"
                            >
                              📋 Copy Code
                            </button>
                            <a
                              href="https://kick.com/bulletbait604"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 text-sm rounded"
                            >
                              🚀 Go to Channel
                            </a>
                          </div>
                        </div>
                        {verificationStatus && (
                          <div className="text-center text-xs text-gray-400 mt-2">
                            {verificationStatus}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      onClick={startVerification}
                      disabled={isVerifying}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-black text-sm"
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-cyan-500 rounded-full animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="text-cyan-300">Verify Badges</div>
                          </div>
                        </>
                      )}
                    </Button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('kickUser')
                        localStorage.removeItem('kickAccessToken')
                      }
                      setUser(null)
                      setVerificationCode('')
                      setVerificationStatus('')
                      setIsVerifying(false)
                    }}
                    className="text-xs text-gray-400 hover:text-cyan-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="algorithm-info" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-black border border-cyan-500">
            <TabsTrigger value="algorithm-info" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Algorithm Info</TabsTrigger>
            <TabsTrigger 
              value="content-analysis" 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
              disabled={!hasSubscriberBadge}
            >
              Content Analysis {hasSubscriberBadge ? '' : '🔒'}
            </TabsTrigger>
            <TabsTrigger 
              value="clip-analysis" 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
              disabled={!hasSubscriberBadge}
            >
              Clip Analysis {hasSubscriberBadge ? '' : '🔒'}
            </TabsTrigger>
            <TabsTrigger 
              value="optimizer" 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
              disabled={!hasSubscriberBadge}
            >
              Platform Optimizer {hasSubscriberBadge ? '' : '🔒'}
            </TabsTrigger>
            <TabsTrigger value="connections" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Connections</TabsTrigger>
            <TabsTrigger 
              value="tag-generator" 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
              disabled={!hasSubscriberBadge}
            >
              Tag Generator {hasSubscriberBadge ? '' : '🔒'}
            </TabsTrigger>
            <TabsTrigger 
              value="ai-optimizer" 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
              disabled={!hasSubscriberBadge}
            >
              AI Optimizer {hasSubscriberBadge ? '' : '🔒'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="algorithm-info" className="mt-6">
            <AlgorithmInfoEnhanced />
          </TabsContent>

          <TabsContent value="content-analysis" className="mt-6">
            {hasSubscriberBadge ? (
              <ContentAnalyzerEnhanced />
            ) : (
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
            )}
          </TabsContent>

          <TabsContent value="clip-analysis" className="mt-6">
            {hasSubscriberBadge ? (
              <ClipAnalyzerEnhanced />
            ) : (
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
            )}
          </TabsContent>

          <TabsContent value="optimizer" className="mt-6">
            {hasSubscriberBadge ? (
              <PlatformOptimizer />
            ) : (
              <Card className="bg-black border border-red-500">
                <CardContent className="text-center py-8">
                  <div className="text-red-400 text-lg font-semibold mb-4">🔒 Subscriber Only Feature</div>
                  <p className="text-gray-300 mb-4">
                    Platform Optimizer requires a subscription to bulletbait604
                  </p>
                  <p className="text-cyan-300 text-sm">
                    Subscribe to unlock AI-powered optimization features
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <Connections />
          </TabsContent>

          <TabsContent value="tag-generator" className="mt-6">
            {hasSubscriberBadge ? (
              <TagGenerator />
            ) : (
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
            )}
          </TabsContent>

          <TabsContent value="ai-optimizer" className="mt-6">
            {hasSubscriberBadge ? (
              <AIContentOptimizer />
            ) : (
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
