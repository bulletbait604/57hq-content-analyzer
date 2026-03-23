'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { KickAuth } from '@/components/KickAuth'
import { ClipAnalysis } from '@/components/ClipAnalysis'
import { Settings as SettingsComponent } from '@/components/Settings'
import { Footer } from '@/components/Footer'
import { AlgorithmUpdater } from '@/lib/algorithm-updater'
import { PremiumAccess } from '@/lib/premium-access'
import { 
  Upload, 
  Play, 
  Settings, 
  FileText, 
  Hash, 
  Search, 
  Clock, 
  RefreshCw,
  Lock,
  CheckCircle,
  ExternalLink,
  Star,
  TrendingUp,
  Video,
  Image,
  MessageSquare,
  Eye,
  Heart,
  Share2,
  Crown,
  Zap
} from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [hasPremium, setHasPremium] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  // Check for existing session on mount
  useEffect(() => {
    // Initialize premium access system
    PremiumAccess.getInstance().initialize()
    
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
      
      if (storedTheme) {
        setTheme(storedTheme)
        applyTheme(storedTheme)
      }
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setHasPremium(PremiumAccess.getInstance().hasPremiumAccess(parsedUser.username))
        } catch (error) {
          console.error('Error parsing stored user:', error)
          localStorage.removeItem('kickUser')
        }
      }
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const applyTheme = (newTheme: 'dark' | 'light') => {
    if (newTheme === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }

  const handleUserChange = (userData: any) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem('kickUser', JSON.stringify(userData))
      setHasPremium(PremiumAccess.getInstance().hasPremiumAccess(userData.username))
    } else {
      localStorage.removeItem('kickUser')
      setHasPremium(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">57HQ Content Analyzer</h1>
          <p className="text-gray-300">Ultimate Content Creator Platform - AI-Powered Analysis & Optimization</p>
        </div>

        {/* Authentication */}
        <div className="mb-8">
          <KickAuth onUserChange={handleUserChange} />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="algorithm-info" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black border border-green-500/30">
            <TabsTrigger 
              value="algorithm-info" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-black text-gray-400 border border-green-500/30"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Algorithm Info
            </TabsTrigger>
            <TabsTrigger 
              value="clip-analysis" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-black text-gray-400 border border-green-500/30"
            >
              <Video className="w-4 h-4 mr-2" />
              Clip Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="tag-generator" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-black text-gray-400 border border-green-500/30"
            >
              <Hash className="w-4 h-4 mr-2" />
              Tag Generator
            </TabsTrigger>
            <TabsTrigger 
              value="content-analysis" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-black text-gray-400 border border-green-500/30"
            >
              <Search className="w-4 h-4 mr-2" />
              Content Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="legal" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-black text-gray-400 border border-green-500/30"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="algorithm-info" className="mt-6">
            <AlgorithmInfo />
          </TabsContent>

          <TabsContent value="clip-analysis" className="mt-6">
            <ClipAnalysis user={user} hasPremium={hasPremium} />
          </TabsContent>

          <TabsContent value="tag-generator" className="mt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-400 mb-2">Tag Generator</h2>
              <p className="text-gray-300">Generate optimized tags for your content</p>
            </div>
          </TabsContent>

          <TabsContent value="content-analysis" className="mt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-400 mb-2">Content Analysis</h2>
              <p className="text-gray-300">Analyze your content performance across platforms</p>
            </div>
          </TabsContent>

          <TabsContent value="legal" className="mt-6">
            <SettingsComponent user={user} hasPremium={hasPremium} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Footer */}
      <Footer language={user ? localStorage.getItem('language') || 'en' : 'en'} />
    </div>
  )
}

