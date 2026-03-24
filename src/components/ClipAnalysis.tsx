'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
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
  Link,
  Zap
} from 'lucide-react'
import { AlgorithmUpdater } from '@/lib/algorithm-updater'
import SubscribersManager from '@/lib/subscribers'
import TikTokMetadataService from '@/lib/tiktok-metadata'
import YouTubeMetadataService, { YouTubeMetadata } from '@/lib/youtube-metadata'

interface AnalysisResult {
  clipTitle: string
  titleSuggestions: string[]
  clipDescription: string
  descriptionSuggestions: string[]
  tags: string[]
  tagSuggestions: string[]
  editingTips: string[]
  algorithmInsights: string[]
  algorithmResearch: string
  trendingOpportunities: string
  engagementTriggers: string[]
  performancePrediction: string
  gameAnalysis?: {
    gameName: string
    gameGenre: string
    gamingPlatform: string
    streamingPlatform: string
    contentFocus: string
  }
  aiAnalysis?: {
    metadataUsed: boolean
    deepSeekUsed: boolean
    geminiUsed: boolean
    totalInsights: number
    totalTagSuggestions: number
  }
  researchTimestamp?: Date
  tiktokStats?: {
    viewCount: number
    likeCount: number
    commentCount: number
    shareCount: number
    originalAuthor: string
    originalHashtags: string[]
    videoDuration: number
  }
  youtubeStats?: {
    viewCount: number
    likeCount: number
    commentCount: number
    originalAuthor: string
    originalHashtags: string[]
    videoDuration: string
    thumbnail: string
  }
}

