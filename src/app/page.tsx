'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { KickAuth } from '@/components/KickAuth'
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
  Share2
} from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          console.log(`✅ Restored user session: ${parsedUser.display_name}`)
        } catch (error) {
          console.error('❌ Error parsing stored user:', error)
          localStorage.removeItem('kickUser')
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">
            SDHQ Content Analyzer
          </h1>
          <p className="text-gray-300">
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
                    className="w-10 h-10 rounded-full border-2 border-green-400/50"
                  />
                  <div>
                    <div className="text-green-400 text-sm font-medium">Logged in as</div>
                    <div className="text-white font-semibold">{user.display_name}</div>
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
                  className="text-xs text-gray-400 hover:text-green-400 transition-colors"
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
          <TabsList className="grid w-full grid-cols-6 bg-black border border-green-500/50">
            <TabsTrigger value="algorithm-info" className="text-white hover:bg-green-900 hover:text-green-400 data-[state=active]:bg-green-800 data-[state=active]:text-green-300">Algorithm Info</TabsTrigger>
            <TabsTrigger 
              value="clip-analysis" 
              className="text-white hover:bg-green-900 hover:text-green-400 data-[state=active]:bg-green-800 data-[state=active]:text-green-300"
            >
              Clip Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="tag-generator" 
              className="text-white hover:bg-green-900 hover:text-green-400 data-[state=active]:bg-green-800 data-[state=active]:text-green-300"
            >
              Tag Generator
            </TabsTrigger>
            <TabsTrigger 
              value="content-analysis" 
              className="text-white hover:bg-green-900 hover:text-green-400 data-[state=active]:bg-green-800 data-[state=active]:text-green-300"
            >
              Content Analysis
            </TabsTrigger>
            <TabsTrigger value="legal" className="text-white hover:bg-green-900 hover:text-green-400 data-[state=active]:bg-green-800 data-[state=active]:text-green-300">Legal</TabsTrigger>
            <TabsTrigger 
              value="premium" 
              className="text-white hover:bg-green-900 hover:text-green-400 data-[state=active]:bg-green-800 data-[state=active]:text-green-300"
            >
              Premium
            </TabsTrigger>
          </TabsList>

          <TabsContent value="algorithm-info" className="mt-6">
            <AlgorithmInfo />
          </TabsContent>

          <TabsContent value="clip-analysis" className="mt-6">
            <ClipAnalysis />
          </TabsContent>

          <TabsContent value="tag-generator" className="mt-6">
            <TagGenerator />
          </TabsContent>

          <TabsContent value="content-analysis" className="mt-6">
            <ContentAnalysis />
          </TabsContent>

          <TabsContent value="legal" className="mt-6">
            <Legal />
          </TabsContent>

          <TabsContent value="premium" className="mt-6">
            <Premium />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Algorithm Info Component
function AlgorithmInfo() {
  const [lastRefresh, setLastRefresh] = useState<string>('2024-03-23 10:00:00')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const platforms = [
    {
      name: 'YouTube',
      icon: '🎥',
      color: 'border-red-500',
      bgColor: 'bg-red-500/10',
      lastUpdate: '2024-03-23',
      factors: [
        'Watch time retention (first 30 seconds critical)',
        'Click-through rate from thumbnails',
        'Session watch time contribution',
        'User engagement (likes, comments, shares)',
        'Video upload consistency and timing',
        'Keyword optimization in titles and descriptions'
      ],
      tips: [
        'Create compelling thumbnails with high contrast',
        'Hook viewers in first 15 seconds',
        'Use end screens to promote other content',
        'Post during peak audience hours (6-9 PM local time)',
        'Include relevant keywords in first 2 lines of description'
      ]
    },
    {
      name: 'TikTok',
      icon: '🎵',
      color: 'border-black',
      bgColor: 'bg-black/20',
      lastUpdate: '2024-03-23',
      factors: [
        'Video completion rate (critical for virality)',
        'Re-watch value and loop potential',
        'User engagement velocity (first hour)',
        'Trending sound usage',
        'Video resolution and quality',
        'Posting frequency and consistency'
      ],
      tips: [
        'Use trending sounds but add unique twist',
        'Keep videos under 30 seconds for max reach',
        'Text overlays should be readable without sound',
        'Post 3-5 times daily during peak hours',
        'Engage with comments within first hour'
      ]
    },
    {
      name: 'Instagram',
      icon: '📷',
      color: 'border-pink-500',
      bgColor: 'bg-pink-500/10',
      lastUpdate: '2024-03-23',
      factors: [
        'Engagement rate (likes + comments ÷ followers)',
        'Story completion rate',
        'Reels share velocity',
        'Hashtag relevance and mix',
        'Posting consistency',
        'User interaction speed'
      ],
      tips: [
        'Mix popular and niche hashtags (10-15 total)',
        'Post Reels with trending audio',
        'Use Instagram Stories for behind-the-scenes',
        'Engage with comments within 30 minutes',
        'Post during 7-9 PM for maximum reach'
      ]
    },
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
      lastUpdate: '2024-03-23',
      factors: [
        'Tweet engagement rate',
        'Retweet velocity',
        'Reply thread engagement',
        'Hashtag performance',
        'Posting timing',
        'Media attachment performance'
      ],
      tips: [
        'Post threads for increased engagement',
        'Use 2-3 relevant hashtags maximum',
        'Include high-quality images or videos',
        'Post during 8-10 AM and 2-4 PM',
        'Engage with replies quickly'
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
        'Comment engagement',
        'Original content vs reposts',
        'Audio usage trends',
        'Cross-platform performance'
      ],
      tips: [
        'Keep Reels under 30 seconds',
        'Use trending audio from Facebook library',
        'Add captions for silent viewing',
        'Post 1-2 Reels daily',
        'Share to Facebook Groups for extra reach'
      ]
    }
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call to refresh algorithm data
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLastRefresh(new Date().toLocaleString())
    setIsRefreshing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Platform Algorithm Intelligence</h2>
          <p className="text-gray-300">Latest algorithm insights updated via AI research</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            <Clock className="w-4 h-4 inline mr-1" />
            Last updated: {lastRefresh}
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-green-600 hover:bg-green-500 text-black"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Updating...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform, index) => (
          <Card key={index} className={`bg-black border ${platform.color} hover:${platform.color.replace('border-', 'bg-')}/20 transition-all duration-300`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`text-3xl p-2 rounded-lg ${platform.bgColor} border ${platform.color}`}>
                  {platform.icon}
                </div>
                <div>
                  <CardTitle className="text-green-400">{platform.name}</CardTitle>
                  <CardDescription className="text-gray-400 text-xs">
                    Updated: {platform.lastUpdate}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-green-300 font-semibold mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Key Factors
                </h4>
                <ul className="space-y-1">
                  {platform.factors.map((factor, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-green-300 font-semibold mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Pro Tips
                </h4>
                <ul className="space-y-1">
                  {platform.tips.map((tip, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Auto-update notice */}
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

// Clip Analysis Component
function ClipAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('youtube')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const platforms = [
    { value: 'youtube', label: 'YouTube', icon: '🎥' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'facebook', label: 'Facebook Reels', icon: '👥' }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    
    setIsAnalyzing(true)
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsAnalyzing(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Clip Analysis</h2>
        <p className="text-gray-300">AI-powered content analysis and optimization recommendations</p>
      </div>

      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-yellow-400" />
            <CardTitle className="text-yellow-400">Premium Feature</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Coming Soon For Premium Users - Advanced AI clip analysis with platform-specific optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-green-500/50 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-green-400 mb-2">Upload Your Clip</p>
            <p className="text-gray-400 text-sm mb-4">MP4, MOV, AVI up to 500MB</p>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
              id="clip-upload"
            />
            <label
              htmlFor="clip-upload"
              className="inline-block px-4 py-2 bg-green-600 text-black rounded-lg cursor-pointer hover:bg-green-500 transition-colors"
            >
              Choose File
            </label>
            {selectedFile && (
              <p className="text-green-400 mt-2 text-sm">Selected: {selectedFile.name}</p>
            )}
          </div>

          {/* Platform Selection */}
          <div>
            <Label className="text-green-400 block mb-2">Select Platform</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  onClick={() => setSelectedPlatform(platform.value)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedPlatform === platform.value
                      ? 'bg-green-600 text-black border-green-400'
                      : 'bg-black text-gray-400 border-gray-600 hover:border-green-400'
                  }`}
                >
                  <div className="text-2xl mb-1">{platform.icon}</div>
                  <div className="text-xs">{platform.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className="w-full bg-green-600 hover:bg-green-500 text-black"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analyze Clip
              </>
            )}
          </Button>

          {/* Premium Notice */}
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <Star className="w-5 h-5" />
              <span className="font-semibold">Premium Features Include:</span>
            </div>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• AI-powered content analysis</li>
              <li>• Platform-specific optimization tips</li>
              <li>• Engagement prediction scoring</li>
              <li>• Thumbnail and title recommendations</li>
              <li>• Posting time optimization</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Tag Generator Component
function TagGenerator() {
  const [content, setContent] = useState('')
  const [premiumTags, setPremiumTags] = useState<string[]>([])
  const [freeTags, setFreeTags] = useState<string[]>([])
  const [premiumCount, setPremiumCount] = useState(10)
  const [freeCount, setFreeCount] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)

  // Free tag database (updated monthly)
  const freeTagDatabase = [
    'viral', 'trending', 'fyp', 'foryou', 'explore', 'contentcreator', 'video', 'new', 'latest', 'popular',
    'amazing', 'incredible', 'awesome', 'best', 'top', 'mustsee', 'share', 'like', 'comment', 'follow',
    'creator', 'influencer', 'socialmedia', 'digital', 'online', 'viralvideo', 'trendingnow', 'viralpost',
    'entertainment', 'lifestyle', 'fun', 'comedy', 'dance', 'music', 'art', 'design', 'tech', 'gaming'
  ]

  const generateFreeTags = () => {
    if (!content.trim()) return
    
    const keywords = content.toLowerCase().split(' ').filter(word => word.length > 3)
    const relevantTags = freeTagDatabase.filter(tag => 
      keywords.some(keyword => tag.includes(keyword) || keyword.includes(tag))
    )
    const randomTags = freeTagDatabase
      .filter(tag => !relevantTags.includes(tag))
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.max(0, freeCount - relevantTags.length))
    
    setFreeTags([...relevantTags.slice(0, freeCount), ...randomTags])
  }

  const generatePremiumTags = async () => {
    setIsGenerating(true)
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPremiumTags([
      '#aioptimized', '#viralcontent', '#trending2024', '#engagementboost', 
      '#algorithmfriendly', '#discovermore', '#contentstrategy', '#socialgrowth',
      '#viralmarketing', '#digitalcreator', '#influencerlife', '#contenttips'
    ].slice(0, premiumCount))
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Tag Generator</h2>
        <p className="text-gray-300">Generate optimized tags for your content</p>
      </div>

      {/* Input Section */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Content Description</CardTitle>
          <CardDescription className="text-gray-400">
            Describe your content to generate relevant tags
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your video, image, or content..."
            className="w-full h-32 bg-black border border-green-500/50 rounded-lg p-3 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none"
          />
        </CardContent>
      </Card>

      {/* Premium Tag Generator */}
      <Card className="bg-black border-yellow-500/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-yellow-400" />
            <CardTitle className="text-yellow-400">AI Tag Generator (Premium)</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            AI-powered tag generation with real-time trend analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label className="text-yellow-400">Number of tags:</Label>
            <select
              value={premiumCount}
              onChange={(e) => setPremiumCount(Number(e.target.value))}
              className="bg-black border border-yellow-500/50 rounded px-3 py-1 text-white"
            >
              <option value={5}>5 tags</option>
              <option value={10}>10 tags</option>
              <option value={15}>15 tags</option>
              <option value={20}>20 tags</option>
            </select>
          </div>
          
          <Button
            onClick={generatePremiumTags}
            disabled={!content.trim() || isGenerating}
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-black"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating AI Tags...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Generate AI Tags (Premium)
              </>
            )}
          </Button>

          {premiumTags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-yellow-400">Generated Tags:</Label>
              <div className="flex flex-wrap gap-2">
                {premiumTags.map((tag, index) => (
                  <Badge key={index} className="bg-yellow-600/20 text-yellow-400 border-yellow-500">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3">
            <p className="text-yellow-400 text-sm">
              Premium features include real-time trend analysis, platform-specific optimization, and AI-powered relevance scoring.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Free Tag Generator */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Free Tag Generator</CardTitle>
          <CardDescription className="text-gray-400">
            Basic tag generation using our curated database (updated monthly)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label className="text-green-400">Number of tags:</Label>
            <select
              value={freeCount}
              onChange={(e) => setFreeCount(Number(e.target.value))}
              className="bg-black border border-green-500/50 rounded px-3 py-1 text-white"
            >
              <option value={3}>3 tags</option>
              <option value={5}>5 tags</option>
              <option value={8}>8 tags</option>
              <option value={10}>10 tags</option>
            </select>
          </div>
          
          <Button
            onClick={generateFreeTags}
            disabled={!content.trim()}
            className="w-full bg-green-600 hover:bg-green-500 text-black"
          >
            <Hash className="w-4 h-4 mr-2" />
            Generate Free Tags
          </Button>

          {freeTags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-green-400">Generated Tags:</Label>
              <div className="flex flex-wrap gap-2">
                {freeTags.map((tag, index) => (
                  <Badge key={index} className="bg-green-600/20 text-green-400 border-green-500">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3">
            <p className="text-green-400 text-sm">
              Free tag database updated monthly with trending hashtags and high-performing tags across platforms.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Content Analysis Component
function ContentAnalysis() {
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([])
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [analyzedContent, setAnalyzedContent] = useState<any[]>([])

  const platforms = [
    { name: 'YouTube', icon: '🎥', color: 'border-red-500' },
    { name: 'TikTok', icon: '🎵', color: 'border-black' },
    { name: 'Instagram', icon: '📷', color: 'border-pink-500' },
    { name: 'Facebook', icon: '👥', color: 'border-blue-600' },
    { name: 'KICK', icon: '🎮', color: 'border-green-500' },
    { name: 'Twitch', icon: '📺', color: 'border-purple-500' }
  ]

  const handleConnect = async (platform: string) => {
    setIsConnecting(platform)
    // Simulate OAuth connection
    await new Promise(resolve => setTimeout(resolve, 2000))
    setConnectedPlatforms(prev => [...prev, platform])
    setIsConnecting(null)
  }

  const handleAnalyze = async () => {
    // Simulate content analysis
    const mockContent = [
      {
        id: '1',
        platform: 'YouTube',
        title: 'Amazing Gaming Moment!',
        thumbnail: 'https://via.placeholder.com/300x200',
        description: 'Check out this incredible play...',
        stats: { views: '10K', likes: '500', comments: '50' },
        analysis: {
          score: 85,
          strengths: ['Good hook', 'Engaging content'],
          improvements: ['Better thumbnail', 'Optimize title']
        }
      }
    ]
    setAnalyzedContent(mockContent)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Content Analysis</h2>
        <p className="text-gray-300">Multi-platform content performance analysis and optimization</p>
      </div>

      {/* Platform Connections */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Connect Your Platforms</CardTitle>
          <CardDescription className="text-gray-400">
            Connect your social media accounts to analyze your content performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {platforms.map((platform) => (
              <div key={platform.name} className="text-center">
                <div className={`text-3xl p-3 rounded-lg border ${platform.color} ${
                  connectedPlatforms.includes(platform.name) 
                    ? 'bg-green-900/30' 
                    : 'bg-black'
                }`}>
                  {platform.icon}
                </div>
                <p className="text-sm text-gray-400 mt-2">{platform.name}</p>
                {connectedPlatforms.includes(platform.name) ? (
                  <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1" />
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleConnect(platform.name)}
                    disabled={isConnecting === platform.name}
                    className="mt-2 bg-green-600 hover:bg-green-500 text-black text-xs"
                  >
                    {isConnecting === platform.name ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      {connectedPlatforms.length > 0 && (
        <Card className="bg-black border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400">Analyze Recent Content</CardTitle>
            <CardDescription className="text-gray-400">
              Analyze your last 7 days of content (up to 3 posts per platform)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleAnalyze}
              className="w-full bg-green-600 hover:bg-green-500 text-black"
            >
              <Search className="w-4 h-4 mr-2" />
              Analyze My Content
            </Button>

            {analyzedContent.length > 0 && (
              <div className="space-y-4">
                {analyzedContent.map((content) => (
                  <div key={content.id} className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                    <div className="flex gap-4">
                      <img 
                        src={content.thumbnail} 
                        alt={content.title}
                        className="w-32 h-24 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-green-400 font-semibold">{content.title}</h3>
                          <Badge className="bg-green-600/20 text-green-400 border-green-500">
                            Score: {content.analysis.score}/100
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm">{content.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-400"><Eye className="w-4 h-4 inline mr-1" />{content.stats.views}</span>
                          <span className="text-gray-400"><Heart className="w-4 h-4 inline mr-1" />{content.stats.likes}</span>
                          <span className="text-gray-400"><MessageSquare className="w-4 h-4 inline mr-1" />{content.stats.comments}</span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-green-400 text-sm">Strengths:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {content.analysis.strengths.map((strength: string, idx: number) => (
                                <Badge key={idx} className="bg-green-600/20 text-green-400 text-xs">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-yellow-400 text-sm">Improvements:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {content.analysis.improvements.map((improvement: string, idx: number) => (
                                <Badge key={idx} className="bg-yellow-600/20 text-yellow-400 text-xs">
                                  {improvement}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Legal Component
function Legal() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Legal Information</h2>
        <p className="text-gray-300">Terms of Service and Privacy Policy</p>
      </div>

      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black border-green-500/50">
          <TabsTrigger value="terms" className="text-white hover:bg-green-900 hover:text-green-400 data-[state=active]:bg-green-800 data-[state=active]:text-green-300">
            Terms of Service
          </TabsTrigger>
          <TabsTrigger value="privacy" className="text-white hover:bg-green-900 hover:text-green-400 data-[state=active]:bg-green-800 data-[state=active]:text-green-300">
            Privacy Policy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="mt-6">
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Terms of Service</CardTitle>
              <CardDescription className="text-gray-400">
                Last updated: March 23, 2024 | <a href="/terms" className="text-green-400 hover:underline">View Full Terms</a>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-green-300 font-semibold mb-2">1. Acceptance of Terms</h3>
                <p className="text-gray-300 text-sm">
                  By accessing and using SDHQ Content Analyzer, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">2. Use License</h3>
                <p className="text-gray-300 text-sm">
                  Permission is granted to temporarily download one copy of the materials on SDHQ Content Analyzer for personal, non-commercial transitory viewing only.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">3. Disclaimer</h3>
                <p className="text-gray-300 text-sm">
                  The materials on SDHQ Content Analyzer are provided on an 'as is' basis. SDHQ Content Analyzer makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">4. Limitations</h3>
                <p className="text-gray-300 text-sm">
                  In no event shall SDHQ Content Analyzer or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">5. Privacy Policy</h3>
                <p className="text-gray-300 text-sm">
                  Your Privacy Policy can be found in the adjacent tab or at <a href="/privacy" className="text-green-400 hover:underline">https://sdhq-content-analyzer.vercel.app/privacy</a>. By using SDHQ Content Analyzer, you consent to the collection and use of information in accordance with our Privacy Policy.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">6. Revisions and Errata</h3>
                <p className="text-gray-300 text-sm">
                  The materials appearing on SDHQ Content Analyzer could include technical, typographical, or photographic errors. We do not promise that any of the materials on its website are accurate, complete, or current.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">7. Contact Information</h3>
                <p className="text-gray-300 text-sm">
                  Questions about the Terms of Service should be sent to support@sdhq.com or visit <a href="/contact" className="text-green-400 hover:underline">https://sdhq-content-analyzer.vercel.app/contact</a>.
                </p>
              </div>
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 mt-4">
                <p className="text-green-400 text-sm font-semibold mb-2">TikTok API Compliance:</p>
                <p className="text-gray-300 text-sm">
                  This Terms of Service is compliant with TikTok's API requirements and can be verified through their platform review process. All terms are clearly stated and accessible via permanent URLs.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Privacy Policy</CardTitle>
              <CardDescription className="text-gray-400">
                Last updated: March 23, 2024 | <a href="/privacy" className="text-green-400 hover:underline">View Full Policy</a>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-green-300 font-semibold mb-2">1. Information We Collect</h3>
                <p className="text-gray-300 text-sm">
                  We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">2. How We Use Your Information</h3>
                <p className="text-gray-300 text-sm">
                  We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">3. Information Sharing</h3>
                <p className="text-gray-300 text-sm">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">4. Data Security</h3>
                <p className="text-gray-300 text-sm">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">5. Data Retention</h3>
                <p className="text-gray-300 text-sm">
                  We retain your personal information for as long as necessary to provide the services and fulfill the purposes outlined in this Privacy Policy.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">6. Your Rights</h3>
                <p className="text-gray-300 text-sm">
                  You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">7. Changes to This Policy</h3>
                <p className="text-gray-300 text-sm">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and at <a href="/privacy" className="text-green-400 hover:underline">https://sdhq-content-analyzer.vercel.app/privacy</a>.
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">8. Contact Information</h3>
                <p className="text-gray-300 text-sm">
                  If you have any questions about this Privacy Policy, please contact us at privacy@sdhq.com or visit <a href="/privacy-contact" className="text-green-400 hover:underline">https://sdhq-content-analyzer.vercel.app/privacy-contact</a>.
                </p>
              </div>
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 mt-4">
                <p className="text-green-400 text-sm font-semibold mb-2">TikTok API Compliance:</p>
                <p className="text-gray-300 text-sm">
                  This Privacy Policy is fully compliant with TikTok's API requirements and data protection standards. All privacy practices are transparent and accessible via permanent URLs for API verification.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Premium Component
function Premium() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Premium Features</h2>
        <p className="text-gray-300">Unlock the full power of SDHQ Content Analyzer</p>
      </div>

      <Card className="bg-black border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-yellow-400">Premium Subscription</CardTitle>
          <CardDescription className="text-gray-400">
            Get unlimited access to all premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">$9.99<span className="text-lg text-gray-400">/month</span></div>
            <p className="text-gray-300">Cancel anytime</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Unlimited AI-powered clip analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Advanced AI tag generation</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Multi-platform content analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Real-time algorithm updates</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Priority support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Export reports and analytics</span>
            </div>
          </div>

          <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-black text-lg py-3">
            <Star className="w-5 h-5 mr-2" />
            Upgrade to Premium
          </Button>

          <div className="text-center text-gray-400 text-sm">
            <p>30-day money-back guarantee</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