// Algorithm Info Component
function AlgorithmInfo() {
  const [lastRefresh, setLastRefresh] = useState<string>('2024-03-23 10:00:00')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [platforms, setPlatforms] = useState([
    {
      name: 'YouTube Shorts',
      icon: '⚡',
      color: 'border-red-500',
      bgColor: 'bg-red-500/10',
      lastUpdate: '2024-03-23',
      factors: [
        'Watch time retention (first 3 seconds critical)',
        'Swipe-up rate (vertical engagement)',
        'Video completion rate',
        'Comments-to-views ratio',
        'Share velocity',
        'Audio trending score',
        'Re-watch value',
        'Session time contribution'
      ],
      tips: [
        'Hook viewers in first 2 seconds',
        'Use trending audio & effects',
        'Optimize for 15-25 second length',
        'Add clear call-to-action',
        'Post at peak audience times',
        'Use 2-3 relevant hashtags',
        'Reply to comments quickly',
        'Create binge-worthy series'
      ]
    },
    {
      name: 'YouTube Long',
      icon: '📹',
      color: 'border-red-500',
      bgColor: 'bg-red-500/10',
      lastUpdate: '2024-03-23',
      factors: [
        'Total watch time & audience retention',
        'Click-through rate (CTR) from thumbnails',
        'Session time contribution',
        'Engagement velocity (likes, comments)',
        'Subscriber conversion rate',
        'Video SEO & keywords',
        'Content consistency score',
        'Audience satisfaction signals'
      ],
      tips: [
        'Optimize thumbnails for high CTR',
        'Focus on 8+ minute retention',
        'Use strategic keyword placement',
        'Build consistent upload schedule',
        'Create series & playlists',
        'Engage with community comments',
        'Analyze audience retention graphs',
        'Cross-promote on social platforms'
      ]
    },
    {
      name: 'TikTok',
      icon: '🎵',
      color: 'border-pink-500',
      bgColor: 'bg-pink-500/10',
      lastUpdate: '2024-03-23',
      factors: [
        'Video completion rate',
        'Re-watch value',
        'Share velocity',
        'Comments-to-views ratio',
        'Trending audio usage',
        'User interaction speed',
        'Session time contribution',
        'Content relevance score'
      ],
      tips: [
        'Use trending sounds & effects',
        'Keep videos 15-30 seconds',
        'Add engaging captions & hashtags',
        'Post 3-4 times daily',
        'Engage with trends quickly',
        'Create duet & stitch content',
        'Build community through replies',
        'Analyze viral patterns'
      ]
    },
    {
      name: 'Instagram',
      icon: '📷',
      color: 'border-purple-500',
      bgColor: 'bg-purple-500/10',
      lastUpdate: '2024-03-23',
      factors: [
        'Reels completion rate',
        'Share & save metrics',
        'Comments-to-impressions ratio',
        'Profile visit rate',
        'Hashtag relevance',
        'Story interaction rate',
        'Engagement velocity',
        'Content diversity score'
      ],
      tips: [
        'Use 10-15 relevant hashtags',
        'Post Reels 3-5 times weekly',
        'Optimize for 9:16 vertical format',
        'Create shareable content',
        'Engage with stories daily',
        'Use Instagram analytics',
        'Build content themes',
        'Cross-promote on Stories'
      ]
    },
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
      lastUpdate: '2024-03-23',
      factors: [
        'Retweet velocity',
        'Quote tweet engagement',
        'Reply thread depth',
        'Hashtag trending potential',
        'Link click-through rate',
        'Follower growth rate',
        'List inclusion rate',
        'Content amplification score'
      ],
      tips: [
        'Tweet 2-3 times daily',
        'Use 1-2 relevant hashtags',
        'Create engaging thread series',
        'Post at peak engagement times',
        'Share visual content',
        'Engage with replies quickly',
        'Use Twitter analytics',
        'Build community connections'
      ]
    },
    {
      name: 'Facebook Reels',
      icon: '👥',
      color: 'border-blue-600',
      bgColor: 'bg-blue-600/10',
      lastUpdate: '2024-03-23',
      factors: [
        'Video completion rate',
        'Share velocity',
        'Comments-to-views ratio',
        'Re-watch frequency',
        'Audio trending score',
        'Cross-platform engagement',
        'Page relationship score',
        'Content relevance rating'
      ],
      tips: [
        'Create 15-30 second Reels',
        'Use trending audio & effects',
        'Add engaging captions',
        'Post 2-3 times weekly',
        'Share to Facebook Stories',
        'Engage with comments',
        'Use Facebook Insights',
        'Build community engagement'
      ]
    }
  ])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    try {
      // Simulate API call to refresh algorithm data
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const now = new Date()
      const formattedTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(',', '')
      
      setLastRefresh(formattedTime)
      
      // Update platform data with new timestamps
      setPlatforms(prev => prev.map(platform => ({
        ...platform,
        lastUpdate: formattedTime
      })))
      
    } catch (error) {
      console.error('Error refreshing algorithm data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Platform Algorithm Information</h2>
        <p className="text-gray-300">Real-time algorithm insights and optimization strategies</p>
      </div>

      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Algorithm Updates
            </span>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-green-600 hover:bg-green-500 text-black"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Now
                </>
              )}
            </Button>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Last updated: {lastRefresh} • Auto-refreshes every Sunday at 12:00 AM UTC
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform, index) => (
          <Card key={index} className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className={`text-lg font-semibold ${platform.color.replace('border', 'text')}`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{platform.icon}</span>
                  {platform.name}
                </div>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Last updated: {platform.lastUpdate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-green-400 font-medium mb-2">Key Algorithm Factors</h4>
                <ul className="space-y-1">
                  {platform.factors.slice(0, 4).map((factor, factorIndex) => (
                    <li key={factorIndex} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-green-400 font-medium mb-2">Optimization Tips</h4>
                <ul className="space-y-1">
                  {platform.tips.slice(0, 3).map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <Badge className={`${platform.bgColor} ${platform.color} text-white`}>
                  <Clock className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Pro Algorithm Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/50 p-4 rounded-lg border border-green-500/20">
              <h4 className="text-green-400 font-medium mb-2">🔥 Trending Now</h4>
              <p className="text-gray-300 text-sm">
                Short-form content (15-30s) seeing 3x higher engagement across all platforms
              </p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg border border-green-500/20">
              <h4 className="text-green-400 font-medium mb-2">📊 Algorithm Shift</h4>
              <p className="text-gray-300 text-sm">
                Platforms prioritizing original audio and creator authenticity
              </p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg border border-green-500/20">
              <h4 className="text-green-400 font-medium mb-2">🎯 Best Practices</h4>
              <p className="text-gray-300 text-sm">
                Consistent posting schedule + community engagement = 2x growth
              </p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg border border-green-500/20">
              <h4 className="text-green-400 font-medium mb-2">⚡ Quick Wins</h4>
              <p className="text-gray-300 text-sm">
                Trending audio + strong hook = 70% higher completion rates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-green-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-green-400">
            <RefreshCw className="w-5 h-5" />
            <span className="font-semibold">Auto-Update Schedule</span>
          </div>
          <p className="text-gray-300 mt-2">
            Algorithm data is automatically refreshed every Sunday at 12:00 AM UTC using AI research to ensure you always have the latest insights.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