export function ClipAnalysis({ user, hasPremium }: { user: any; hasPremium: boolean }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('youtube shorts')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [inputMode, setInputMode] = useState<'file' | 'url'>('file')
  const [loadingMessage, setLoadingMessage] = useState<string>('')

  // Funny loading messages sequence
  const loadingMessages = [
    "Locating the best beef...",
    "Beef acquired! 🥩",
    "Obtaining burger bun...",
    "Bun secured! 🍔",
    "Locating vegetables...",
    "Veggies found! 🥬",
    "Completing cheeseburger...",
    "Cheeseburger ready! 🧀",
    "Adding secret sauce...",
    "Sauce applied! 🍟",
    "Final touches...",
    "Almost done! 🍔"
  ]

  // Update loading message every 2 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout
    let messageIndex = 0

    if (isAnalyzing) {
      setLoadingMessage(loadingMessages[0])
      interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length
        setLoadingMessage(loadingMessages[messageIndex])
      }, 2000)
    } else {
      setLoadingMessage('')
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAnalyzing])

  const platforms = [
    { value: 'youtube shorts', label: 'YouTube Shorts', icon: '⚡' },
    { value: 'youtube long', label: 'YouTube Long', icon: '📹' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'facebook reels', label: 'Facebook Reels', icon: '👥' }
  ]

  // Check premium access and subscriber access
  const subscribersManager = SubscribersManager.getInstance()
  const canAccessAnalysis = hasPremium || (user && subscribersManager.isSubscriber(user.username))

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setVideoUrl('')
      setAnalysisResult(null)
    }
  }

  const analyzeWithDeepSeek = async (currentTitle: string, currentDescription: string, currentTags: string[], platform: string) => {
    const deepseekPrompt = `You are a senior social media algorithm researcher with expertise in 2026 platform best practices. Analyze this content for ${platform} optimization.

CURRENT CONTENT TO ANALYZE:
Title: "${currentTitle}"
Description: "${currentDescription}"
Tags: ${currentTags.join(', ')}

TARGET PLATFORM: ${platform}

TASK: Cross-reference this content with researched best practices for ${platform} and provide optimization recommendations.

Provide detailed optimization recommendations in JSON format:
{
  "titleSuggestions": ["Optimized title 1", "Optimized title 2", "Optimized title 3"],
  "descriptionSuggestions": ["Enhanced description 1", "Enhanced description 2"],
  "tagSuggestions": ["algorithm_tag_1", "platform_tag_1", "trending_tag_1", "complementary_tag_1"],
  "editingTips": ["Specific editing tip for this content", "Optimization for this platform", "Engagement improvement suggestion"],
  "algorithmInsights": ["Platform-specific algorithm insight 1", "Algorithm insight 2"],
  "algorithmResearch": "Detailed analysis of current ${platform} algorithm factors and how this content aligns",
  "trendingOpportunities": "Current trending topics that align with this specific content",
  "engagementTriggers": ["Psychological trigger 1", "Psychological trigger 2", "Psychological trigger 3"],
  "performancePrediction": "Predicted performance based on algorithm alignment and content analysis",
  "gameAnalysis": {
    "gameName": "Extract from content if available",
    "gameGenre": "Infer from content",
    "gamingPlatform": "Infer from context",
    "streamingPlatform": "Infer from content",
    "contentFocus": "gameplay, highlights, tutorial, etc."
  }
}

IMPORTANT: Focus on optimizing the provided content for ${platform} algorithm success. Use current 2026 best practices and trends.`

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || 'sk-670a1aa1928848fdaec6e9ce4aff2ee6'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert video content analyst. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: deepseekPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('DeepSeek API Error:', response.status, errorData)
      throw new Error(`DeepSeek API request failed: ${response.status}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content
    console.log('DeepSeek Response:', analysisText)
    
    // Parse the JSON response
    try {
      const parsed = JSON.parse(analysisText)
      
      // Ensure all required fields are present
      return {
        clipTitle: parsed.clipTitle || 'Untitled Video',
        titleSuggestions: Array.isArray(parsed.titleSuggestions) ? parsed.titleSuggestions : [],
        clipDescription: parsed.clipDescription || 'No description available',
        descriptionSuggestions: Array.isArray(parsed.descriptionSuggestions) ? parsed.descriptionSuggestions : [],
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        tagSuggestions: Array.isArray(parsed.tagSuggestions) ? parsed.tagSuggestions : [],
        editingTips: Array.isArray(parsed.editingTips) ? parsed.editingTips : [],
        algorithmInsights: Array.isArray(parsed.algorithmInsights) ? parsed.algorithmInsights : [],
        algorithmResearch: parsed.algorithmResearch || '',
        trendingOpportunities: parsed.trendingOpportunities || '',
        engagementTriggers: Array.isArray(parsed.engagementTriggers) ? parsed.engagementTriggers : [],
        performancePrediction: parsed.performancePrediction || '',
        gameAnalysis: parsed.gameAnalysis || {
          gameName: 'Unknown Game',
          gameGenre: 'Unknown',
          gamingPlatform: 'Unknown',
          streamingPlatform: 'Unknown',
          contentFocus: 'Unknown'
        },
        // Add aiAnalysis for compatibility with multi-AI system
        aiAnalysis: {
          deepSeekUsed: true,
          openaiUsed: false,
          geminiUsed: false,
          totalInsights: Array.isArray(parsed.algorithmInsights) ? parsed.algorithmInsights.length : 0
        }
      }
    } catch (parseError) {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          clipTitle: parsed.clipTitle || 'Untitled Video',
          titleSuggestions: Array.isArray(parsed.titleSuggestions) ? parsed.titleSuggestions : [],
          clipDescription: parsed.clipDescription || 'No description available',
          descriptionSuggestions: Array.isArray(parsed.descriptionSuggestions) ? parsed.descriptionSuggestions : [],
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          tagSuggestions: Array.isArray(parsed.tagSuggestions) ? parsed.tagSuggestions : [],
          editingTips: Array.isArray(parsed.editingTips) ? parsed.editingTips : [],
          algorithmInsights: Array.isArray(parsed.algorithmInsights) ? parsed.algorithmInsights : [],
          algorithmResearch: parsed.algorithmResearch || '',
          trendingOpportunities: parsed.trendingOpportunities || '',
          engagementTriggers: Array.isArray(parsed.engagementTriggers) ? parsed.engagementTriggers : [],
          performancePrediction: parsed.performancePrediction || '',
          gameAnalysis: parsed.gameAnalysis || {
            gameName: 'Unknown Game',
            gameGenre: 'Unknown',
            gamingPlatform: 'Unknown',
            streamingPlatform: 'Unknown',
            contentFocus: 'Unknown'
          },
          // Add aiAnalysis for compatibility with multi-AI system
          aiAnalysis: {
            deepSeekUsed: true,
            openaiUsed: false,
            geminiUsed: false,
            totalInsights: Array.isArray(parsed.algorithmInsights) ? parsed.algorithmInsights.length : 0
          }
        }
      }
      console.error('Could not parse DeepSeek response:', analysisText)
      return null
    }
  }

  const analyzeWithDeepSeekOnly = async (currentTitle: string, currentDescription: string, currentTags: string[], platform: string) => {
    console.log('🤖 Starting DeepSeek Analysis Flow:')
    console.log('📊 Current Content:', { currentTitle, currentDescription, currentTags, platform })
    
    try {
      // Analyze with DeepSeek using current metadata
      console.log('🧠 DeepSeek analyzing current content...')
      const deepseekAnalysis = await analyzeWithDeepSeek(currentTitle, currentDescription, currentTags, platform)
      
      // Return DeepSeek suggestions
      const combinedResult = {
        titleSuggestions: Array.isArray(deepseekAnalysis?.titleSuggestions) ? deepseekAnalysis.titleSuggestions : [],
        descriptionSuggestions: Array.isArray(deepseekAnalysis?.descriptionSuggestions) ? deepseekAnalysis.descriptionSuggestions : [],
        tagSuggestions: Array.isArray(deepseekAnalysis?.tagSuggestions) ? deepseekAnalysis.tagSuggestions : [],
        editingTips: Array.isArray(deepseekAnalysis?.editingTips) ? deepseekAnalysis.editingTips : [],
        algorithmInsights: Array.isArray(deepseekAnalysis?.algorithmInsights) ? deepseekAnalysis.algorithmInsights : [],
        algorithmResearch: deepseekAnalysis?.algorithmResearch || '',
        trendingOpportunities: deepseekAnalysis?.trendingOpportunities || '',
        engagementTriggers: Array.isArray(deepseekAnalysis?.engagementTriggers) ? deepseekAnalysis.engagementTriggers : [],
        performancePrediction: deepseekAnalysis?.performancePrediction || '',
        gameAnalysis: deepseekAnalysis?.gameAnalysis || {
          gameName: 'Unknown Game',
          gameGenre: 'Unknown',
          gamingPlatform: 'Unknown',
          streamingPlatform: 'Unknown',
          contentFocus: 'Unknown'
        },
        // Add AI Analysis Info
        aiAnalysis: {
          metadataUsed: true,
          deepSeekUsed: !!deepseekAnalysis,
          geminiUsed: false,
          totalInsights: deepseekAnalysis?.algorithmInsights?.length || 0,
          totalTagSuggestions: deepseekAnalysis?.tagSuggestions?.length || 0
        }
      }
      
      console.log('✅ DeepSeek Analysis Complete:', {
        deepSeekUsed: !!deepseekAnalysis,
        totalInsights: combinedResult.algorithmInsights.length,
        totalTagSuggestions: combinedResult.tagSuggestions.length
      })
      
      return combinedResult
    } catch (error) {
      console.error('❌ DeepSeek Analysis failed:', error)
      return null
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile && !videoUrl.trim()) return
    
    if (!canAccessAnalysis) {
      alert('This feature requires a premium subscription or subscriber access. Please upgrade to access Clip Analysis.')
      return
    }
    
    setIsAnalyzing(true)
    
    try {
      let content = ''
      let tiktokMetadata = null
      let youtubeMetadata = null
      
      if (selectedFile) {
        // Extract basic info from file
        content = `File: ${selectedFile.name}, Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
      } else if (videoUrl) {
        // Enhanced content extraction for URLs
        content = `URL: ${videoUrl}`
        
        // Extract platform-specific information from URL
        const urlLower = videoUrl.toLowerCase()
        
        // Extract video ID and platform-specific details
        let videoId = ''
        let platform = 'Unknown'
        let contentType = 'Video'
        
        if (urlLower.includes('tiktok.com') || urlLower.includes('tiktok')) {
          platform = 'TikTok'
          contentType = 'Short-form Video'
          
          // Only try TikTok metadata extraction for actual TikTok URLs
          try {
            const tiktokService = TikTokMetadataService.getInstance()
            tiktokMetadata = await tiktokService.getMetadata(videoUrl)
            
            if (tiktokMetadata) {
              content += `\nPlatform: TikTok\nVideo ID: ${tiktokMetadata.id}\nType: Short-form video\nAnalysis Focus: TikTok algorithm optimization`
              content += `\n\nTIKTOK METADATA:
Title: ${tiktokMetadata.title}
Description: ${tiktokMetadata.description}
Author: ${tiktokMetadata.author.displayName} (@${tiktokMetadata.author.username})
Views: ${tiktokMetadata.stats.views.toLocaleString()}
Likes: ${tiktokMetadata.stats.likes.toLocaleString()}
Comments: ${tiktokMetadata.stats.comments.toLocaleString()}
Shares: ${tiktokMetadata.stats.shares.toLocaleString()}
Duration: ${tiktokMetadata.duration} seconds
Hashtags: ${tiktokMetadata.hashtags.join(', ')}
${tiktokMetadata.music ? `Music: ${tiktokMetadata.music.title} - ${tiktokMetadata.music.author}` : ''}`
            } else {
              // Fallback to URL extraction
              const tiktokMatch = videoUrl.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
              if (tiktokMatch) videoId = tiktokMatch[1]
              content += `\nPlatform: TikTok\nVideo ID: ${videoId}\nType: Short-form video\nAnalysis Focus: TikTok algorithm optimization\nNote: TikTok metadata extraction failed, using URL analysis`
            }
          } catch (error) {
            console.warn('TikTok metadata extraction failed:', error)
            const tiktokMatch = videoUrl.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
            if (tiktokMatch) videoId = tiktokMatch[1]
            content += `\nPlatform: TikTok\nVideo ID: ${videoId}\nType: Short-form video\nAnalysis Focus: TikTok algorithm optimization\nNote: TikTok metadata extraction failed, using URL analysis`
          }
        } else if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
          platform = 'YouTube'
          contentType = videoUrl.includes('shorts') ? 'Short' : 'Long-form Video'
          
          // Try YouTube metadata extraction
          try {
            const youtubeService = YouTubeMetadataService.getInstance()
            youtubeMetadata = await youtubeService.getMetadata(videoUrl)
            
            if (youtubeMetadata) {
              content += `\nPlatform: YouTube\nVideo ID: ${youtubeMetadata.id}\nType: ${contentType}\nAnalysis Focus: YouTube algorithm optimization`
              content += `\n\nYOUTUBE METADATA:
Title: ${youtubeMetadata.title}
Description: ${youtubeMetadata.description}
Author: ${youtubeMetadata.author.displayName} (@${youtubeMetadata.author.username})
Views: ${youtubeMetadata.stats.views.toLocaleString()}
Likes: ${youtubeMetadata.stats.likes.toLocaleString()}
Comments: ${youtubeMetadata.stats.comments.toLocaleString()}
Duration: ${youtubeMetadata.duration}
Hashtags: ${youtubeMetadata.hashtags.join(', ')}
Published: ${new Date(youtubeMetadata.createTime).toLocaleDateString()}
Thumbnail: ${youtubeMetadata.thumbnail}`
            } else {
              // Fallback to URL extraction
              const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/)
              if (youtubeMatch) videoId = youtubeMatch[1]
              content += `\nPlatform: YouTube\nVideo ID: ${videoId}\nType: ${contentType}\nAnalysis Focus: YouTube algorithm optimization\nNote: YouTube metadata extraction failed, using URL analysis`
            }
          } catch (error) {
            console.warn('YouTube metadata extraction failed:', error)
            const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/)
            if (youtubeMatch) videoId = youtubeMatch[1]
            content += `\nPlatform: YouTube\nVideo ID: ${videoId}\nType: ${contentType}\nAnalysis Focus: YouTube algorithm optimization\nNote: YouTube metadata extraction failed, using URL analysis`
          }
        } else if (urlLower.includes('instagram.com')) {
          platform = 'Instagram'
          contentType = 'Reel'
          content += `\nPlatform: Instagram\nType: Reel\nAnalysis Focus: Instagram Reels algorithm optimization`
        } else if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
          platform = 'Twitter/X'
          contentType = 'Video'
          content += `\nPlatform: Twitter/X\nType: Video\nAnalysis Focus: Twitter algorithm optimization`
        } else if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) {
          platform = 'Facebook'
          contentType = 'Reel'
          content += `\nPlatform: Facebook\nType: Reel\nAnalysis Focus: Facebook Reels algorithm optimization`
        } else if (urlLower.includes('twitch.tv')) {
          platform = 'Twitch'
          contentType = 'Clip'
          // Extract Twitch channel and clip info
          const twitchMatch = videoUrl.match(/twitch\.tv\/([\w.-]+)\/clip\/([\w-]+)/)
          if (twitchMatch) {
            content += `\nPlatform: Twitch\nChannel: ${twitchMatch[1]}\nClip ID: ${twitchMatch[2]}\nType: Clip\nAnalysis Focus: Twitch clip optimization`
          } else {
            content += `\nPlatform: Twitch\nType: Clip\nAnalysis Focus: Twitch clip optimization`
          }
        } else {
          platform = 'General'
          content += `\nPlatform: General\nType: Video URL\nAnalysis Focus: ${selectedPlatform} algorithm optimization`
        }
        
        // Add enhanced analysis context
        content += `\n\nENHANCED ANALYSIS CONTEXT:
- Platform: ${platform}
- Content Type: ${contentType}
- Video ID: ${videoId || 'Not extractable'}
- Target Platform: ${selectedPlatform}
- URL Structure: ${new URL(videoUrl).pathname}
- Metadata Available: ${tiktokMetadata || youtubeMetadata ? 'Yes' : 'No'}

CONTENT ANALYSIS REQUIREMENTS:
- Analyze this ${contentType.toLowerCase()} for actual video content
- ${tiktokMetadata ? 'USE THE EXTRACTED TIKTOK METADATA ABOVE' : youtubeMetadata ? 'USE THE EXTRACTED YOUTUBE METADATA ABOVE' : 'Extract any game-related information from the URL structure'}
- Identify the game being played from context clues
- Determine gaming platform (PC, PlayStation, Xbox, Mobile)
- Identify streaming platform from URL patterns
- Generate comprehensive tags for this specific content
- Focus on ${selectedPlatform} algorithm factors
- Create platform-specific optimization strategies

VIDEO METADATA EXTRACTION:
- ${tiktokMetadata ? 'USE REAL TIKTOK DATA: title, description, hashtags, stats' : youtubeMetadata ? 'USE REAL YOUTUBE DATA: title, description, hashtags, stats' : 'Attempt to determine the actual video title from URL patterns'}
- Extract any visible game information from the URL
- Identify content type (gameplay, highlights, tutorial, etc.)
- Analyze for game-specific elements and mechanics
- Generate relevant tags based on extracted information`
      }

      // Extract current metadata
      const currentTitle = youtubeMetadata?.title || tiktokMetadata?.title || 'Untitled Video'
      const currentDescription = youtubeMetadata?.description || tiktokMetadata?.description || 'No description available'
      const currentTags = youtubeMetadata?.hashtags || tiktokMetadata?.hashtags || []
      
      // Display current metadata immediately (before DeepSeek analysis)
      const analysisData = {
        // Display REAL extracted metadata as current content
        clipTitle: currentTitle,
        clipDescription: currentDescription,
        tags: currentTags,
        
        // Initialize with empty suggestions (will be filled by DeepSeek)
        titleSuggestions: [],
        descriptionSuggestions: [],
        tagSuggestions: [],
        editingTips: [],
        algorithmInsights: [],
        algorithmResearch: '',
        trendingOpportunities: '',
        engagementTriggers: [],
        performancePrediction: '',
        researchTimestamp: typeof window !== 'undefined' ? new Date() : new Date('2026-01-01'),
        // AI Analysis Info
        aiAnalysis: {
          metadataUsed: true,
          deepSeekUsed: false,
          geminiUsed: false,
          totalInsights: 0,
          totalTagSuggestions: 0
        },
        // Game Analysis
        gameAnalysis: {
          gameName: 'Unknown Game',
          gameGenre: 'Unknown',
          gamingPlatform: 'Unknown',
          streamingPlatform: 'Unknown',
          contentFocus: 'Unknown'
        },
        // TikTok Stats (if available)
        tiktokStats: tiktokMetadata ? {
          viewCount: tiktokMetadata.stats.views,
          likeCount: tiktokMetadata.stats.likes,
          commentCount: tiktokMetadata.stats.comments,
          shareCount: tiktokMetadata.stats.shares,
          originalAuthor: tiktokMetadata.author.displayName,
          originalHashtags: tiktokMetadata.hashtags,
          videoDuration: tiktokMetadata.duration
        } : undefined,
        // YouTube Stats (if available)
        youtubeStats: youtubeMetadata ? {
          viewCount: youtubeMetadata.stats.views,
          likeCount: youtubeMetadata.stats.likes,
          commentCount: youtubeMetadata.stats.comments,
          originalAuthor: youtubeMetadata.author.displayName,
          originalHashtags: youtubeMetadata.hashtags,
          videoDuration: youtubeMetadata.duration,
          thumbnail: youtubeMetadata.thumbnail
        } : undefined
      }
      
      // Display current metadata immediately
      setAnalysisResult(analysisData)
      
      // Then analyze with DeepSeek using current metadata
      console.log('🧠 DeepSeek analyzing displayed current content...')
      const comprehensiveResult = await analyzeWithDeepSeekOnly(currentTitle, currentDescription, currentTags, selectedPlatform)
      
      if (comprehensiveResult) {
        // Update with DeepSeek suggestions
        const updatedAnalysisData = {
          ...analysisData,
          titleSuggestions: Array.isArray(comprehensiveResult.titleSuggestions) ? comprehensiveResult.titleSuggestions : [],
          descriptionSuggestions: Array.isArray(comprehensiveResult.descriptionSuggestions) ? comprehensiveResult.descriptionSuggestions : [],
          tagSuggestions: Array.isArray(comprehensiveResult.tagSuggestions) ? comprehensiveResult.tagSuggestions : [],
          editingTips: Array.isArray(comprehensiveResult.editingTips) ? comprehensiveResult.editingTips : [],
          algorithmInsights: Array.isArray(comprehensiveResult.algorithmInsights) ? comprehensiveResult.algorithmInsights : [],
          algorithmResearch: comprehensiveResult.algorithmResearch || '',
          trendingOpportunities: comprehensiveResult.trendingOpportunities || '',
          engagementTriggers: Array.isArray(comprehensiveResult.engagementTriggers) ? comprehensiveResult.engagementTriggers : [],
          performancePrediction: comprehensiveResult.performancePrediction || '',
          gameAnalysis: comprehensiveResult.gameAnalysis || {
            gameName: 'Unknown Game',
            gameGenre: 'Unknown',
            gamingPlatform: 'Unknown',
            streamingPlatform: 'Unknown',
            contentFocus: 'Unknown'
          },
          // Update AI Analysis Info
          aiAnalysis: comprehensiveResult?.aiAnalysis ? {
            metadataUsed: !!(youtubeMetadata || tiktokMetadata),
            deepSeekUsed: !!comprehensiveResult,
            geminiUsed: !!comprehensiveResult.aiAnalysis.geminiUsed,
            totalInsights: comprehensiveResult.algorithmInsights?.length || 0,
            totalTagSuggestions: comprehensiveResult.tagSuggestions?.length || 0
          } : {
            metadataUsed: false,
            deepSeekUsed: false,
            geminiUsed: false,
            totalInsights: 0,
            totalTagSuggestions: 0
          }
        }
        
        // Update with DeepSeek results
        setAnalysisResult(updatedAnalysisData)
      }
      
      // Debug logging for tags
      console.log('🏷️ Tag Extraction Debug:', {
        youtubeTags: youtubeMetadata?.hashtags || [],
        tiktokTags: tiktokMetadata?.hashtags || [],
        finalTags: analysisData.tags,
        deepseekTagSuggestions: analysisData.tagSuggestions
      })
      
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Premium lock screen
  if (!canAccessAnalysis) {
    return (
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Clip Analysis - Premium & Subscriber Feature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-gray-400">
              <p className="text-lg mb-2">🔒 Premium & Subscriber Feature</p>
              <p>Clip Analysis with AI-powered optimization is available to premium users and subscribers only.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-green-400 font-semibold">Premium Features:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• DeepSeek AI analysis</li>
                <li>• Advanced title optimization</li>
                <li>• Algorithm-specific tags</li>
                <li>• Editing recommendations</li>
                <li>• Platform-specific insights</li>
              </ul>
            </div>
            <div className="text-yellow-400 text-sm">
              <p>Upgrade to premium or get subscriber access to unlock this feature and boost your content performance!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Clip Analysis</h2>
        <p className="text-gray-300">AI-powered content analysis and optimization recommendations</p>
      </div>
      
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Upload Video or Enter URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Mode Selection */}
          <div>
            <Label className="text-green-400">Input Method</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={inputMode === 'file' ? 'default' : 'outline'}
                onClick={() => setInputMode('file')}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <Button
                variant={inputMode === 'url' ? 'default' : 'outline'}
                onClick={() => setInputMode('url')}
                className="flex-1"
              >
                <Link className="w-4 h-4 mr-2" />
                Video URL
              </Button>
            </div>
          </div>
          
          {/* File Upload */}
          {inputMode === 'file' && (
            <div>
              <Label className="text-green-400">Select Video File</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-600 file:text-black
                    hover:file:bg-green-500
                    cursor-pointer"
                />
              </div>
            </div>
          )}
          
          {/* URL Input */}
          {inputMode === 'url' && (
            <div>
              <Label className="text-green-400">Video URL</Label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-black border border-green-500/50 rounded p-2 text-white"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          )}
          
          {/* Platform Selection */}
          <div>
            <Label className="text-green-400">Platform You're Posting To</Label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full bg-black border border-green-500/50 rounded p-2 text-white"
            >
              {platforms.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.icon} {platform.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={(!selectedFile && !videoUrl.trim()) || isAnalyzing}
            className="w-full bg-green-600 hover:bg-green-500 text-black"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {loadingMessage || 'Analyzing...'}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Analyze with DeepSeek AI
              </>
            )}
          </Button>
          
          {/* Processing Time Notice */}
          <div className="text-center">
            <p className="text-gray-400 text-xs">
              This may take a minute as AI analyzes the video and cross references it with the appropriate algorithm
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Clip Title */}
          <Card className="bg-black border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Video className="w-5 h-5" />
                Clip Title
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-blue-400">Current Title:</Label>
                <p className="text-white p-3 bg-black/50 rounded">{analysisResult.clipTitle}</p>
              </div>
              {analysisResult.titleSuggestions.length > 0 && (
                <div>
                  <Label className="text-blue-400">Algorithm-Optimized Titles:</Label>
                  <div className="space-y-2">
                    {analysisResult.titleSuggestions.map((title, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-black/50 rounded-lg">
                        <div className="text-blue-400 font-medium">{index + 1}.</div>
                        <div className="text-white">{title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clip Description */}
          <Card className="bg-black border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Clip Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-purple-400">Current Description:</Label>
                <p className="text-white p-3 bg-black/50 rounded">{analysisResult.clipDescription}</p>
              </div>
              {analysisResult.descriptionSuggestions.length > 0 && (
                <div>
                  <Label className="text-purple-400">Optimized Descriptions:</Label>
                  <div className="space-y-2">
                    {analysisResult.descriptionSuggestions.map((desc, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-black/50 rounded-lg">
                        <div className="text-purple-400 font-medium">{index + 1}.</div>
                        <div className="text-white">{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Tags & Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisResult.tags.length > 0 && (
                <div>
                  <Label className="text-green-400">Current Tags:</Label>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.tags.map((tag, index) => (
                      <Badge key={index} className="bg-green-600/20 text-green-400 border-green-500">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {analysisResult.tagSuggestions.length > 0 && (
                <div>
                  <Label className="text-green-400">Algorithm-Optimized Tag Suggestions:</Label>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.tagSuggestions.map((tag, index) => (
                      <Badge key={index} className="bg-yellow-600/20 text-yellow-400 border-yellow-500">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editing Tips */}
          <Card className="bg-black border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Editing Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.editingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-orange-400">•</div>
                    <div className="text-gray-300">{tip}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Algorithm Insights */}
          <Card className="bg-black border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-pink-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Algorithm Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.algorithmInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-pink-400">•</div>
                    <div className="text-gray-300">{insight}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Research Timestamp */}
          <div className="text-center text-xs text-gray-400">
            <p>Analysis powered by DeepSeek AI & Google AI</p>
            <p className="mt-1">Research includes VidIQ optimization strategies and current algorithm trends</p>
          </div>
        </div>
      )}
    </div>
  )
}
