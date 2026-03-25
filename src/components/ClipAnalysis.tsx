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
import { analyzeContentWithDeepSeek } from '@/lib/deepseek'
import { GeminiService } from '@/lib/gemini'
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
  editRecommendations: string[]
  algorithmInformation: string
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
  isTikTok?: boolean
}

const platforms = [
  { value: 'TikTok', label: '🎵 TikTok', icon: '🎵' },
  { value: 'YouTube', label: '📺 YouTube', icon: '📺' },
  { value: 'Instagram', label: '📷 Instagram', icon: '📷' },
  { value: 'Twitter', label: '🐦 Twitter/X', icon: '🐦' },
  { value: 'Facebook', label: '📘 Facebook', icon: '📘' }
]

function ClipAnalysis() {
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState('YouTube')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [canAccessAnalysis, setCanAccessAnalysis] = useState(false)

  useEffect(() => {
    checkAccess()
  }, [])

  const analyzeYouTubeWithGemini = async (currentTitle: string, currentDescription: string, currentTags: string[], platform: string) => {
    console.log('📺 Starting YouTube Analysis with Gemini AI:')
    console.log('📊 YouTube Content:', { currentTitle, currentDescription, currentTags, platform })
    
    try {
      console.log('🤖 Gemini analyzing YouTube content...')
      const geminiService = GeminiService.getInstance()
      const geminiAnalysis = await geminiService.analyzeYouTubeContent(currentTitle, currentDescription, currentTags, platform)
      
      console.log('🤖 GEMINI YOUTUBE RESPONSE DEBUG:')
      console.log('📊 Analysis Quality Check:')
      console.log('  ✅ Source: YouTube URL detected')
      console.log('  ✅ API: Gemini 3.1 with enhanced algorithm research')
      console.log('  ✅ Target Platform:', platform)
      console.log('  ✅ Cross-Reference: YouTube content +', platform, 'algorithm')
      console.log('  📝 Title Suggestions:', geminiAnalysis?.titleSuggestions)
      console.log('  📝 Description Suggestions:', geminiAnalysis?.descriptionSuggestions)
      console.log('  🏷️ Tag Suggestions:', geminiAnalysis?.tagSuggestions)
      console.log('  🔍 Algorithm Insights:', geminiAnalysis?.algorithmInsights)
      console.log('  📚 Algorithm Research:', geminiAnalysis?.algorithmResearch)
      console.log('  📈 Trending Opportunities:', geminiAnalysis?.trendingOpportunities)
      console.log('  ⚡ Engagement Triggers:', geminiAnalysis?.engagementTriggers)
      console.log('  🎯 Performance Prediction:', geminiAnalysis?.performancePrediction)
      console.log('  📊 Quality Metrics:')
      console.log('    - Title Count:', geminiAnalysis?.titleSuggestions?.length || 0)
      console.log('    - Description Count:', geminiAnalysis?.descriptionSuggestions?.length || 0)
      console.log('    - Tag Count:', geminiAnalysis?.tagSuggestions?.length || 0)
      console.log('    - Insight Count:', geminiAnalysis?.algorithmInsights?.length || 0)
      console.log('    - Research Depth:', geminiAnalysis?.algorithmResearch?.length || 0, 'characters')
      console.log('  🚫 Copy-Paste Check:', {
        titlesAreNew: geminiAnalysis?.titleSuggestions?.every(title => title !== currentTitle),
        descriptionsAreNew: geminiAnalysis?.descriptionSuggestions?.every(desc => desc !== currentDescription),
        hasInDepthResearch: (geminiAnalysis?.algorithmResearch?.length || 0) > 200,
        hasPlatformSpecificInsights: (geminiAnalysis?.algorithmInsights?.length || 0) >= 3
      })
      
      return {
        titleSuggestions: geminiAnalysis?.titleSuggestions || [],
        descriptionSuggestions: geminiAnalysis?.descriptionSuggestions || [],
        tagSuggestions: geminiAnalysis?.tagSuggestions || [],
        editingTips: geminiAnalysis?.algorithmInsights || [],
        algorithmInsights: geminiAnalysis?.algorithmInsights || [],
        algorithmResearch: geminiAnalysis?.algorithmResearch || '',
        trendingOpportunities: geminiAnalysis?.trendingOpportunities || '',
        engagementTriggers: geminiAnalysis?.engagementTriggers || [],
        performancePrediction: geminiAnalysis?.performancePrediction || '',
        editRecommendations: geminiAnalysis?.editRecommendations || [],
        algorithmInformation: geminiAnalysis?.algorithmInformation || '',
        aiUsed: 'gemini'
      }
    } catch (error) {
      console.warn('🤖 Gemini failed, falling back to DeepSeek:', error)
      
      try {
        console.log('🧠 DeepSeek analyzing YouTube content as fallback...')
        const deepseekAnalysis = await analyzeContentWithDeepSeek('video', platform, currentTitle, currentDescription, `Current tags: ${currentTags.join(', ')}`)
        
        console.log('🧠 DEEPSEEK YOUTUBE FALLBACK DEBUG:')
        console.log('📊 Analysis Quality Check:')
        console.log('  ⚠️ Fallback: Gemini failed, using DeepSeek')
        console.log('  ✅ Source: YouTube URL detected')
        console.log('  ✅ API: DeepSeek with enhanced algorithm research')
        console.log('  ✅ Target Platform:', platform)
        console.log('  ✅ Cross-Reference: YouTube content +', platform, 'algorithm')
        console.log('  📝 Title Suggestions:', deepseekAnalysis?.titleSuggestions)
        console.log('  📝 Description Suggestions:', deepseekAnalysis?.descriptionSuggestions)
        console.log('  🏷️ Tag Suggestions:', deepseekAnalysis?.tagSuggestions)
        console.log('  🔍 Algorithm Insights:', deepseekAnalysis?.algorithmInsights)
        console.log('  📚 Algorithm Research:', deepseekAnalysis?.algorithmResearch)
        console.log('  📈 Trending Opportunities:', deepseekAnalysis?.trendingOpportunities)
        console.log('  ⚡ Engagement Triggers:', deepseekAnalysis?.engagementTriggers)
        console.log('  🎯 Performance Prediction:', deepseekAnalysis?.performancePrediction)
        console.log('  📊 Quality Metrics:')
        console.log('    - Title Count:', deepseekAnalysis?.titleSuggestions?.length || 0)
        console.log('    - Description Count:', deepseekAnalysis?.descriptionSuggestions?.length || 0)
        console.log('    - Tag Count:', deepseekAnalysis?.tagSuggestions?.length || 0)
        console.log('    - Insight Count:', deepseekAnalysis?.algorithmInsights?.length || 0)
        console.log('    - Research Depth:', deepseekAnalysis?.algorithmResearch?.length || 0, 'characters')
        console.log('  🚫 Copy-Paste Check:', {
          titlesAreNew: deepseekAnalysis?.titleSuggestions?.every(title => title !== currentTitle),
          descriptionsAreNew: deepseekAnalysis?.descriptionSuggestions?.every(desc => desc !== currentDescription),
          hasInDepthResearch: (deepseekAnalysis?.algorithmResearch?.length || 0) > 200,
          hasPlatformSpecificInsights: (deepseekAnalysis?.algorithmInsights?.length || 0) >= 3
        })
        
        return {
          titleSuggestions: deepseekAnalysis?.titleSuggestions || [],
          descriptionSuggestions: deepseekAnalysis?.descriptionSuggestions || [],
          tagSuggestions: deepseekAnalysis?.tagSuggestions || [],
          editingTips: deepseekAnalysis?.editingTips || deepseekAnalysis?.recommendations || [],
          algorithmInsights: deepseekAnalysis?.algorithmInsights || [],
          algorithmResearch: deepseekAnalysis?.algorithmResearch || '',
          trendingOpportunities: deepseekAnalysis?.trendingOpportunities || '',
          engagementTriggers: deepseekAnalysis?.engagementTriggers || [],
          performancePrediction: deepseekAnalysis?.performancePrediction || '',
          editRecommendations: [],
          algorithmInformation: '',
          aiUsed: 'deepseek'
        }
      } catch (deepseekError) {
        console.error('❌ Both Gemini and DeepSeek failed:', deepseekError)
        return null
      }
    }
  }

  const analyzeTikTokWithGemini = async (currentTitle: string, currentDescription: string, currentTags: string[], platform: string) => {
    console.log('🎵 Starting TikTok Analysis with Gemini AI:')
    console.log('📊 TikTok Content:', { currentTitle, currentDescription, currentTags, platform })
    
    try {
      console.log('🤖 Gemini analyzing TikTok content...')
      const geminiService = GeminiService.getInstance()
      const geminiAnalysis = await geminiService.analyzeTikTokContent(currentTitle, currentDescription, currentTags, platform)
      
      console.log('🤖 GEMINI TIKTOK RESPONSE DEBUG:')
      console.log('📊 Analysis Quality Check:')
      console.log('  ✅ Source: TikTok URL detected')
      console.log('  ✅ API: Gemini 3.1 with enhanced algorithm research')
      console.log('  ✅ Target Platform:', platform)
      console.log('  ✅ Cross-Reference: TikTok content +', platform, 'algorithm')
      console.log('  📝 Description Suggestions:', geminiAnalysis?.descriptionSuggestions)
      console.log('  🏷️ Tag Suggestions:', geminiAnalysis?.tagSuggestions)
      console.log('  🔍 Algorithm Insights:', geminiAnalysis?.algorithmInsights)
      console.log('  📚 Algorithm Research:', geminiAnalysis?.algorithmResearch)
      console.log('  📈 Trending Opportunities:', geminiAnalysis?.trendingOpportunities)
      console.log('  ⚡ Engagement Triggers:', geminiAnalysis?.engagementTriggers)
      console.log('  🎯 Performance Prediction:', geminiAnalysis?.performancePrediction)
      console.log('  📊 Quality Metrics:')
      console.log('    - Description Count:', geminiAnalysis?.descriptionSuggestions?.length || 0)
      console.log('    - Tag Count:', geminiAnalysis?.tagSuggestions?.length || 0)
      console.log('    - Insight Count:', geminiAnalysis?.algorithmInsights?.length || 0)
      console.log('    - Research Depth:', geminiAnalysis?.algorithmResearch?.length || 0, 'characters')
      console.log('  🚫 Copy-Paste Check:', {
        descriptionsAreNew: geminiAnalysis?.descriptionSuggestions?.every(desc => desc !== currentDescription),
        hasInDepthResearch: (geminiAnalysis?.algorithmResearch?.length || 0) > 200,
        hasPlatformSpecificInsights: (geminiAnalysis?.algorithmInsights?.length || 0) >= 3
      })
      
      return {
        descriptionSuggestions: geminiAnalysis?.descriptionSuggestions || [],
        tagSuggestions: geminiAnalysis?.tagSuggestions || [],
        editingTips: geminiAnalysis?.algorithmInsights || [],
        algorithmInsights: geminiAnalysis?.algorithmInsights || [],
        algorithmResearch: geminiAnalysis?.algorithmResearch || '',
        trendingOpportunities: geminiAnalysis?.trendingOpportunities || '',
        engagementTriggers: geminiAnalysis?.engagementTriggers || [],
        performancePrediction: geminiAnalysis?.performancePrediction || '',
        editRecommendations: geminiAnalysis?.editRecommendations || [],
        algorithmInformation: geminiAnalysis?.algorithmInformation || '',
        aiUsed: 'gemini'
      }
    } catch (error) {
      console.warn('🤖 Gemini failed, falling back to DeepSeek:', error)
      
      try {
        console.log('🧠 DeepSeek analyzing TikTok content as fallback...')
        const deepseekAnalysis = await analyzeContentWithDeepSeek('video', platform, currentTitle, currentDescription, `Current tags: ${currentTags.join(', ')}`)
        
        console.log('🧠 DEEPSEEK TIKTOK FALLBACK DEBUG:')
        console.log('📊 Analysis Quality Check:')
        console.log('  ⚠️ Fallback: Gemini failed, using DeepSeek')
        console.log('  ✅ Source: TikTok URL detected')
        console.log('  ✅ API: DeepSeek with enhanced algorithm research')
        console.log('  ✅ Target Platform:', platform)
        console.log('  ✅ Cross-Reference: TikTok content +', platform, 'algorithm')
        console.log('  📝 Description Suggestions:', deepseekAnalysis?.descriptionSuggestions)
        console.log('  🏷️ Tag Suggestions:', deepseekAnalysis?.tagSuggestions)
        console.log('  🔍 Algorithm Insights:', deepseekAnalysis?.algorithmInsights)
        console.log('  📚 Algorithm Research:', deepseekAnalysis?.algorithmResearch)
        console.log('  📈 Trending Opportunities:', deepseekAnalysis?.trendingOpportunities)
        console.log('  ⚡ Engagement Triggers:', deepseekAnalysis?.engagementTriggers)
        console.log('  🎯 Performance Prediction:', deepseekAnalysis?.performancePrediction)
        console.log('  📊 Quality Metrics:')
        console.log('    - Description Count:', deepseekAnalysis?.descriptionSuggestions?.length || 0)
        console.log('    - Tag Count:', deepseekAnalysis?.tagSuggestions?.length || 0)
        console.log('    - Insight Count:', deepseekAnalysis?.algorithmInsights?.length || 0)
        console.log('    - Research Depth:', deepseekAnalysis?.algorithmResearch?.length || 0, 'characters')
        console.log('  🚫 Copy-Paste Check:', {
          descriptionsAreNew: deepseekAnalysis?.descriptionSuggestions?.every(desc => desc !== currentDescription),
          hasInDepthResearch: (deepseekAnalysis?.algorithmResearch?.length || 0) > 200,
          hasPlatformSpecificInsights: (deepseekAnalysis?.algorithmInsights?.length || 0) >= 3
        })
        
        return {
          descriptionSuggestions: deepseekAnalysis?.descriptionSuggestions || [],
          tagSuggestions: deepseekAnalysis?.tagSuggestions || [],
          editingTips: deepseekAnalysis?.editingTips || deepseekAnalysis?.recommendations || [],
          algorithmInsights: deepseekAnalysis?.algorithmInsights || [],
          algorithmResearch: deepseekAnalysis?.algorithmResearch || '',
          trendingOpportunities: deepseekAnalysis?.trendingOpportunities || '',
          engagementTriggers: deepseekAnalysis?.engagementTriggers || [],
          performancePrediction: deepseekAnalysis?.performancePrediction || '',
          editRecommendations: [],
          algorithmInformation: '',
          aiUsed: 'deepseek'
        }
      } catch (deepseekError) {
        console.error('❌ Both Gemini and DeepSeek failed:', deepseekError)
        return null
      }
    }
  }

  const checkAccess = async () => {
    try {
      const subscribersManager = SubscribersManager.getInstance()
      const activeSubscribers = subscribersManager.getSubscribers()
      const hasAccess = activeSubscribers.length > 0 || subscribersManager.isAdmin('bulletbait604')
      setCanAccessAnalysis(hasAccess)
    } catch (error) {
      console.error('❌ Access check failed:', error)
      setCanAccessAnalysis(false)
    }
  }

  const handleAnalyze = async () => {
    if (!canAccessAnalysis) {
      alert('Clip Analysis is a premium feature. Please subscribe to access.')
      return
    }

    if ((!selectedFile && !videoUrl.trim()) || isAnalyzing) {
      return
    }

    setIsAnalyzing(true)
    setLoadingMessage('Extracting metadata...')

    try {
      let currentTitle = ''
      let currentDescription = ''
      let currentTags: string[] = []
      let tiktokMetadata = null
      let youtubeMetadata = null

      if (videoUrl.trim()) {
        setLoadingMessage('Extracting metadata from URL...')
        
        const isTikTok = videoUrl.includes('tiktok.com') || videoUrl.includes('vm.tiktok.com')
        console.log('🎵 TikTok Detection:', { isTikTok, url: videoUrl })
        
        if (isTikTok) {
          console.log('🎵 Extracting TikTok metadata...')
          tiktokMetadata = await TikTokMetadataService.extractMetadata(videoUrl)
          console.log('🎵 TikTok Metadata:', tiktokMetadata)
          
          if (tiktokMetadata) {
            currentTitle = tiktokMetadata.title
            currentDescription = tiktokMetadata.video_description
            currentTags = tiktokMetadata.hashtags
          }
        } else {
          console.log('📺 Extracting YouTube metadata...')
          youtubeMetadata = await YouTubeMetadataService.extractMetadata(videoUrl)
          console.log('📺 YouTube Metadata:', youtubeMetadata)
          
          if (youtubeMetadata) {
            currentTitle = youtubeMetadata.title
            currentDescription = youtubeMetadata.description
            currentTags = youtubeMetadata.tags
          }
        }
      }

      console.log('🏷️ Metadata Extraction Debug:', {
        platform: isTikTok ? 'TikTok' : 'YouTube',
        title: currentTitle,
        description: currentDescription,
        descriptionLength: currentDescription.length,
        descriptionPreview: currentDescription.substring(0, 100) + (currentDescription.length > 100 ? '...' : ''),
        tags: currentTags,
        tagCount: currentTags.length,
        tagPreview: currentTags.slice(0, 3).join(', '),
        tiktokMetadata: tiktokMetadata ? {
          id: tiktokMetadata.id,
          author: tiktokMetadata.author,
          stats: tiktokMetadata.stats,
          hashtags: tiktokMetadata.hashtags,
          duration: tiktokMetadata.duration
        } : null,
        youtubeMetadata: youtubeMetadata ? {
          id: youtubeMetadata.id,
          title: youtubeMetadata.title,
          description: youtubeMetadata.description,
          hashtags: youtubeMetadata.tags,
          duration: youtubeMetadata.duration
        } : null
      })
      
      const analysisData: AnalysisResult = {
        clipTitle: currentTitle,
        titleSuggestions: [],
        clipDescription: currentDescription,
        descriptionSuggestions: [],
        tags: currentTags,
        tagSuggestions: [],
        editingTips: [],
        algorithmInsights: [],
        algorithmResearch: '',
        trendingOpportunities: '',
        engagementTriggers: [],
        performancePrediction: '',
        editRecommendations: [],
        algorithmInformation: '',
        gameAnalysis: {
          gameName: 'Unknown Game',
          gameGenre: 'Unknown',
          gamingPlatform: 'Unknown',
          streamingPlatform: 'Unknown',
          contentFocus: 'Unknown'
        },
        aiAnalysis: {
          metadataUsed: !!(youtubeMetadata || tiktokMetadata),
          deepSeekUsed: false,
          geminiUsed: false,
          totalInsights: 0,
          totalTagSuggestions: 0
        },
        isTikTok: isTikTok || false
      }

      let comprehensiveResult = null
      
      if (isTikTok) {
        console.log('🎵 Using TikTok-specific analysis with Gemini AI...')
        console.log('🎵 TikTok Content Analysis Flow:')
        console.log('  1. Source: TikTok URL detected')
        console.log('  2. Extracted: TikTok metadata via TikTok API')
        console.log('  3. Target Platform:', selectedPlatform)
        console.log('  4. AI: Gemini analyzing TikTok content +', selectedPlatform, 'algorithm')
        comprehensiveResult = await analyzeTikTokWithGemini(currentTitle, currentDescription, currentTags, selectedPlatform)
      } else {
        console.log('📺 Using Gemini analysis for YouTube content...')
        console.log('📺 YouTube Content Analysis Flow:')
        console.log('  1. Source: YouTube URL detected')
        console.log('  2. Extracted: YouTube metadata via YouTube API')
        console.log('  3. Target Platform:', selectedPlatform)
        console.log('  4. AI: Gemini analyzing YouTube content +', selectedPlatform, 'algorithm')
        comprehensiveResult = await analyzeYouTubeWithGemini(currentTitle, currentDescription, currentTags, selectedPlatform)
      }
      
      if (comprehensiveResult) {
        const updatedAnalysisData = {
          ...analysisData,
          titleSuggestions: Array.isArray((comprehensiveResult as any).titleSuggestions) ? (comprehensiveResult as any).titleSuggestions : [],
          descriptionSuggestions: Array.isArray(comprehensiveResult.descriptionSuggestions) ? comprehensiveResult.descriptionSuggestions : [],
          tagSuggestions: Array.isArray(comprehensiveResult.tagSuggestions) ? comprehensiveResult.tagSuggestions : [],
          editingTips: Array.isArray(comprehensiveResult.editingTips) ? comprehensiveResult.editingTips : [],
          algorithmInsights: Array.isArray(comprehensiveResult.algorithmInsights) ? comprehensiveResult.algorithmInsights : [],
          algorithmResearch: comprehensiveResult.algorithmResearch || '',
          trendingOpportunities: comprehensiveResult.trendingOpportunities || '',
          engagementTriggers: Array.isArray(comprehensiveResult.engagementTriggers) ? comprehensiveResult.engagementTriggers : [],
          performancePrediction: comprehensiveResult.performancePrediction || '',
          editRecommendations: Array.isArray(comprehensiveResult.editRecommendations) ? comprehensiveResult.editRecommendations : [],
          algorithmInformation: comprehensiveResult.algorithmInformation || '',
          aiAnalysis: {
            metadataUsed: analysisData.aiAnalysis?.metadataUsed || false,
            deepSeekUsed: (comprehensiveResult as any).aiUsed === 'deepseek',
            geminiUsed: (comprehensiveResult as any).aiUsed === 'gemini',
            totalInsights: (comprehensiveResult.algorithmInsights?.length || 0) + (comprehensiveResult.editingTips?.length || 0),
            totalTagSuggestions: comprehensiveResult.tagSuggestions?.length || 0
          }
        }
        
        setAnalysisResult(updatedAnalysisData)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setVideoUrl('')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">🎬 Clip Analysis</h1>
          <p className="text-gray-400 mb-6">AI-powered content optimization with algorithm research</p>
        </div>

        {!canAccessAnalysis ? (
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Clip Analysis - Premium & Subscriber Feature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-lg mb-2">🔒 Premium & Subscriber Feature</p>
                <p>Clip Analysis with AI-powered optimization is available to premium users and subscribers only.</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>✨ <strong>Advanced AI Analysis</strong> - Gemini & DeepSeek powered</p>
                  <p>🎯 <strong>Algorithm Research</strong> - Platform-specific insights</p>
                  <p>📈 <strong>Optimization Suggestions</strong> - Titles, descriptions & tags</p>
                  <p>🔍 <strong>Copy-Paste Prevention</strong> - Always generates new content</p>
                  <p>⚡ <strong>Engagement Triggers</strong> - Platform-specific strategies</p>
                </div>
                <div className="mt-6 space-y-2">
                  <Button 
                    onClick={() => window.location.href = '/subscribe'}
                    className="w-full bg-green-600 hover:bg-green-500 text-black"
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">🎬 Clip Analysis</CardTitle>
              <CardDescription>
                Enter a video URL or upload a file to analyze content with AI-powered optimization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-green-400">Video URL</Label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-black border border-green-500/50 rounded p-2 text-white placeholder:text-gray-400"
                  placeholder="https://youtube.com/watch?v=... or https://tiktok.com/@user/video/..."
                />
              </div>
              
              {selectedFile && (
                <div>
                  <Label className="text-green-400">Select Video File</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-black hover:file:bg-green-500 file:cursor-pointer"
                    />
                  </div>
                </div>
              )}
              
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
              
              <div>
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
                      Analyze Content
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {analysisResult && (
          <Card className="bg-black border-green-500/30 mt-8">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Analysis Results
                {analysisResult.aiAnalysis && (
                  <Badge className="ml-2" variant="secondary">
                    {analysisResult.aiAnalysis.geminiUsed ? 'Gemini AI' : 'DeepSeek AI'}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">📋 Original Content</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-gray-400 text-sm">Title</Label>
                      <p className="text-white bg-gray-900 p-2 rounded">{analysisResult.clipTitle}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Description</Label>
                      <p className="text-white bg-gray-900 p-2 rounded text-sm max-h-20 overflow-y-auto">
                        {analysisResult.clipDescription}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Tags</Label>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-green-400 mb-4">🤖 AI Optimization Suggestions</h3>
                
                {analysisResult.titleSuggestions && analysisResult.titleSuggestions.length > 0 && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">📝 Title Suggestions</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {analysisResult.titleSuggestions.map((title, index) => (
                        <div key={index} className="bg-gray-900 p-3 rounded border border-green-500/30">
                          <p className="text-white text-sm">{title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.descriptionSuggestions && analysisResult.descriptionSuggestions.length > 0 && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">📝 Description Suggestions</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {analysisResult.descriptionSuggestions.map((description, index) => (
                        <div key={index} className="bg-gray-900 p-3 rounded border border-green-500/30">
                          <p className="text-white text-sm">{description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.tagSuggestions && analysisResult.tagSuggestions.length > 0 && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">🏷️ Tag Suggestions</Label>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.tagSuggestions.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.editRecommendations && analysisResult.editRecommendations.length > 0 && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">📝 Detailed Edit Recommendations</Label>
                    <div className="space-y-2">
                      {analysisResult.editRecommendations.map((recommendation, index) => (
                        <div key={index} className="bg-gray-900 p-3 rounded border border-green-500/30">
                          <p className="text-white text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.algorithmInformation && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">🔍 {selectedPlatform} Algorithm Information</Label>
                    <div className="bg-gray-900 p-4 rounded border border-green-500/30">
                      <p className="text-white text-sm whitespace-pre-wrap">{analysisResult.algorithmInformation}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisResult.algorithmInsights && analysisResult.algorithmInsights.length > 0 && (
                    <div>
                      <Label className="text-green-400 text-sm mb-2">💡 Algorithm Insights</Label>
                      <div className="space-y-1">
                        {analysisResult.algorithmInsights.map((insight, index) => (
                          <div key={index} className="bg-gray-900 p-2 rounded border border-green-500/30">
                            <p className="text-white text-xs">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.trendingOpportunities && (
                    <div>
                      <Label className="text-green-400 text-sm mb-2">📈 Trending Opportunities</Label>
                      <div className="bg-gray-900 p-3 rounded border border-green-500/30">
                        <p className="text-white text-sm">{analysisResult.trendingOpportunities}</p>
                      </div>
                    </div>
                  )}

                  {analysisResult.engagementTriggers && analysisResult.engagementTriggers.length > 0 && (
                    <div>
                      <Label className="text-green-400 text-sm mb-2">⚡ Engagement Triggers</Label>
                      <div className="space-y-1">
                        {analysisResult.engagementTriggers.map((trigger, index) => (
                          <div key={index} className="bg-gray-900 p-2 rounded border border-green-500/30">
                            <p className="text-white text-xs">{trigger}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {analysisResult.performancePrediction && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">🎯 Performance Prediction</Label>
                    <div className="bg-gray-900 p-3 rounded border border-green-500/30">
                      <p className="text-white text-sm">{analysisResult.performancePrediction}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-center text-xs text-gray-400">
                  <p>Analysis powered by DeepSeek AI & Google AI</p>
                  <p className="mt-1">Research includes VidIQ optimization strategies and current algorithm trends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ClipAnalysis
export { ClipAnalysis }
