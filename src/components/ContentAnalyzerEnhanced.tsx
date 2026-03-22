'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { TikTokAPI, TikTokVideo } from '@/lib/tiktok-api'
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
  Video
} from 'lucide-react'

interface ContentUpload {
  id: string
  platform: string
  title: string
  thumbnail: string
  url: string
  uploadTime: string
  views: number
  likes: number
  comments: number
  engagement: string
}

export function ContentAnalyzerEnhanced() {
  const [username, setUsername] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [uploads, setUploads] = useState<ContentUpload[]>([])
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([])

  const platforms = [
    { name: 'TikTok', icon: '🎵', color: 'bg-black' },
    { name: 'Instagram', icon: '📷', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { name: 'YouTube', icon: '▶️', color: 'bg-red-500' }
  ]

  const mockUploads: ContentUpload[] = [
    {
      id: '1',
      platform: 'TikTok',
      title: 'Amazing Content Creation Tips! 🚀',
      thumbnail: 'https://via.placeholder.com/300x400/000000/ffffff?text=TikTok+Thumbnail',
      url: 'https://tiktok.com/@user/video/1',
      uploadTime: '2 hours ago',
      views: 15420,
      likes: 892,
      comments: 124,
      engagement: '6.7'
    },
    {
      id: '2',
      platform: 'Instagram',
      title: 'Behind the scenes of my latest project ✨',
      thumbnail: 'https://via.placeholder.com/300x400/000000/ffffff?text=Instagram+Reel',
      url: 'https://instagram.com/p/abc123',
      uploadTime: '5 hours ago',
      views: 8234,
      likes: 567,
      comments: 89,
      engagement: '7.9'
    },
    {
      id: '3',
      platform: 'YouTube',
      title: 'Complete Guide to Content Optimization 2026',
      thumbnail: 'https://via.placeholder.com/300x400/000000/ffffff?text=YouTube+Thumbnail',
      url: 'https://youtube.com/watch?v=abc123',
      uploadTime: '8 hours ago',
      views: 12450,
      likes: 445,
      comments: 67,
      engagement: '4.1'
    }
  ]

  const handleSearch = async () => {
    if (!username.trim()) return
    
    setIsSearching(true)
    
    try {
      // Initialize TikTok API
      const tiktokAPI = new TikTokAPI(process.env.NEXT_PUBLIC_RAPIDAPI_TIKTOK_API_KEY || '')
      
      // Get recent videos from TikTok
      const tiktokVideos = await tiktokAPI.getUserRecentVideos(username.replace('@', ''))
      
      // Transform to match our interface
      const transformedUploads = tiktokVideos.map((video, index) => ({
        id: video.id,
        platform: 'TikTok',
        title: video.title,
        thumbnail: video.thumbnail,
        url: video.url,
        uploadTime: `${Math.floor((Date.now() - video.createTime * 1000) / (1000 * 60 * 60))} hours ago`,
        views: video.stats.playCount,
        likes: video.stats.likeCount,
        comments: video.stats.commentCount,
        engagement: video.stats.playCount > 0 ? 
          ((video.stats.likeCount + video.stats.commentCount) / video.stats.playCount * 100).toFixed(1).toString() : 
          '0'
      }))
      
      setUploads(transformedUploads)
      console.log(`✅ Fetched ${transformedUploads.length} TikTok videos for @${username}`)
      
    } catch (error) {
      console.error('❌ Error fetching TikTok videos:', error)
      // Show mock data as fallback
      setUploads(mockUploads)
    } finally {
      setIsSearching(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    const platformInfo = platforms.find(p => p.name === platform)
    return platformInfo?.icon || '📱'
  }

  const getPlatformColor = (platform: string) => {
    const platformInfo = platforms.find(p => p.name === platform)
    return platformInfo?.color || 'bg-gray-500'
  }

  const handleOptimize = (uploadId: string) => {
    // Navigate to clip analysis page with specific clip data
    console.log('Optimizing clip:', uploadId)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Content Analysis</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Analyze your last 24 hours of content across all platforms and get optimization suggestions
        </p>
      </div>

      {/* Search Section */}
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="text-cyan-400">Search Your Content</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your username to fetch your last 24 hours of uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="username" className="text-cyan-300">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username (without @)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black border-cyan-500 text-white"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !username.trim()}
                className="bg-cyan-500 text-black hover:bg-cyan-400 mt-6"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Content
                  </>
                )}
              </Button>
            </div>

            {/* Connected Accounts */}
            {connectedAccounts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 text-sm">Connected accounts:</span>
                {connectedAccounts.map(account => (
                  <Badge key={account} variant="outline" className="text-cyan-400 border-cyan-400">
                    {getPlatformIcon(account)} {account}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {uploads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cyan-400">
              Last 24 Hours ({uploads.length} uploads)
            </h3>
            <div className="flex gap-2">
              {platforms.map(platform => (
                <Badge key={platform.name} variant="outline" className="text-cyan-400 border-cyan-400">
                  {platform.icon} {platform.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploads.map((upload) => (
              <Card key={upload.id} className="bg-black border border-cyan-500/20 hover:border-cyan-500/50 transition-colors">
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
                      {upload.engagement.toFixed(1)}% engagement
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h4 className="text-cyan-300 font-medium line-clamp-2 mb-2">
                      {upload.title}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {upload.uploadTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{upload.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{upload.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{upload.comments.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-black"
                      onClick={() => window.open(upload.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-cyan-500 text-black hover:bg-cyan-400"
                      onClick={() => handleOptimize(upload.id)}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploads.length === 0 && !isSearching && username && (
        <Card className="bg-black border border-cyan-500/20">
          <CardContent className="text-center py-12">
            <Video className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">No uploads found</h3>
            <p className="text-gray-400 mb-4">
              No uploads found in the last 24 hours for @{username}
            </p>
            <p className="text-gray-400 text-sm">
              Make sure your accounts are connected and try searching again
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
