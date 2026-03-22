'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { TikTokAPI, TikTokVideo } from '@/lib/tiktok-api'
import { YouTubeOAuth } from '@/lib/youtube-oauth'
import { 
  Search, 
  ExternalLink, 
  Play, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle,
  TrendingUp,
  Zap,
  Video,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface ContentUpload {
  id: string
  platform: string
  title: string
  description: string
  thumbnail: string
  url: string
  uploadTime: string
  views: number
  likes: number
  comments: number
  shares: number
  tags: string[]
  engagement: string
  analysis?: {
    score: number
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }
}

export function ContentAnalyzerEnhanced() {
  const [username, setUsername] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [uploads, setUploads] = useState<ContentUpload[]>([])
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedClip, setSelectedClip] = useState<string | null>(null)

  const platforms = [
    { name: 'TikTok', icon: '🎵', color: 'bg-black' },
    { name: 'Instagram', icon: '📷', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { name: 'YouTube', icon: '▶️', color: 'bg-red-500' }
  ]

  // Check for connected accounts on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const connected = []
      if (localStorage.getItem('instagram_auth_code')) connected.push('Instagram')
      if (localStorage.getItem('youtube_auth_code')) connected.push('YouTube')
      // TikTok uses RapidAPI, so it's always available
      connected.push('TikTok')
      
      setConnectedAccounts(connected)
      
      // Auto-populate if we have connected accounts
      if (connected.length > 0) {
        fetchConnectedContent()
      }
    }
  }, [])

  const fetchConnectedContent = async () => {
    setIsSearching(true)
    console.log('🔍 Fetching content from connected accounts...')
    
    const allContent: ContentUpload[] = []
    
    try {
      // Fetch from TikTok (always available via RapidAPI)
      if (connectedAccounts.includes('TikTok')) {
        try {
          const tiktokAPI = new TikTokAPI(process.env.NEXT_PUBLIC_RAPIDAPI_TIKTOK_API_KEY || '')
          
          // Get trending content since we don't have a specific username
          const trendingVideos = await tiktokAPI.searchVideos('trending', 10)
          
          const tiktokContent = trendingVideos.map((video, index) => ({
            id: video.id,
            platform: 'TikTok',
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            url: video.url,
            uploadTime: `${Math.floor((Date.now() - video.createTime * 1000) / (1000 * 60 * 60))} hours ago`,
            views: video.stats.playCount,
            likes: video.stats.likeCount,
            comments: video.stats.commentCount,
            shares: video.stats.shareCount || 0,
            tags: extractTags(video.description),
            engagement: video.stats.playCount > 0 ? 
              ((video.stats.likeCount + video.stats.commentCount) / video.stats.playCount * 100).toFixed(1).toString() : 
              '0'
          }))
          
          allContent.push(...tiktokContent)
          console.log(`✅ Fetched ${tiktokContent.length} TikTok videos`)
        } catch (error) {
          console.error('❌ Error fetching TikTok content:', error)
        }
      }
      
      // Fetch from Instagram (if connected)
      if (connectedAccounts.includes('Instagram')) {
        try {
          // Simulate Instagram content fetch (would use Instagram API)
          const instagramContent = generateMockInstagramContent()
          allContent.push(...instagramContent)
          console.log(`✅ Fetched ${instagramContent.length} Instagram posts`)
        } catch (error) {
          console.error('❌ Error fetching Instagram content:', error)
        }
      }
      
      // Fetch from YouTube (if connected)
      if (connectedAccounts.includes('YouTube')) {
        try {
          // Simulate YouTube content fetch (would use YouTube API)
          const youtubeContent = generateMockYouTubeContent()
          allContent.push(...youtubeContent)
          console.log(`✅ Fetched ${youtubeContent.length} YouTube videos`)
        } catch (error) {
          console.error('❌ Error fetching YouTube content:', error)
        }
      }
      
      // Sort by upload time (most recent first)
      allContent.sort((a, b) => {
        const timeA = parseInt(a.uploadTime) || 0
        const timeB = parseInt(b.uploadTime) || 0
        return timeA - timeB
      })
      
      // Analyze all content
      const analyzedContent = allContent.map(item => ({
        ...item,
        analysis: analyzeContent(item)
      }))
      
      setUploads(analyzedContent)
      console.log(`✅ Total content fetched and analyzed: ${analyzedContent.length} items`)
      
    } catch (error) {
      console.error('❌ Error fetching connected content:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const extractTags = (description: string): string[] => {
    const hashtags = description.match(/#\w+/g) || []
    const mentions = description.match(/@\w+/g) || []
    return [...hashtags, ...mentions].slice(0, 5)
  }

  const analyzeContent = (content: ContentUpload) => {
    const engagementRate = parseFloat(content.engagement) || 0
    const views = content.views
    const likes = content.likes
    const comments = content.comments
    const shares = content.shares
    
    let score = 50 // Base score
    const strengths: string[] = []
    const improvements: string[] = []
    const recommendations: string[] = []
    
    // Scoring logic
    if (engagementRate > 5) {
      score += 20
      strengths.push('High engagement rate')
    } else if (engagementRate < 2) {
      score -= 15
      improvements.push('Low engagement rate')
      recommendations.push('Add more engaging hooks in first 3 seconds')
    }
    
    if (views > 10000) {
      score += 15
      strengths.push('Good reach')
    } else if (views < 1000) {
      score -= 10
      improvements.push('Low view count')
      recommendations.push('Optimize posting time and use trending sounds')
    }
    
    if (likes > views * 0.05) {
      score += 10
      strengths.push('Strong like-to-view ratio')
    }
    
    if (comments > views * 0.01) {
      score += 10
      strengths.push('Good comment engagement')
      recommendations.push('Create more content that encourages discussion')
    }
    
    if (shares > 100) {
      score += 15
      strengths.push('High shareability')
    }
    
    // Platform-specific recommendations
    if (content.platform === 'TikTok') {
      if (content.title.length < 50) {
        strengths.push('Concise title')
      }
      if (content.tags.length > 0) {
        strengths.push('Using hashtags')
      } else {
        recommendations.push('Add relevant hashtags to increase discoverability')
      }
    }
    
    if (content.platform === 'Instagram') {
      if (content.description.length > 100) {
        strengths.push('Detailed description')
      }
      recommendations.push('Use Instagram Stories to promote this content')
    }
    
    if (content.platform === 'YouTube') {
      if (content.title.length > 50) {
        strengths.push('Descriptive title for SEO')
      }
      recommendations.push('Create a custom thumbnail to increase CTR')
    }
    
    // Normalize score
    score = Math.max(0, Math.min(100, score))
    
    return {
      score,
      strengths,
      improvements,
      recommendations
    }
  }

  const generateMockInstagramContent = (): ContentUpload[] => {
    return [
      {
        id: 'ig_1',
        platform: 'Instagram',
        title: 'Behind the scenes of my latest project ✨',
        description: 'Working on something amazing! #behindthescenes #contentcreator #wip #creative #process',
        thumbnail: 'https://via.placeholder.com/300x400/pink/ffffff?text=Instagram+Reel',
        url: 'https://instagram.com/p/abc123',
        uploadTime: '2 hours ago',
        views: 8234,
        likes: 567,
        comments: 89,
        shares: 23,
        tags: ['#behindthescenes', '#contentcreator', '#wip', '#creative', '#process'],
        engagement: '7.9'
      },
      {
        id: 'ig_2',
        platform: 'Instagram',
        title: 'Day in the life of a content creator 📹',
        description: 'Follow me through a typical day! #dayinmylife #creatorlife #routine #productivity',
        thumbnail: 'https://via.placeholder.com/300x400/purple/ffffff?text=Instagram+Story',
        url: 'https://instagram.com/p/def456',
        uploadTime: '5 hours ago',
        views: 6780,
        likes: 423,
        comments: 56,
        shares: 18,
        tags: ['#dayinmylife', '#creatorlife', '#routine', '#productivity'],
        engagement: '7.1'
      }
    ]
  }

  const generateMockYouTubeContent = (): ContentUpload[] => {
    return [
      {
        id: 'yt_1',
        platform: 'YouTube',
        title: 'Complete Guide to Content Optimization 2026',
        description: 'Learn the latest strategies for optimizing your content across all platforms. #contentoptimization #strategy #2026',
        thumbnail: 'https://via.placeholder.com/300x400/red/ffffff?text=YouTube+Thumbnail',
        url: 'https://youtube.com/watch?v=ghi789',
        uploadTime: '3 hours ago',
        views: 12450,
        likes: 445,
        comments: 67,
        shares: 34,
        tags: ['#contentoptimization', '#strategy', '#2026'],
        engagement: '4.1'
      },
      {
        id: 'yt_2',
        platform: 'YouTube',
        title: 'How I Grew to 10K Followers in 30 Days',
        description: 'My exact strategy for rapid social media growth. #growthstrategy #socialmedia #tips',
        thumbnail: 'https://via.placeholder.com/300x400/blue/ffffff?text=YouTube+Shorts',
        url: 'https://youtube.com/watch?v=jkl012',
        uploadTime: '8 hours ago',
        views: 8920,
        likes: 312,
        comments: 45,
        shares: 28,
        tags: ['#growthstrategy', '#socialmedia', '#tips'],
        engagement: '4.0'
      }
    ]
  }

  const handleClipClick = (clipId: string) => {
    setSelectedClip(clipId)
    const clip = uploads.find(u => u.id === clipId)
    if (clip) {
      console.log(`🎯 Opening clip analysis for: ${clip.title}`)
      // In a real app, this would navigate to the clip analysis page
      // window.location.href = `/clip-analysis?id=${clipId}`
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPlatformIcon = (platform: string) => {
    const platformInfo = platforms.find(p => p.name === platform)
    return platformInfo?.icon || '📱'
  }

  const getPlatformColor = (platform: string) => {
    const platformInfo = platforms.find(p => p.name === platform)
    return platformInfo?.color || 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Content Analysis</h2>
        <p className="text-cyan-300">
          Automatically analyzing your content from connected platforms
        </p>
      </div>

      {/* Connected Accounts Status */}
      <Card className="bg-black border border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {connectedAccounts.length > 0 ? (
              connectedAccounts.map((account, index) => (
                <Badge key={index} className="bg-green-500/20 text-green-400 border-green-400">
                  {account}
                </Badge>
              ))
            ) : (
              <p className="text-gray-400">No accounts connected. Go to Connections tab to link your social media.</p>
            )}
          </div>
          {connectedAccounts.length > 0 && (
            <Button
              onClick={fetchConnectedContent}
              disabled={isSearching}
              className="mt-4 bg-cyan-600 hover:bg-cyan-700"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Content
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Content Grid */}
      {uploads.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {uploads.map((upload, index) => (
            <Card 
              key={index} 
              className="bg-black border border-cyan-500 hover:border-cyan-400 transition-all cursor-pointer transform hover:scale-105"
              onClick={() => handleClipClick(upload.id)}
            >
              <CardHeader className="p-4">
                <div className="relative">
                  <img 
                    src={upload.thumbnail} 
                    alt={upload.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(upload.platform)} bg-opacity-80 text-white`}>
                    {getPlatformIcon(upload.platform)} {upload.platform}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400 text-xs">
                      {upload.engagement}% engagement
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h4 className="text-cyan-300 font-medium line-clamp-2 mb-2">
                    {upload.title}
                  </h4>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                    {upload.description}
                  </p>
                  {upload.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {upload.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs text-gray-400 border-gray-400">
                          {tag}
                        </Badge>
                      ))}
                      {upload.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs text-gray-400 border-gray-400">
                          +{upload.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Clock className="w-3 h-3" />
                  {upload.uploadTime}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {upload.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {upload.likes.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {upload.comments}
                  </div>
                </div>

                {/* Analysis Results */}
                {upload.analysis && (
                  <div className="border-t border-cyan-500/20 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-300 text-sm font-medium">Analysis Score</span>
                      <span className={`text-sm font-bold ${getScoreColor(upload.analysis.score)}`}>
                        {upload.analysis.score}/100
                      </span>
                    </div>
                    
                    {upload.analysis.strengths.length > 0 && (
                      <div className="mb-2">
                        <span className="text-green-400 text-xs">✓ {upload.analysis.strengths[0]}</span>
                      </div>
                    )}
                    
                    {upload.analysis.recommendations.length > 0 && (
                      <div>
                        <span className="text-yellow-400 text-xs">💡 {upload.analysis.recommendations[0]}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClipClick(upload.id)
                  }}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Analyze Clip
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Content State */}
      {uploads.length === 0 && !isSearching && (
        <Card className="bg-black border border-cyan-500/20">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">No Content Found</h3>
            <p className="text-cyan-300 mb-6">
              {connectedAccounts.length > 0 
                ? "Click 'Refresh Content' to analyze your latest uploads"
                : "Connect your social media accounts to analyze your content"
              }
            </p>
            {connectedAccounts.length === 0 && (
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
                Go to Connections
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
